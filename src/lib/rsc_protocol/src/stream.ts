declare global {
  var __FLIGHT_DATA: unknown[] | undefined;
}

export function getRSCStream(): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  const rscStream = new ReadableStream<Uint8Array>({
    start(controller): void {
      function handleChunk(chunk: unknown): void {
        if (typeof chunk === "string") {
          const encoded = encoder.encode(chunk);
          controller.enqueue(encoded);
        } else if (chunk instanceof Uint8Array) {
          controller.enqueue(chunk);
        } else {
          throw new Error("Invalid chunk data");
        }
      }

      globalThis.__FLIGHT_DATA ||= [];
      globalThis.__FLIGHT_DATA.forEach(handleChunk);
      globalThis.__FLIGHT_DATA.push = (chunk: unknown) => {
        handleChunk(chunk);
        return 0;
      };

      if (
        typeof document !== "undefined" && document.readyState === "loading"
      ) {
        document.addEventListener("DOMContentLoaded", () => {
          controller.close();
        }, { once: true });
      } else {
        controller.close();
      }
    },
  });

  return rscStream;
}
