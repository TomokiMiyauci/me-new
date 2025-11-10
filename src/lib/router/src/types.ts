export interface Route {
  pattern: URLPattern;
  middleware: Middleware;
}

export interface MiddlewareObject {
  handle(
    request: Request,
    next: () => Promise<Response>,
  ): Response | Promise<Response>;
}

export interface Middleware {
  (
    request: Request,
    next: () => Promise<Response>,
  ): Response | Promise<Response>;
}

export interface Handler {
  (request: Request): Response | Promise<Response>;
}

export interface HandlerObject {
  handle(request: Request): Response | Promise<Response>;
}

export type HandlerOrHandlerObject = Handler | HandlerObject;
export type MiddlewareOrMiddlewareObject = Middleware | MiddlewareObject;
