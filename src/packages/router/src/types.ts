export interface Route {
  pattern: URLPattern;
  middleware: Middleware;
}

export interface MiddlewareObject<T = object> {
  handle(
    request: Request,
    ctx: CallableContext<T>,
  ): Response | Promise<Response>;
}

export interface Next<T = object> {
  (request: Request, ctx?: T): Promise<Response>;
}

export type CallableContext<T> = Next<T> & Readonly<Partial<T>>;

export interface Middleware<T = object> {
  (request: Request, ctx: CallableContext<T>): Response | Promise<Response>;
}

export interface Handler {
  (request: Request): Response | Promise<Response>;
}

export interface HandlerObject {
  fetch(request: Request): Response | Promise<Response>;
}

export type HandlerOrHandlerObject = Handler | HandlerObject;
export type MiddlewareOrMiddlewareObject<T = object> =
  | Middleware<T>
  | MiddlewareObject<T>;
