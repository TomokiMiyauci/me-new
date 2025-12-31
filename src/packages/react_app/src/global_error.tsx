"use client";

/**
 * @see https://github.com/vercel/next.js/blob/473ae4b70dd781cc8b2620c95766f827296e689a/packages/next/src/client/components/builtin/global-error.tsx
 */

import { type JSX, startTransition } from "react";
import type { FallbackProps } from "react-error-boundary";

export default function GlobalError(
  props: Partial<FallbackProps>,
): JSX.Element {
  return (
    <html>
      <head>
        <title>Unexpected Error</title>
      </head>

      <body
        style={{
          fontFamily:
            'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
          height: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          placeContent: "center",
          placeItems: "center",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "28px",
        }}
      >
        <div>Caught an unexpected error</div>
        <pre>
          Error: {props.error?.message ?? '(Unknown)'}
        </pre>

        {props.resetErrorBoundary && (
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                props.resetErrorBoundary?.();
              });
            }}
          >
            Reset
          </button>
        )}
      </body>
    </html>
  );
}
