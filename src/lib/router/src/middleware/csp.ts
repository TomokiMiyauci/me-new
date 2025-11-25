import type { MiddlewareObject, Next } from "../types.ts";
import { randomBytes } from "node:crypto";

export class Csp implements MiddlewareObject<NonceContext> {
  constructor(
    public value: CspDerectives | Lazy<CspDerectives, Partial<NonceContext>>,
  ) {}
  async handle(
    request: Request,
    next: Next<NonceContext>,
  ): Promise<Response> {
    const nonce = next.nonce;
    const response = await next(request);

    const contentType = response.headers.get("content-type");

    if (typeof nonce === "string" && contentType?.includes("text/html")) {
      const cspValue = await this.eval(request, next);
      const value = this.stringify(cspValue);

      response.headers.append("Content-Security-Policy", value);
    }

    return response;
  }

  async eval(
    request: Request,
    ctx: Partial<NonceContext>,
  ): Promise<CspDerectives> {
    if (typeof this.value === "function") {
      return await this.value(request, ctx);
    } else {
      return this.value;
    }
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

interface Lazy<T, U> {
  (request: Request, ctx: U): Promise<T> | T;
}

interface CspDerectives {
  "default-src"?: string[];
  "script-src"?: string[];
  "style-src"?: string[];
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
