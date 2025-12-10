import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import { renderToReadableStream } from "react-dom/server.edge";
import type { RenderToReadableStreamOptions } from "react-dom/server";
import { type RscPayload, RscPromise } from "rsc-protocol";

export async function renderHtmlStream(
  rscStream: ReadableStream<Uint8Array>,
  options: RenderToReadableStreamOptions,
): Promise<ReadableStream<BufferSource>> {
  const promise = createFromReadableStream<RscPayload>(rscStream);

  const stream: ReadableStream<BufferSource> = await renderToReadableStream(
    <RscPromise promise={promise} />,
    options,
  ).catch(() => {
    return renderToReadableStream(
      <html>
        <head></head>
      </html>,
      options,
    );
  });

  return stream;
}
