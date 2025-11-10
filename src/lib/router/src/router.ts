import type {
  Handler,
  HandlerOrHandlerObject,
  Middleware,
  MiddlewareOrMiddlewareObject,
  Route,
} from "./types.ts";

export class Router {
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

  use(middleware: MiddlewareOrMiddlewareObject): this {
    const pattern = new URLPattern({});
    const normalizedMiddleware = normalizeMiddleware(middleware);
    const route = {
      pattern,
      middleware: normalizedMiddleware,
    } satisfies Route;

    this.#routes.push(route);

    return this;
  }

  fetch(request: Request): Promise<Response> {
    return exec(request, this.#routes, new Response());
  }
}

function exec(
  request: Request,
  routes: readonly Route[],
  fallback: Response,
): Promise<Response> {
  const [route, ...rest] = routes;

  if (!route) return Promise.resolve(fallback);

  const result = route.pattern.test(request.url);

  function next(): Promise<Response> {
    return exec(request, rest, fallback);
  }

  if (result) {
    return Promise.resolve(route.middleware(request, next));
  }

  return next();
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
