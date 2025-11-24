import type { MiddlewareObject, Next } from "../types.ts";
import { randomBytes } from "node:crypto";

export class Csp implements MiddlewareObject<NonceContext> {
  async handle(
    request: Request,
    next: Next<NonceContext>,
  ): Promise<Response> {
    const nonce = next.nonce;
    const response = await next(request);

    const contentType = response.headers.get("content-type");

    if (typeof nonce === "string" && contentType?.includes("text/html")) {
      response.headers.append(
        "Content-Security-Policy",
        `script-src 'nonce-${nonce}'`,
      );
    }

    return response;
  }
}

export interface NonceContext {
  nonce: string;
}

export class NonceProvider implements MiddlewareObject<NonceContext> {
  async handle(
    request: Request,
    next: Next<NonceContext>,
  ): Promise<Response> {
    const nonce = randomBytes(16).toString("base64");

    return await next(request, { nonce });
  }
}
