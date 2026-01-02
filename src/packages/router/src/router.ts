import type {
  Handler,
  HandlerOrHandlerObject,
  Middleware,
  MiddlewareObject,
  MiddlewareOrMiddlewareObject,
  Next,
  Route,
} from "./types.ts";
import { normalizeMiddleware } from "./utils.ts";

function defaultFallback(): Response {
  return new Response(null, { status: 404 });
}

export interface RouterOptions {
  fallback?: Handler;
}

export class Router<T = unknown> implements MiddlewareObject<T> {
  #routes: Route[];
  #fallback: Handler;

  constructor(routes: Route[] = [], options?: RouterOptions) {
    const { fallback = defaultFallback } = options ?? {};

    this.#fallback = fallback;
    this.#routes = routes;
  }

  get(
    pathname: string,
    handler: HandlerOrHandlerObject,
  ): Router<T> {
    const pattern = new URLPattern({ pathname });
    const middleware = toMiddleware(handler);
    const route = {
      pattern,
      middleware,
    } satisfies Route;
    const routes = this.#routes.concat(route);

    return new Router(routes, { fallback: this.#fallback });
  }

  use(middleware: MiddlewareOrMiddlewareObject<T>): Router<T> {
    const pattern = new URLPattern({});
    const normalizedMiddleware = normalizeMiddleware(
      middleware as MiddlewareOrMiddlewareObject,
    );
    const route = {
      pattern,
      middleware: normalizedMiddleware,
    } satisfies Route;
    const routes = this.#routes.concat(route);

    return new Router(routes, { fallback: this.#fallback });
  }

  fetch(request: Request): Promise<Response> {
    const middlewares = this.#routes.filter((route) =>
      route.pattern.test(request.url)
    ).map((route) => route.middleware);
    return exec(
      request,
      middlewares,
      this.#fallback,
      {},
    );
  }

  handle(request: Request, next: Next<T>): Promise<Response> {
    const middlewares = this.#routes.filter((route) =>
      route.pattern.test(request.url)
    ).map((route) => route.middleware);

    const middleware: Middleware = (
      request: Request,
      ctx: object,
    ): Promise<Response> => {
      return next(request, ctx as T);
    };

    return exec(
      request,
      middlewares.concat(middleware),
      this.#fallback,
      next,
    );
  }
}

async function exec(
  request: Request,
  middlewares: readonly Middleware[],
  fallback: Handler,
  context: object,
): Promise<Response> {
  const [middleware, ...rest] = middlewares;

  if (!middleware) return await fallback(request);

  function next(request: Request, ctx: object | undefined): Promise<Response> {
    const merged = { ...context, ...ctx };
    return exec(request, rest, fallback, merged);
  }

  Object.entries(context).forEach(([key, value]) => {
    Object.defineProperty(next, key, { value });
  });

  return await middleware(request, next);
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
