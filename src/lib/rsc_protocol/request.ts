// - Use `x-rsc-action` header to pass server action ID
import { HEADER_ACTION_ID, RSC_MEDIA_TYPE } from "./constants.ts";
import type { Action } from "./types.ts";

export interface RscRequestInit extends RequestInit {
  action?: Action;
}

export class RscRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RscRequestInit) {
    let { headers, method, action, ...rest } = init ?? {};
    headers = new Headers(headers);
    headers.append("accept", RSC_MEDIA_TYPE);

    if (action) headers.set(HEADER_ACTION_ID, action.id);

    method ??= action ? "POST" : "GET";

    super(input, {
      headers,
      method,
      ...rest,
    });
  }
}
