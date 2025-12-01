import {
  createTemporaryReferenceSet,
  decodeAction,
  decodeFormState,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from "@vitejs/plugin-rsc/rsc";
import type { ReactFormState } from "react-dom/client";
import type * as ssr from "./entry.ssr.tsx";
import routes from "@/routes/routes.tsx";
import { type MiddlewareObject, Router } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";
import { init } from "@sentry/deno";
import { CSP_ENDPOINT, SENTRY_DSN, SENTRY_ENV } from "@/env.ts";
import {
  parseRequest,
  type ReturnValue,
  type RscPayload,
  RscResponse,
} from "rsc-protocol";
import { createRef } from "./utils.tsx";
import { isNotFoundErrorLike, notFound } from "react-app";
import { captureException } from "@sentry/deno";
import { Csp, NonceContext, NonceProvider } from "router/csp";
import { components } from "@/routes/routes.tsx";
import { URLResolver } from "route-kit";

const resolver = /* /@__PURE__/ */ new URLResolver(routes);

// the plugin by default assumes `rsc` entry having default export of request handler.
// however, how server entries are executed can be customized by registering
// own server handler e.g. `@cloudflare/vite-plugin`.
async function handler(
  request: Request,
  context: Partial<NonceContext>,
): Promise<Response> {
  const result = parseRequest(request);

  let returnValue: ReturnValue | undefined;
  let formState: ReactFormState | undefined;
  let temporaryReferences: unknown | undefined;
  let actionStatus: number | undefined;

  if (result.isAction) {
    if (result.isRsc) {
      // action is called via `ReactClient.setServerCallback`.
      const contentType = request.headers.get("content-type");
      const body = contentType?.startsWith("multipart/form-data")
        ? await request.formData()
        : await request.text();
      temporaryReferences = createTemporaryReferenceSet();
      const args = await decodeReply(body, { temporaryReferences });
      const action = await loadServerAction(result.action.id);
      try {
        const data = await action.apply(null, args);
        returnValue = { ok: true, data };
      } catch (e) {
        returnValue = { ok: false, data: e };
        actionStatus = 500;
        captureException(e);
        console.error("Uncatch error", e);
      }
    } else {
      // otherwise server function is called via `<form action={...}>`
      // before hydration (e.g. when javascript is disabled).
      // aka progressive enhancement.
      const formData = await request.formData();
      const decodedAction = await decodeAction(formData);
      const result = await decodedAction();
      formState = await decodeFormState(result, formData);
    }
  }

  // serialization from React VDOM tree to RSC stream.
  // we render RSC stream after handling server function request
  // so that new render reflects updated state from server function call
  // to achieve single round trip to mutate and fetch from server.

  const [statusRef, setStatus] = createRef(200);

  const url = new URL(request.url);
  const resolved = resolver.resolve(url);
  const Component = resolved ? components[resolved.key] : NotFoundShell;
  const rscPayload = {
    root: <Component url={url} lang={resolved?.params.lang ?? "en"} />,
    formState,
    returnValue,
  } satisfies RscPayload;
  const rscOptions = {
    temporaryReferences,
    onError(e: unknown) {
      if (isNotFoundErrorLike(e)) {
        setStatus(404);
        return e.digest;
      } else {
        captureException(e);
        setStatus(500);
        console.error("Uncaough error", e);
      }
    },
    nonce: context.nonce,
  };
  const rscStream = renderToReadableStream(rscPayload, rscOptions);

  // respond RSC stream without HTML rendering based on framework's convention.
  // here we use request header `content-type`.
  // additionally we allow `?__rsc` and `?__html` to easily view payload directly.
  if (result.isRsc) {
    return new RscResponse(rscStream, {
      headers: result.headers,
      status: actionStatus,
    });
  }

  // Delegate to SSR environment for html rendering.
  // The plugin provides `loadModule` helper to allow loading SSR environment entry module
  // in RSC environment. however this can be customized by implementing own runtime communication
  // e.g. `@cloudflare/vite-plugin`'s service binding.
  const { renderHTML } = await import.meta.viteRsc.loadModule<typeof ssr>(
    "ssr",
    "index",
  );
  const htmlStream = await renderHTML(rscStream, {
    formState,
    // allow quick simulation of javscript disabled browser
    nojs: import.meta.env.DEV && url.searchParams.has("__nojs"),
    nonce: context.nonce,
  });

  const headers = new Headers(result.headers);
  headers.set("content-type", "text/html");

  // respond html
  return new Response(htmlStream, { status: statusRef.current, headers });
}

init({ dsn: SENTRY_DSN, environment: SENTRY_ENV });

const router = /* /@__PURE__/ */ new Router<NonceContext>();
router
  .use(new NonceProvider())
  .use(
    new Csp((_, { nonce }) => ({
      "default-src": ["'none'"],
      "script-src": [`'nonce-${nonce}'`, "'unsafe-eval'"],
      "style-src": ["'self'", `'unsafe-inline'`],
      "img-src": ["https:"],
      "report-uri": CSP_ENDPOINT ? [CSP_ENDPOINT] : [],
      "connect-src": ["ws:", "https:", "http:"],
    })),
  );

if (import.meta.env.PROD) router.use(await createAssetMiddleware());

router.use(handler);

async function createAssetMiddleware(): Promise<MiddlewareObject> {
  const rscManifest = await import.meta.vite.rsc.loadManifest("rsc");
  const clientManifest = await import.meta.vite.loadManifest(
    "client",
  );
  const distRoot = fromFileUrl(import.meta.vite.outDir.resolve("client"));
  const middleware = new ViteRscAssets(clientManifest, rscManifest, distRoot);

  return middleware;
}

export default {
  fetch: router.fetch.bind(router),
};

if (import.meta.hot) {
  import.meta.hot.accept();
}

function NotFoundShell(): never {
  notFound();
}
