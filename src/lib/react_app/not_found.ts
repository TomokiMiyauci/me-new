export function notFound(message?: string): never {
  const e = new NotFoundError(message);

  throw e;
}

export class NotFoundError extends Error {
  override name: string = "NotFound";
}

export function isNotFoundError(e: unknown): e is NotFoundError {
  return e instanceof Error && e.name === "NotFound";
}
