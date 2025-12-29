import { init } from "@sentry/deno";
import { CSP_ENDPOINT } from "~env";
import sentryConfig from "~config/sentry";
import { assert } from "@std/assert/assert";
import HtmlRouter from "@/routers/html.ts";
import type * as ssr from "./entry.ssr.tsx";
import resourceRouter from "@/routers/resource.ts";
import router from "@/routers/global.ts";
import { type MiddlewareObject } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";

assert(CSP_ENDPOINT);

init(sentryConfig);

router.use(resourceRouter);

if (import.meta.env.PROD) router.use(await createAssetMiddleware());

const { renderHtmlStream } = await import.meta.viteRsc.loadModule<
  typeof ssr
>("ssr", "index");
const bootstrapScriptContent = await import.meta.viteRsc
  .loadBootstrapScriptContent("index");

router.use(new HtmlRouter(bootstrapScriptContent, renderHtmlStream));

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;

if (import.meta.hot) {
  import.meta.hot.accept();
}

async function createAssetMiddleware(): Promise<MiddlewareObject> {
  const rscManifest = await import.meta.vite.rsc.loadManifest("rsc");
  const clientManifest = await import.meta.vite.loadManifest(
    "client",
  );
  const distRoot = fromFileUrl(import.meta.vite.outDir.resolve("client"));
  const middleware = new ViteRscAssets(clientManifest, rscManifest, distRoot);

  return middleware;
}
