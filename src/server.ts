import { createServer } from "vite";
import { Vite } from "./lib/router/src/middleware/vite.ts";
import { Router } from "router";
import { parseArgs } from "@std/cli/parse-args";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";

const router = new Router();
const args = parseArgs(Deno.args);

if (args._.includes("dev")) {
  const server = await createServer({ server: { middlewareMode: true } });
  router.use(new Vite(server));
} else {
  const handle = await import("~/dist/rsc/index.js").then((mod) => mod.default);
  const rscManifest = await import("~/dist/rsc/__vite_rsc_assets_manifest.js")
    .then((mod) => mod.default);
  const clientManifest = await import("~/dist/client/.vite/manifest.json", {
    with: { type: "json" },
  }).then((mod) => mod.default);
  const distRoot = fromFileUrl(import.meta.resolve("~/dist/client"));
  router.use(new ViteRscAssets(clientManifest, rscManifest, distRoot));
  router.use(handle);
}

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;
