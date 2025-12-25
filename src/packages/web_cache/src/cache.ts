import CachePolicy from "http-cache-semantics";
import type { Store } from "./store.ts";

export class WebCache {
  constructor(public store: Store) {}

  async match(request: Request): Promise<Response | undefined> {
    const entry = await this.store.getEntry(request);
    if (!entry) return undefined;

    const [originReq, cachedRes] = entry;

    const req = toReq(originReq);
    const res = toRes(cachedRes);

    const policy = new CachePolicy(req, res);

    const shouldNotRevalidate = policy.satisfiesWithoutRevalidation(
      toReq(request),
    );

    if (shouldNotRevalidate) {
      return cachedRes;
    }

    await this.store.delete(originReq);

    return undefined;
  }

  async put(request: Request, response: Response): Promise<boolean> {
    const req = toReq(request);
    const res = toRes(response);
    const policy = new CachePolicy(req, res);

    const storable = policy.storable();

    if (storable) {
      await this.store.put(request, response);
      return true;
    }

    return false;
  }
}

function toReq(request: Request): CachePolicy.Request {
  return {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  };
}
function toRes(response: Response): CachePolicy.Response {
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
  };
}
