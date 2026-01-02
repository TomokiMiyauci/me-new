import type {
  CallableContext,
  Middleware,
  MiddlewareObject,
} from "../types.ts";
import { normalizeMiddleware } from "../utils.ts";

export function dynamic<T>(
  fn: (
    request: Request,
    ctx: CallableContext<T>,
  ) => Middleware<T> | MiddlewareObject<T>,
): Middleware<T> {
  return (request, next) => {
    const middlewareOrMiddlewareObject = fn(request, next);
    const middleware = normalizeMiddleware<T>(middlewareOrMiddlewareObject);

    return middleware(request, next);
  };
}
