import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import { type JSX, type ReactNode, use } from "react";
import type { ReactFormState } from "react-dom/client";
import { renderToReadableStream } from "react-dom/server.edge";
import type { RenderToReadableStreamOptions } from "react-dom/server";
import { injectRSCPayload } from "rsc-html-stream/server";
import type { RscPayload } from "./types.ts";
import { source } from "@/services/source.ts";
import { PUBLIC } from "@/env.ts";
import { HTMLInjectionStream } from "html-stream";
import { captureException } from "@sentry/deno";
import { ServerError } from "@/routes/routes.tsx";

export interface RenderHTMLOptions {
  formState?: ReactFormState;
  nonce?: string;
  nojs?: boolean;
  onError?: VoidFunction;
}

export async function renderHTML(
  rscStream: ReadableStream<Uint8Array>,
  options: RenderHTMLOptions,
): Promise<ReadableStream<BufferSource>> {
  // // duplicate one RSC stream into two.
  // // - one for SSR (ReactClient.createFromReadableStream below)
  // // - another for browser hydration payload by injecting <script>...FLIGHT_DATA...</script>.
  const [rscStream1, rscStream2] = rscStream.tee();

  // deserialize RSC stream back to React VDOM
  const payload = createFromReadableStream<RscPayload>(rscStream1);

  const bootstrapScriptContent = await import.meta.viteRsc
    .loadBootstrapScriptContent("index");
  const { nonce, formState, nojs, onError } = options;
  const renderOptions = {
    bootstrapScriptContent: nojs ? undefined : bootstrapScriptContent,
    formState,
    nonce,
    onError(err, errorInfo) {
      captureException(err);
      console.error("Uncaough error", err, errorInfo.componentStack);
      onError?.();
    },
  } satisfies RenderToReadableStreamOptions;

  const stream: ReadableStream<BufferSource> = await renderToReadableStream(
    <SsrRoot payload={payload} />,
    renderOptions,
  ).catch((e: unknown) => {
    const jsx = fallback(e);

    return renderToReadableStream(jsx, renderOptions);
  });

  if (nojs) return stream;

  // initial RSC stream is injected in HTML stream as <script>...FLIGHT_DATA...</script>
  // using utility made by devongovett https://github.com/devongovett/rsc-html-stream
  return stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(
      new HTMLInjectionStream(source.provide(JSON.stringify(PUBLIC))),
    )
    .pipeThrough(new TextEncoderStream())
    .pipeThrough(injectRSCPayload(rscStream2, { nonce }));
}

function fallback(e: unknown): JSX.Element {
  if (e instanceof Error) {
    return <ServerError error={e} reset={() => {}} />;
  }

  return <DefaultHtml />;
}

function DefaultHtml(): JSX.Element {
  return (
    <html>
      <body>
        <h1>Internal Server Error</h1>
      </body>
    </html>
  );
}

interface SsrRootProps {
  payload: Promise<RscPayload>;
}

function SsrRoot(props: SsrRootProps): ReactNode {
  return use(props.payload).root;
}
