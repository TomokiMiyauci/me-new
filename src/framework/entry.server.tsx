import { init } from "@sentry/deno";
import { sentry } from "~config";
import htmlRouter, { App } from "@/routers/html.ts";
import type * as ssr from "./entry.ssr.tsx";
import resourceRouter from "@/routers/resource.ts";
import baseRouter from "@/routers/base.ts";
import { fromFileUrl } from "@std/path";
import StaticDir from "router/static-dir";

init(sentry);

let router = baseRouter
  .use(resourceRouter);

if (import.meta.env.PROD) {
  const clientDir = fromFileUrl(import.meta.vite.outDir.resolve("client"));

  router = router.use(new StaticDir(clientDir));
}

const { renderHtmlStream } = await import.meta.viteRsc.loadModule<
  typeof ssr
>("ssr", "index");
const bootstrapScriptContent = await import.meta.viteRsc
  .loadBootstrapScriptContent("index");

router = router.use(
  htmlRouter.use(new App(bootstrapScriptContent, renderHtmlStream)),
);

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;

if (import.meta.hot) {
  import.meta.hot.accept();
}
