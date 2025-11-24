import type {
  Handler,
  HandlerOrHandlerObject,
  Middleware,
  MiddlewareOrMiddlewareObject,
  Route,
} from "./types.ts";

export class Router<T> {
  #routes: Route[] = [];

  get(
    pathname: string,
    handler: HandlerOrHandlerObject,
  ): this {
    const pattern = new URLPattern({ pathname });
    const middleware = toMiddleware(handler);
    const route = {
      pattern,
      middleware,
    } satisfies Route;

    this.#routes.push(route);

    return this;
  }

  use(middleware: MiddlewareOrMiddlewareObject<T>): this {
    const pattern = new URLPattern({});
    const normalizedMiddleware = normalizeMiddleware(
      middleware as MiddlewareOrMiddlewareObject,
    );
    const route = {
      pattern,
      middleware: normalizedMiddleware,
    } satisfies Route;

    this.#routes.push(route);

    return this;
  }

  fetch(request: Request): Promise<Response> {
    return exec(request, this.#routes, new Response(), undefined);
  }
}
function exec(
  request: Request,
  routes: readonly Route[],
  fallback: Response,
  context: object | undefined,
): Promise<Response> {
  const [route, ...rest] = routes;

  if (!route) return Promise.resolve(fallback);

  const result = route.pattern.test(request.url);

  function next(request: Request, ctx: object | undefined): Promise<Response> {
    const merged = { ...context, ...ctx };
    return exec(request, rest, fallback, merged);
  }

  Object.entries(context ?? {}).forEach(([key, value]) => {
    Object.defineProperty(next, key, { value });
  });

  if (result) {
    return Promise.resolve(route.middleware(request, next));
  }

  return next(request, context);
}

function toMiddleware(handler: HandlerOrHandlerObject): Middleware {
  const normalizedHandler = normalizeHandler(handler);

  return (request) => {
    return normalizedHandler(request);
  };
}

function normalizeHandler(handler: HandlerOrHandlerObject): Handler {
  if (typeof handler === "function") return handler;

  return handler.handle.bind(handler);
}

function normalizeMiddleware(
  middleware: MiddlewareOrMiddlewareObject,
): Middleware {
  if (typeof middleware === "function") return middleware;

  return middleware.handle.bind(middleware);
}
