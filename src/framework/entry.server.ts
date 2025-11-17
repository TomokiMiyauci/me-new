import { type MiddlewareObject, Router } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";
import { init } from "@sentry/deno";
import { SENTRY_DSN, SENTRY_ENV } from "@/env.ts";
import type * as rsc from "./entry.rsc.tsx";

init({ dsn: SENTRY_DSN, environment: SENTRY_ENV });

const router = new Router();

if (import.meta.env.PROD) router.use(await createAssetMiddleware());

const { default: handler } = await import.meta.viteRsc.loadModule<typeof rsc>(
  "rsc",
  "index",
);

router.use(handler);

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;

async function createAssetMiddleware(): Promise<MiddlewareObject> {
  const rscManifest = await import.meta.vite.rsc.loadManifest("rsc");
  const clientManifest = await import.meta.vite.loadManifest(
    "client",
  );
  const distRoot = fromFileUrl(import.meta.vite.outDir.resolve("client"));
  const middleware = new ViteRscAssets(clientManifest, rscManifest, distRoot);

  return middleware;
}
