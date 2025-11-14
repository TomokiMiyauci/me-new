import { Vite } from "../lib/router/src/middleware/vite.ts";
import { MiddlewareOrMiddlewareObject, Router } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";
import { init } from "@sentry/deno";
import type * as rsc from "./entry.rsc.tsx";

const isDev = Deno.args.includes("dev");
if (isDev) await import("@std/dotenv/load");

const dsn = Deno.env.get("SENTRY_DSN");
const environment = Deno.env.get("SENTRY_ENV");

init({ dsn, environment });

const router = new Router();
const middlewares = await createAppMiddelwares(isDev);

for (const middleware of middlewares) router.use(middleware);

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;

async function createAppMiddelwares(
  dev: boolean,
): Promise<MiddlewareOrMiddlewareObject[]> {
  if (dev) {
    const { createServer } = await import("vite");

    const server = await createServer({ server: { middlewareMode: true } });

    return [new Vite(server)];
  } else {
    const { default: handle } = await import.meta.viteRsc.loadModule<
      typeof rsc
    >("rsc", "index");
    const rscManifest = await import.meta.vite.rsc.loadManifest("rsc");
    const clientManifest = await import.meta.vite.loadManifest(
      "client",
    );
    const distRoot = fromFileUrl(import.meta.vite.outDir.resolve("client"));

    return [new ViteRscAssets(clientManifest, rscManifest, distRoot), handle];
  }
}
