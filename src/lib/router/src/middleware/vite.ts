import type { Middleware, MiddlewareObject } from "../types.ts";
import type { ViteDevServer } from "vite";
import { fromConnect } from "../utils.ts";

export class Vite implements MiddlewareObject {
  #middleware: Middleware;
  constructor(vite: ViteDevServer) {
    this.#middleware = fromConnect(vite.middlewares.bind(vite));
  }

  handle(
    request: Request,
    next: () => Promise<Response>,
  ): Response | Promise<Response> {
    return this.#middleware(request, next);
  }
}
