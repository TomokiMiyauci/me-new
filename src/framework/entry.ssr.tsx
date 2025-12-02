import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import { type JSX } from "react";
import type { ReactFormState } from "react-dom/client";
import { renderToReadableStream } from "react-dom/server.edge";
import type { RenderToReadableStreamOptions } from "react-dom/server";
import { injectRSCPayload } from "rsc-html-stream/server";
import { source } from "@/services/source.ts";
import { PUBLIC } from "@/env.ts";
import { HTMLInjectionStream } from "html-stream";
import { Fallback } from "@/services/app.tsx";
import { type RscPayload, RscPromise } from "rsc-protocol";

export interface RenderHTMLOptions {
  formState?: ReactFormState;
  nonce?: string;
  nojs?: boolean;
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
  const promise = createFromReadableStream<RscPayload>(rscStream1);

  const bootstrapScriptContent = await import.meta.viteRsc
    .loadBootstrapScriptContent("index");
  const { nonce, formState, nojs } = options;
  const renderOptions = {
    bootstrapScriptContent: nojs ? undefined : bootstrapScriptContent,
    formState,
    nonce,
    onError(): void {
      // noop
    },
  } satisfies RenderToReadableStreamOptions;

  const stream: ReadableStream<BufferSource> = await renderToReadableStream(
    <RscPromise promise={promise} />,
    renderOptions,
  ).catch((e: unknown) => {
    const jsx = fallback(e);

    return renderToReadableStream(jsx, renderOptions);
  });

  if (nojs) return stream;

  return stream.pipeThrough(new TextDecoderStream())
    .pipeThrough(
      new HTMLInjectionStream(source.provide(JSON.stringify(PUBLIC))),
    )
    .pipeThrough(new TextEncoderStream())
    // initial RSC stream is injected in HTML stream as <script>...FLIGHT_DATA...</script>
    // using utility made by devongovett https://github.com/devongovett/rsc-html-stream
    .pipeThrough(injectRSCPayload(rscStream2, { nonce }));
}

function fallback(e: unknown): JSX.Element {
  if (e instanceof Error) {
    return <Fallback error={e} resetErrorBoundary={() => {}} />;
  }

  throw e;
}
