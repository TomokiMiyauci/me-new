import type { Middleware, MiddlewareOrMiddlewareObject } from "./types.ts";

export function normalizeMiddleware<T>(
  middleware: MiddlewareOrMiddlewareObject<T>,
): Middleware<T> {
  if (typeof middleware === "function") return middleware;

  return middleware.handle.bind(middleware);
}
