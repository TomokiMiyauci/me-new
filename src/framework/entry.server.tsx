import { Router } from "router";
import { dynamic } from "router/middleware";
import { init } from "@sentry/deno";
import { CSP_ENDPOINT } from "~env";
import { Csp, NonceContext, NonceProvider } from "router/csp";
import sentryConfig from "~config/sentry";
import { App, createAssetMiddleware } from "./utils.ts";
import Redirect from "@/handlers/redirect/middleware.ts";
import cspValue from "@/csp.json" with { type: "json" };
import { DeclarativeCsp } from "declarative-csp";
import { assert } from "@std/assert/assert";
import sitemapHander from "@/handlers/sitemap/handler.ts";
import robotsHandler from "@/handlers/robots/handler.ts";

assert(CSP_ENDPOINT);

const declCsp = new DeclarativeCsp(cspValue);

init(sentryConfig);

const csp = dynamic<NonceContext>((_, { nonce = "" }) => {
  const manifest = declCsp.format({
    nonce,
    // deno-lint-ignore no-non-null-assertion
    endpoint: CSP_ENDPOINT!,
  });

  return new Csp(manifest);
});

const router = new Router<NonceContext>();
router
  .get("/robots.txt", robotsHandler)
  .get("/sitemap.xml", sitemapHander)
  .use(new NonceProvider())
  .use(new Redirect())
  .use(csp);

if (import.meta.env.PROD) router.use(await createAssetMiddleware());

router.use(new App());

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;

if (import.meta.hot) {
  import.meta.hot.accept();
}
