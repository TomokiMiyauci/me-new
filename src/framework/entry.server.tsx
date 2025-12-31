import { init } from "@sentry/deno";
import { sentry } from "~config";
import HtmlRouter from "@/routers/html.ts";
import type * as ssr from "./entry.ssr.tsx";
import ResourceRouter from "@/routers/resource.ts";
import BaseRouter from "@/routers/base.ts";
import { fromFileUrl } from "@std/path";
import StaticDir from "router/static-dir";

init(sentry);

const router = new BaseRouter()
  .use(new ResourceRouter());

if (import.meta.env.PROD) {
  const clientDir = fromFileUrl(import.meta.vite.outDir.resolve("client"));

  router.use(new StaticDir(clientDir));
}

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
