interface Store extends globalThis.Cache {}

export class WebCache {
  constructor(public store: Store) {}

  async handle(
    request: Request,
    next: (request: Request) => Promise<Response>,
  ): Promise<Response> {
    const result = await this.store.match(request);

    if (result) return result;

    const response = await next(request);

    await this.store.put(request, response.clone());

    return response;
  }
}
