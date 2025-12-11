import {
  createTemporaryReferenceSet,
  decodeAction,
  decodeFormState,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from "@vitejs/plugin-rsc/rsc";
import type { ReactFormState } from "react-dom/client";
import type * as ssr from "@/framework/entry.ssr.tsx";
import {
  parseRequest,
  type ReturnValue,
  type RscPayload,
  RscResponse,
} from "rsc-protocol";
import { isNotFoundErrorLike } from "react-app";
import { captureException } from "@sentry/deno";
import { NonceContext } from "router/csp";
import { URLResolver } from "route-kit";
import { i18n as langConfig } from "@/language.ts";
import i18nConfig from "@/i18next.config.ts";
import { createInstance } from "i18next";
import { injectRSCPayload } from "rsc-html-stream/server";
import { HTMLInjectionStream } from "html-stream";
import { source } from "@/services/source.ts";
import { PUBLIC } from "~env";
import routes from "@/route.ts";
import AppShell from "@/routes/app_shell.tsx";

const resolver = /* /@__PURE__/ */ new URLResolver(routes);

export interface HanderContext extends Partial<NonceContext> {
  renderHtmlStream: typeof ssr["renderHtmlStream"];
  noJs?: boolean;
  bootstrapScriptContent: string;
}

export default async function handler(
  request: Request,
  context: HanderContext,
): Promise<Response> {
  const { renderHtmlStream, noJs, bootstrapScriptContent } = context;
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

  let status = 200;

  const url = new URL(request.url);
  const resolved = resolver.resolve(url);
  const lang = resolved?.params["lang"] ?? langConfig.defaultLang;
  const i18n = createInstance({ lng: lang });
  await i18n.init(i18nConfig);
  const rscPayload = {
    root: <AppShell lang="en" url={url} i18n={i18n} params={{}} />,
    formState,
    returnValue,
  } satisfies RscPayload;
  const { nonce } = context;
  const rscOptions = {
    temporaryReferences,
    onError(e: unknown): string | undefined {
      if (isNotFoundErrorLike(e)) {
        status = 404;
        return e.digest;
      } else {
        captureException(e);
        status = 500;
        console.error("Uncaough error", e);
      }
    },
    nonce,
  };
  const rscStream = renderToReadableStream(rscPayload, rscOptions);

  // respond RSC stream without HTML rendering based on framework's convention.
  // here we use request header `content-type`.
  if (result.isRsc) {
    return new RscResponse(rscStream, {
      headers: result.headers,
      status: actionStatus,
    });
  }

  const nojs = noJs && url.searchParams.has("__nojs");

  // duplicate one RSC stream into two.
  // - one for SSR (ReactClient.createFromReadableStream below)
  // - another for browser hydration payload by injecting <script>...FLIGHT_DATA...</script>.
  const [rscStream1, rscStream2] = rscStream.tee();
  // const htmlStream = await renderHtml(<RscPromise promise={promise} />);
  const htmlStream = await renderHtmlStream(rscStream1, {
    formState,
    nonce: context.nonce,
    bootstrapScriptContent: nojs ? undefined : bootstrapScriptContent,
    onError(): void {
      // noop
    },
  });

  const headers = new Headers(result.headers);
  headers.set("content-type", "text/html;charset=utf-8");

  const finalStream = nojs ? htmlStream : htmlStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(
      new HTMLInjectionStream(source.provide(JSON.stringify(PUBLIC))),
    )
    .pipeThrough(new TextEncoderStream())
    // initial RSC stream is injected in HTML stream as <script>...FLIGHT_DATA...</script>
    // using utility made by devongovett https://github.com/devongovett/rsc-html-stream
    .pipeThrough(injectRSCPayload(rscStream2, { nonce }));

  return new Response(finalStream, { status, headers });
}
