import { Router } from "router";
import { init } from "@sentry/deno";
import { CSP_ENDPOINT } from "~env";
import { Csp, NonceContext, NonceProvider } from "router/csp";
import sentryConfig from "~config/sentry";
import { App, createAssetMiddleware } from "./utils.ts";

init(sentryConfig);

const router = /* /@__PURE__/ */ new Router<NonceContext>();
router
  .use(new NonceProvider())
  .use(
    new Csp((_, { nonce }) => ({
      "default-src": ["'none'"],
      "script-src": [`'nonce-${nonce}'`, "'unsafe-eval'", "'self'"],
      "style-src": ["'self'", `'unsafe-inline'`],
      "img-src": ["https:"],
      "report-uri": CSP_ENDPOINT ? [CSP_ENDPOINT] : [],
      "connect-src": ["ws:", "https:", "http:"],
    })),
  );

if (import.meta.env.PROD) router.use(await createAssetMiddleware());

router.use(new App());

export default {
  fetch: router.fetch.bind(router),
} satisfies Deno.ServeDefaultExport;

if (import.meta.hot) {
  import.meta.hot.accept();
}
