export interface Route {
  pattern: URLPattern;
  middleware: Middleware;
}

export interface MiddlewareObject<T = object> {
  handle(request: Request, next: Next<T>): Response | Promise<Response>;
}

export type Next<T = object> = {
  (request: Request, ctx?: T): Promise<Response>;
} & Readonly<Partial<T>>;

export interface Middleware<T = object> {
  (
    request: Request,
    next: Next<T>,
  ): Response | Promise<Response>;
}

export interface Handler {
  (request: Request): Response | Promise<Response>;
}

export interface HandlerObject {
  handle(request: Request): Response | Promise<Response>;
}

export type HandlerOrHandlerObject = Handler | HandlerObject;
export type MiddlewareOrMiddlewareObject<T = object> =
  | Middleware<T>
  | MiddlewareObject<T>;
