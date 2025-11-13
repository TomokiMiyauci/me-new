import type { Middleware } from "./types.ts";
import type { Connect } from "vite";
import { toFetchResponse, toReqRes } from "fetch-to-node";

export function fromConnect(connect: Connect.Server): Middleware {
  return (request) => {
    const { req, res } = toReqRes(request);

    // Patch for socket getter
    Object.defineProperty(req, "socket", {
      get() {
        return {};
      },
    });

    connect(req, res);

    return toFetchResponse(res);
  };
}
