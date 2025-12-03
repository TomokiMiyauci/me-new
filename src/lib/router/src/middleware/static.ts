import { join } from "node:path";
import type { MiddlewareObject, Next } from "@/types.ts";
import { serveDir } from "@std/http/file-server";

export interface StaticOptions {
  fsRoot?: string;
  urlRoot?: string;
}

export class StaticDir implements MiddlewareObject {
  #options: StaticOptions = {};
  constructor(options: StaticOptions = {}) {
    this.#options = options;
  }

  async handle(
    request: Request,
    next: Next,
  ): Promise<Response> {
    const urlRoot = this.#options.urlRoot ?? "";
    const pathname = join("/", urlRoot, "/", "*");
    const pattern = new URLPattern({ pathname });

    if (pattern.test(request.url)) {
      const response = await serveDir(request, {
        fsRoot: this.#options.fsRoot,
        quiet: true,
        urlRoot: this.#options.urlRoot,
      });

      return response;
    }

    return next(request);
  }
}
