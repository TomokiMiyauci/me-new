import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import { renderToReadableStream } from "react-dom/server.edge";
import type { RenderToReadableStreamOptions } from "react-dom/server";
import { Fallback } from "@/services/app.tsx";
import { type RscPayload, RscPromise } from "rsc-protocol";

export async function renderHtmlStream(
  rscStream: ReadableStream<Uint8Array>,
  options: RenderToReadableStreamOptions,
): Promise<ReadableStream<BufferSource>> {
  const promise = createFromReadableStream<RscPayload>(rscStream);

  const stream: ReadableStream<BufferSource> = await renderToReadableStream(
    <RscPromise promise={promise} />,
    options,
  ).catch((e: unknown) => {
    if (e instanceof Error) {
      return renderToReadableStream(
        <Fallback error={e} resetErrorBoundary={() => {}} />,
        options,
      );
    }

    throw e;
  });

  return stream;
}
