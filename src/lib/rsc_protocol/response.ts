import { RSC_MEDIA_TYPE } from "./constants.ts";

export class RscResponse extends Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    let { headers, ...rest } = init ?? {};

    headers = new Headers(headers);
    headers.set("content-type", RSC_MEDIA_TYPE);

    super(body, { headers, ...rest });
  }
}
