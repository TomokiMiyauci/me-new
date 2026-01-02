import type { CallableContext, MiddlewareObject, Next } from "@/types.ts";
import { randomBytes } from "node:crypto";

export class Csp implements MiddlewareObject<NonceContext> {
  value: string;
  constructor(value: CspDerectives | string) {
    const raw = typeof value === "string" ? value : this.stringify(value);
    this.value = escapeHeaderValue(raw);
  }
  async handle(
    request: Request,
    next: CallableContext<NonceContext>,
  ): Promise<Response> {
    const nonce = next.nonce;
    const response = await next(request);

    const contentType = response.headers.get("content-type");

    if (typeof nonce === "string" && contentType?.includes("text/html")) {
      response.headers.append("Content-Security-Policy", this.value);
    }

    return response;
  }

  stringify(value: CspDerectives): string {
    return Object.entries(value).reduce(
      (acc, [key, values]: [key: string, values: string[]]) => {
        const v = values.reduce((acc, cur) => acc + " " + cur, "");

        return acc + key + " " + v + ";";
      },
      "",
    );
  }
}

interface CspDerectives {
  "default-src"?: string[];
  "script-src"?: string[];
  "style-src"?: string[];
  "img-src"?: string[];
  "report-uri"?: string[];
  "connect-src"?: string[];
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

function escapeHeaderValue(value: string): string {
  return value.replaceAll("\n", "");
}
