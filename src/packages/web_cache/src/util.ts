import type { Store } from "./store.ts";

const ID_KEY = "x-cache-id";

export function fromCache(cache: Cache): Store {
  const map = new Map<string, Request>();

  return {
    async get(request: Request): Promise<Response | undefined> {
      return await cache.match(request);
    },

    async getEntry(request: Request): Promise<[Request, Response] | undefined> {
      const response = await cache.match(request);

      if (!response) return undefined;

      const id = response.headers.get(ID_KEY);
      const originalReq = id ? map.get(id) : undefined;

      if (!id || !originalReq) {
        await cache.delete(request);
        return;
      }

      response.headers.delete(ID_KEY);

      return [originalReq, response];
    },

    async put(request: Request, response: Response): Promise<void> {
      const id = crypto.randomUUID();
      map.set(id, request);

      const headers = new Headers(response.headers);
      headers.set(ID_KEY, id);

      const responseWithId = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });

      await cache.put(request, responseWithId);
    },

    async delete(request: Request): Promise<void> {
      const response = await cache.match(request);

      if (response) {
        const id = response.headers.get(ID_KEY);

        if (id) map.delete(id);
      }

      await cache.delete(request);
    },
  };
}
