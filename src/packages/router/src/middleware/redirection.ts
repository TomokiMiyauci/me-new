import type { MiddlewareObject, Next } from "../types.ts";

export interface RedirectRule {
  from: URLPattern;
  to: URL;
  status: number;
}

export class Redirection implements MiddlewareObject {
  constructor(public rules: RedirectRule[]) {}

  handle(request: Request, next: Next): Response | Promise<Response> {
    const url = new URL(request.url);

    for (const rule of this.rules) {
      if (rule.from.test(url)) {
        return Response.redirect(rule.to, rule.status);
      }
    }

    return next(request);
  }
}
