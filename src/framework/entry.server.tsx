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
import type { RscPayload } from "./types.ts";
import { Router as ReactRouter } from "react-router";
import routes, { NotFound } from "@/routes/routes.tsx";
import { type MiddlewareObject, Router } from "router";
import { fromFileUrl } from "@std/path";
import { ViteRscAssets } from "router/vite-rsc";
import { init } from "@sentry/deno";
import { SENTRY_DSN, SENTRY_ENV } from "@/env.ts";

// the plugin by default assumes `rsc` entry having default export of request handler.
// however, how server entries are executed can be customized by registering
// own server handler e.g. `@cloudflare/vite-plugin`.
async function handler(request: Request): Promise<Response> {
  // handle server function request
  const isAction = request.method === "POST";

  let returnValue: unknown | undefined;
  let formState: ReactFormState | undefined;
  let temporaryReferences: unknown | undefined;

  if (isAction) {
    // x-rsc-action header exists when action is called via `ReactClient.setServerCallback`.
    const actionId = request.headers.get("x-rsc-action");
    if (actionId) {
      const contentType = request.headers.get("content-type");
      const body = contentType?.startsWith("multipart/form-data")
        ? await request.formData()
        : await request.text();
      temporaryReferences = createTemporaryReferenceSet();
      const args = await decodeReply(body, { temporaryReferences });
      const action = await loadServerAction(actionId);
      returnValue = await action.apply(null, args);
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
  const rscPayload = {
    root: (
      <ReactRouter
        url={url}
        routes={routes}
        fallback={<NotFound onRender={() => setStatus(404)} />}
      >
      </ReactRouter>
    ),
    formState,
    returnValue,
  } satisfies RscPayload;
  const rscOptions = { temporaryReferences };
  const rscStream = renderToReadableStream(rscPayload, rscOptions);

  // respond RSC stream without HTML rendering based on framework's convention.
  // here we use request header `content-type`.
  // additionally we allow `?__rsc` and `?__html` to easily view payload directly.
  const isRscRequest = request.headers.get("accept")?.includes(
    "text/x-component",
  );

  if (isRscRequest) {
    return new Response(rscStream, {
      headers: {
        "content-type": "text/x-component;charset=utf-8",
        vary: "accept",
      },
      status: statusRef.current,
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
  });

  // respond html
  return new Response(htmlStream, {
    status: statusRef.current,
    headers: { "content-type": "text/html", vary: "accept" },
  });
}

interface Ref<T> {
  current: T;
}

function createRef<T>(init: T): [Ref<T>, (value: T) => void] {
  const ref = { current: init };

  function setState(value: T): void {
    ref.current = value;
  }

  return [ref, setState];
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

if (import.meta.hot) {
  import.meta.hot.accept();
}

export default {
  fetch: router.fetch.bind(router),
};
