import { Router } from "router";
import { ViteRscAssets } from "router/vite-rsc";
import { fromFileUrl } from "@std/path";
const handle = await import("~/dist/rsc/index.js").then((mod) => mod.default);
const rscManifest = await import("~/dist/rsc/__vite_rsc_assets_manifest.js")
  .then((
    mod,
  ) => mod.default);
const clientManifest = await import("~/dist/client/.vite/manifest.json", {
  with: { type: "json" },
}).then((mod) => mod.default);

const router = new Router();
const distRoot = fromFileUrl(import.meta.resolve("~/dist/client"));

router.use(new ViteRscAssets(clientManifest, rscManifest, distRoot));
router.use(handle);

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;
