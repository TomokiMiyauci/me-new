export interface Next {
  (request: Request): Promise<Response>;
}

export interface Middleware {
  (request: Request, next: Next): Promise<Response> | Response;
}

export interface MiddlewareObject {
  handle(request: Request, next: Next): Promise<Response> | Response;
}

export type MiddlewareOrMiddlewareObject = Middleware | MiddlewareObject;
