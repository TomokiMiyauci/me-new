import type { Middleware, MiddlewareObject, Next } from "../types.ts";
import type { ViteDevServer } from "vite";
import { fromConnect } from "../utils.ts";

export class Vite implements MiddlewareObject {
  #middleware: Middleware;
  constructor(vite: ViteDevServer) {
    this.#middleware = fromConnect(vite.middlewares.bind(vite));
  }

  handle(request: Request, next: Next): Response | Promise<Response> {
    return this.#middleware(request, next);
  }
}
