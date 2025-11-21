const KEY = "NOT_FOUND";
export function notFound(message?: string): never {
  const err = new NotFoundError(message);

  throw err;
}

export class NotFoundError extends Error {
  override name: string = "NotFound";

  digest = KEY;
}

export interface NotFoundErrorLike {
  digest: "NOT_FOUND";
}

export function isNotFoundErrorLike(e: unknown): e is NotFoundErrorLike {
  return !!e && typeof e === "object" && "digest" in e && e.digest === KEY;
}
