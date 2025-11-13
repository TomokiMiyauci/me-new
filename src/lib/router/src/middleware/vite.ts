import type { MiddlewareObject } from "../types.ts";
import type { ViteDevServer } from "vite";
import { toFetchResponse, toReqRes } from "fetch-to-node";

export class Vite implements MiddlewareObject {
  constructor(public vite: ViteDevServer) {}

  handle(request: Request): Response | Promise<Response> {
    const { req, res } = toReqRes(request);

    Object.defineProperty(req, "socket", {
      get() {
        return {};
      },
    });

    this.vite.middlewares(req, res);

    return toFetchResponse(res);
  }
}
