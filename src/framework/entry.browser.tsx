/// <reference lib="dom" />
/// <reference types="@types/dom-navigation" />
// deno-lint-ignore-file no-window

import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import {
  type JSX,
  startTransition,
  StrictMode,
  useEffect,
  useState,
} from "react";
import { hydrateRoot } from "react-dom/client";
import { init, reactErrorHandler } from "@sentry/react";
import sentryConfig from "~config/sentry";
import { Rsc, type RscPayload, RscRequest } from "rsc-protocol";
import { getRSCStream } from "rsc-protocol/client";
import { ErrorBoundary } from "react-error-boundary";
import GlobalError from "@/routes/_global_error.tsx";
import createPubSub, { type PubSub } from "nano-pubsub";

const pubsub = createPubSub<RscPayload>();

init(sentryConfig);

setServerCallback(async (id, args) => {
  const temporaryReferences = createTemporaryReferenceSet();
  const body = await encodeReply(args, { temporaryReferences });
  const request = new RscRequest(globalThis.location.href, {
    body,
    action: { id },
  });
  const response = fetch(request);
  const payload = await createFromFetch<RscPayload>(response, {
    temporaryReferences,
  });

  const { returnValue } = payload;
  if (returnValue) {
    const { ok, data } = returnValue;
    if (!ok) throw data;
    pubsub.publish(payload);
  }
});

// TODO(miyauci) Use globalThis instead of window.
// Switch @types/dom-navigation
window.navigation?.addEventListener("navigate", handleNavigation);

// deserialize RSC stream back to React VDOM for CSR
const initialPayload = await createFromReadableStream<RscPayload>(
  // initial RSC stream is injected in SSR stream as <script>...FLIGHT_DATA...</script>
  getRSCStream(),
);

const root = hydrateRoot(
  document,
  <StrictMode>
    <ErrorBoundary
      fallback={<GlobalError />}
    >
      <Root payload={initialPayload} pubsub={pubsub} />
    </ErrorBoundary>
  </StrictMode>,
  {
    formState: initialPayload.formState,
    // Callback called when an error is thrown and not caught by an ErrorBoundary.
    onUncaughtError: reactErrorHandler((error, errorInfo) => {
      console.error("Uncaught error", error, errorInfo.componentStack);
    }),
    // Callback called when React catches an error in an ErrorBoundary.
    onCaughtError: () => {
      // noop
    },
    // Callback called when React automatically recovers from errors.
    onRecoverableError: reactErrorHandler(),
  },
);

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", () => {
    window.navigation?.removeEventListener("navigate", handleNavigation);
    root.unmount();
  });

  import.meta.hot.on("rsc:update", async () => {
    const payload = await fetchRscPayload(globalThis.location.href);

    pubsub.publish(payload);
  });
}

interface RootProps {
  payload: RscPayload;
  pubsub: PubSub<RscPayload>;
}

export function Root(props: RootProps): JSX.Element {
  const { payload: _payload, pubsub } = props;
  const [payload, setPayload] = useState(_payload);

  useEffect(() => {
    const unsubscribe = pubsub.subscribe((payload) => {
      startTransition(() => setPayload(payload));
    });

    return unsubscribe;
  }, [pubsub]);

  return <Rsc payload={payload} />;
}

async function fetchRscPayload(
  url: string | URL,
): Promise<RscPayload> {
  const request = new RscRequest(url);
  const response = fetch(request);
  const payload = await createFromFetch<RscPayload>(response);

  return payload;
}

function shouldNotIntercept(ev: NavigateEvent): boolean {
  return !ev.canIntercept ||
    // If this is just a hashChange,
    // just let the browser handle scrolling to the content.
    ev.hashChange ||
    // If this is a download,
    // let the browser perform the download.
    ev.downloadRequest !== null ||
    // If this is a form submission,
    // let that go to the server.
    !!ev.formData;
}

function handleNavigation(navigateEvent: NavigateEvent): void {
  if (shouldNotIntercept(navigateEvent)) return;

  navigateEvent.intercept({
    async handler(): Promise<void> {
      const dest = navigateEvent.destination.url;
      const payload = await fetchRscPayload(dest);

      pubsub.publish(payload);
    },
  });
}
