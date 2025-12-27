export { getRSCStream } from "./stream.ts";
import type {
  CallServerCallback,
  createFromFetch,
  createTemporaryReferenceSet,
  encodeReply,
} from "@vitejs/plugin-rsc/browser";
import type { RscPayload } from "./types.ts";
import { RscRequest, type RscRequestInit } from "./request.ts";

export interface CallServerOptions {
  createTemporaryReferenceSet: typeof createTemporaryReferenceSet;
  createFromFetch: typeof createFromFetch;
  encodeReply: typeof encodeReply;
  url?: string | URL;
  onRequest?: (payload: RscPayload) => void;
}

export function createCallServer(
  options: CallServerOptions,
): CallServerCallback {
  const {
    createFromFetch,
    createTemporaryReferenceSet,
    url = globalThis.location.href,
    encodeReply,
    onRequest,
  } = options;

  return async (id, args) => {
    const temporaryReferences = createTemporaryReferenceSet();
    const body = await encodeReply(args, { temporaryReferences });
    const init = { body, action: { id } } satisfies RscRequestInit;
    const request = new RscRequest(url, init);
    const promiseResponse = fetch(request);
    const payload = await createFromFetch<RscPayload>(promiseResponse, {
      temporaryReferences,
    });
    const { returnValue } = payload;
    if (returnValue) {
      if (!returnValue.ok) throw returnValue.error;
    }

    onRequest?.(payload);
  };
}
