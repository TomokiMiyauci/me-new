import { Router } from "router";
import { dynamic } from "router/middleware";
import { TrailingSlash } from "router/trailing-slash";
import { Redirection } from "router/redirection";
import { init } from "@sentry/deno";
import { CSP_ENDPOINT } from "~env";
import { Csp, NonceContext, NonceProvider } from "router/csp";
import sentryConfig from "~config/sentry";
import { App, createAssetMiddleware } from "./utils.ts";
import Redirect from "@/handlers/redirect/middleware.ts";
import { assert } from "@std/assert/assert";
import sitemapHander from "@/handlers/sitemap/handler.ts";
import robotsHandler from "@/handlers/robots/handler.ts";
import cspTemplate from "../csp.mustache?raw";
import mastache from "mustache";
import language from "@/language.json" with { type: "json" };

assert(CSP_ENDPOINT);

init(sentryConfig);

const router = new Router<NonceContext>()
  .use(new TrailingSlash("never"))
  .use(new Redirect())
  .get("/robots.txt", robotsHandler)
  .get("/sitemap.xml", sitemapHander);

if (import.meta.env.PROD) router.use(await createAssetMiddleware());

const csp = dynamic<NonceContext>((_, { nonce }) => {
  const manifest = mastache.render(cspTemplate, {
    nonce,
    endpoint: CSP_ENDPOINT,
  });

  return new Csp(manifest);
});

router.use(
  new Router<NonceContext>()
    .use(dynamic<NonceContext>(({ url }) =>
      new Redirection([{
        from: new URLPattern({ pathname: "/" }),
        to: new URL("/" + language.default, url),
        status: 302,
      }])
    ))
    .use(new NonceProvider())
    .use(csp)
    .use(new App()),
);

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;

if (import.meta.hot) {
  import.meta.hot.accept();
}
