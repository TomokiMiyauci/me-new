import { Router } from "router";
import { dynamic } from "router/middleware";
import { init } from "@sentry/deno";
import { CSP_ENDPOINT } from "~env";
import { Csp, NonceContext, NonceProvider } from "router/csp";
import sentryConfig from "~config/sentry";
import { App, createAssetMiddleware } from "./utils.ts";
import Redirect from "@/handlers/redirect/middleware.ts";

init(sentryConfig);

const csp = dynamic<NonceContext>((_, { nonce }) => {
  const manifest = {
    "default-src": ["'none'"],
    "script-src": [`'nonce-${nonce}'`, "'unsafe-eval'", "'self'"],
    "style-src": ["'self'", `'unsafe-inline'`],
    "img-src": ["https:", "data:"],
    "report-uri": CSP_ENDPOINT ? [CSP_ENDPOINT] : [],
    "connect-src": ["ws:", "https:", "http:"],
  };

  return new Csp(manifest);
});

const router = new Router<NonceContext>();
router
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
