import { Vite } from "./lib/router/src/middleware/vite.ts";
import { Router } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";
import { init } from "@sentry/deno";

const dsn = Deno.env.get("SENTRY_DSN");
const environment = Deno.env.get("SENTRY_ENV");

init({ dsn, environment });

const router = new Router();

if (Deno.args.includes("dev")) {
  await import("@std/dotenv/load");

  const { createServer } = await import("vite");

  const server = await createServer({ server: { middlewareMode: true } });
  router.use(new Vite(server));
} else {
  const { default: handle } = await import.meta.viteRsc.loadModule(
    "rsc",
    "index",
  );
  const { default: rscManifest } = await import.meta.viteRsc.loadManifest(
    "rsc",
  );
  const clientManifest = await import.meta.vite.loadManifest(
    "client",
  );
  const distRoot = fromFileUrl(import.meta.vite.outDir.resolve("client"));
  router.use(new ViteRscAssets(clientManifest, rscManifest, distRoot));
  router.use(handle);
}

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;
