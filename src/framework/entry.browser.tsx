/// <reference lib="dom" />

import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import { startTransition, StrictMode, useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import { init, reactErrorHandler } from "@sentry/react";
import { SENTRY_DSN, SENTRY_ENV } from "@/env.ts";
import { Rsc, type RscPayload, RscRequest } from "rsc-protocol";
// import { ErrorBoundary } from "error-boundary";
import { Fallback } from "@/services/app.tsx";
import { ErrorBoundary } from "react-error-boundary";

async function fetchRscPayload(
  href = globalThis.location.href,
): Promise<RscPayload> {
  const request = new RscRequest(href);
  const response = fetch(request);
  const payload = await createFromFetch<RscPayload>(response);

  return payload;
}

async function main(): Promise<void> {
  // deserialize RSC stream back to React VDOM for CSR
  const initialPayload = await createFromReadableStream<RscPayload>(
    // initial RSC stream is injected in SSR stream as <script>...FLIGHT_DATA...</script>
    rscStream,
  );

  function Root({ promise }: { promise: RscPayload }) {
    const [payload, setPayload] = useState(promise);

    // re-fetch RSC and trigger re-rendering
    useEffect(() => {
      return listenNavigation(async () => {
        const promise = await fetchRscPayload();

        startTransition(() => setPayload(promise));
      });
    }, []);

    useEffect(() => {
      // register a handler which will be internally called by React
      // on server function request after hydration.
      setServerCallback(async (id, args) => {
        const temporaryReferences = createTemporaryReferenceSet();
        const request = new RscRequest(globalThis.location.href, {
          body: await encodeReply(args, { temporaryReferences }),
          action: { id },
        });
        const payload = await createFromFetch<RscPayload>(
          fetch(request),
          { temporaryReferences },
        );
        startTransition(() => setPayload(promise));

        const { ok, data } = payload.returnValue!;
        if (!ok) throw data;
        return data;
      });

      // implement server HMR by trigering re-fetch/render of RSC upon server code change
      if (import.meta.hot) {
        import.meta.hot.on("rsc:update", async () => {
          const payload = await fetchRscPayload();
          startTransition(() => setPayload(payload));
        });
      }
    }, []);

    return (
      <StrictMode>
        <ErrorBoundary
          key={globalThis.location.href}
          FallbackComponent={Fallback}
        >
          <Rsc payload={payload} />
        </ErrorBoundary>
      </StrictMode>
    );
  }

  hydrateRoot(document, <Root promise={initialPayload} />, {
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
  });
}

// a little helper to setup events interception for client side navigation
function listenNavigation(onNavigation: () => void): VoidFunction {
  globalThis.addEventListener("popstate", onNavigation);

  const oldPushState = globalThis.history.pushState;
  globalThis.history.pushState = function (...args): void {
    const res = oldPushState.apply(this, args);
    onNavigation();
    return res;
  };

  const oldReplaceState = globalThis.history.replaceState;
  globalThis.history.replaceState = function (...args) {
    const res = oldReplaceState.apply(this, args);
    onNavigation();
    return res;
  };

  function onClick(e: MouseEvent): void {
    const link = (e.target as Element).closest("a");
    if (
      link &&
      link instanceof HTMLAnchorElement &&
      link.href &&
      (!link.target || link.target === "_self") &&
      link.origin === location.origin &&
      !link.hasAttribute("download") &&
      e.button === 0 && // left clicks only
      !e.metaKey && // open in new tab (mac)
      !e.ctrlKey && // open in new tab (globalThiss)
      !e.altKey && // download
      !e.shiftKey &&
      !e.defaultPrevented
    ) {
      e.preventDefault();
      history.pushState(null, "", link.href);
    }
  }
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    globalThis.removeEventListener("popstate", onNavigation);
    globalThis.history.pushState = oldPushState;
    globalThis.history.replaceState = oldReplaceState;
  };
}

init({ dsn: SENTRY_DSN, environment: SENTRY_ENV });
main();
