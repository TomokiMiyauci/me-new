import { KEY } from "./constant.ts";
import NotFoundError from "./error.ts";

export interface NotFoundErrorLike {
  digest: "NOT_FOUND";
}

export function isNotFoundErrorLike(e: unknown): e is NotFoundErrorLike {
  return !!e && typeof e === "object" && "digest" in e && e.digest === KEY;
}

export function notFound(message?: string): never {
  const err = new NotFoundError(message);

  throw err;
}
