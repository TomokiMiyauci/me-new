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
import type { ReturnValue, RscPayload } from "./types.ts";
import { Router as ReactRouter } from "react-router";
import routes, { NotFound, ServerError } from "@/routes/routes.tsx";
import { type MiddlewareObject, Router } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";
import { init } from "@sentry/deno";
import { SENTRY_DSN, SENTRY_ENV } from "@/env.ts";
import { parseRequest, RscResponse } from "rsc-protocol";
import { type JSX, Suspense } from "react";
import { createRef } from "./utils.ts";

// the plugin by default assumes `rsc` entry having default export of request handler.
// however, how server entries are executed can be customized by registering
// own server handler e.g. `@cloudflare/vite-plugin`.
async function handler(request: Request): Promise<Response> {
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

  function NotFoundShell(): JSX.Element {
    setStatus(404);

    return NotFound;
  }

  function ServerErrorShell() {
    setStatus(500);

    return <ServerError />;
  }

  function Shell() {
    setStatus(200);

    return (
      <ReactRouter
        url={url}
        routes={routes}
        fallback={<NotFoundShell />}
      >
      </ReactRouter>
    );
  }

  const Root = (
    <Suspense fallback={<ServerErrorShell />}>
      <Shell />
    </Suspense>
  );

  const url = new URL(request.url);
  const rscPayload = {
    root: Root,
    formState,
    returnValue,
  } satisfies RscPayload;
  const rscOptions = { temporaryReferences };
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
  const ssrEntryModule = await import.meta.viteRsc.loadModule<typeof ssr>(
    "ssr",
    "index",
  );
  const htmlStream = await ssrEntryModule.renderHTML(rscStream, {
    formState,
    // allow quick simulation of javscript disabled browser
    nojs: import.meta.env.DEV && url.searchParams.has("__nojs"),
    onError: () => setStatus(500),
  });

  const headers = new Headers(result.headers);
  headers.set("congtent-type", "text/html");

  // respond html
  return new Response(htmlStream, { status: statusRef.current, headers });
}

init({ dsn: SENTRY_DSN, environment: SENTRY_ENV });

const router = new Router();

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
