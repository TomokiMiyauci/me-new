/// <reference lib="dom" />

import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import {
  type ReactNode,
  startTransition,
  StrictMode,
  useEffect,
  useState,
} from "react";
import { hydrateRoot } from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import type { RscPayload } from "./types.ts";

async function main(): Promise<void> {
  // stash `setPayload` function to trigger re-rendering
  // from outside of `BrowserRoot` component (e.g. server function call, navigation, hmr)
  let setPayload: (v: RscPayload) => void;

  // deserialize RSC stream back to React VDOM for CSR
  const initialPayload = await createFromReadableStream<RscPayload>(
    // initial RSC stream is injected in SSR stream as <script>...FLIGHT_DATA...</script>
    rscStream,
  );

  // browser root component to (re-)render RSC payload as state
  function BrowserRoot(): ReactNode {
    const [payload, setPayload_] = useState(initialPayload);

    useEffect(() => {
      setPayload = (v) => startTransition(() => setPayload_(v));
    }, [setPayload_]);

    // re-fetch/render on client side navigation
    useEffect(() => {
      return listenNavigation(() => fetchRscPayload());
    }, []);

    return payload.root;
  }

  // re-fetch RSC and trigger re-rendering
  async function fetchRscPayload(): Promise<void> {
    const payload = await createFromFetch<RscPayload>(
      fetch(globalThis.location.href, {
        headers: { accept: "text/x-component" },
      }),
    );
    setPayload(payload);
  }

  // register a handler which will be internally called by React
  // on server function request after hydration.
  setServerCallback(async (id, args) => {
    const url = new URL(globalThis.location.href);
    const temporaryReferences = createTemporaryReferenceSet();
    const payload = await createFromFetch<RscPayload>(
      fetch(url, {
        method: "POST",
        body: await encodeReply(args, { temporaryReferences }),
        headers: { "x-rsc-action": id, accept: "text/x-component" },
      }),
      { temporaryReferences },
    );
    setPayload(payload);
    return payload.returnValue;
  });

  // hydration
  const browserRoot = (
    <StrictMode>
      <BrowserRoot />
    </StrictMode>
  );
  hydrateRoot(document, browserRoot, {
    formState: initialPayload.formState,
  });

  // implement server HMR by trigering re-fetch/render of RSC upon server code change
  if (import.meta.hot) {
    import.meta.hot.on("rsc:update", () => {
      fetchRscPayload();
    });
  }
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

main();
