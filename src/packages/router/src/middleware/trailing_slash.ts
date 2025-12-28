import type { MiddlewareObject, Next } from "../types.ts";

export type Mode = "never" | "always";

export class TrailingSlash implements MiddlewareObject {
  constructor(public mode: Mode) {}

  handle(request: Request, next: Next<object>): Response | Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/") {
      switch (this.mode) {
        case "never": {
          const result = NoTrailingSlashReporter.violate(url);

          if (result) {
            return Response.redirect(result);
          }
          break;
        }
        case "always": {
          const result = TrailingSlashReporter.violate(url);

          if (result) {
            return Response.redirect(result);
          }

          break;
        }
      }
    }

    return next(request);
  }
}

class TrailingSlashReporter {
  static violate(url: URL | string): URL | null {
    url = new URL(url);

    if (url.pathname.endsWith("/")) return null;

    url.pathname = url.pathname + "/";

    return url;
  }
}

class NoTrailingSlashReporter {
  static violate(url: URL | string): URL | null {
    url = new URL(url);

    if (url.pathname === "/") return null;
    if (!url.pathname.endsWith("/")) return null;

    url.pathname = url.pathname.replaceAll(/\/+$/g, "");

    return url;
  }
}
