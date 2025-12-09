import type * as ssr from "./entry.ssr.tsx";
import { type MiddlewareObject } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";
import appHandler, { HanderContext } from "@/handlers/app.tsx";
import { NonceContext } from "router/csp";

export class App implements MiddlewareObject<NonceContext> {
  async handle(
    request: Request,
    ctx: Partial<NonceContext>,
  ): Promise<Response> {
    const bootstrapScriptContent = await import.meta.viteRsc
      .loadBootstrapScriptContent("index");
    const { renderHtmlStream } = await import.meta.viteRsc.loadModule<
      typeof ssr
    >("ssr", "index");
    const context = {
      nonce: ctx.nonce,
      bootstrapScriptContent,
      renderHtmlStream,
      noJs: import.meta.env.DEV,
    } satisfies HanderContext;

    return appHandler(request, context);
  }
}

export async function createAssetMiddleware(): Promise<MiddlewareObject> {
  const rscManifest = await import.meta.vite.rsc.loadManifest("rsc");
  const clientManifest = await import.meta.vite.loadManifest(
    "client",
  );
  const distRoot = fromFileUrl(import.meta.vite.outDir.resolve("client"));
  const middleware = new ViteRscAssets(clientManifest, rscManifest, distRoot);

  return middleware;
}
