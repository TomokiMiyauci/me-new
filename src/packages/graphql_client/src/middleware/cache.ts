import type { MiddlewareObject } from "../types.ts";

export interface Store {
  match(reequest: Request): Promise<Response | undefined>;
  put(request: Request, resopnse: Response): Promise<unknown>;
}

export class Cache implements MiddlewareObject {
  constructor(public store: Store) {}

  async handle(
    request: Request,
    next: (request: Request) => Promise<Response>,
  ): Promise<Response> {
    const result = await this.store.match(request);

    if (result) return result;

    const response = await next(request);

    await this.store.put(request, response);

    return response;
  }
}
