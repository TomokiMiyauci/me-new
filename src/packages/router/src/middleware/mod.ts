import type { Middleware, MiddlewareObject, Next } from "../types.ts";
import { normalizeMiddleware } from "../utils.ts";

export function dynamic<T>(
  fn: (request: Request, next: Next<T>) => Middleware<T> | MiddlewareObject<T>,
): Middleware<T> {
  return (request, next) => {
    const middlewareOrMiddlewareObject = fn(request, next);
    const x = normalizeMiddleware<T>(middlewareOrMiddlewareObject);
    return x(request, next);
  };
}
