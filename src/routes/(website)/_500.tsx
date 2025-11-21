"use client";
import { type FallbackProps } from "error-boundary";
import { JSX } from "react";

export default function ServerError(props: FallbackProps): JSX.Element {
  return (
    <main>
      <h1>Server Error</h1>
      {import.meta.env.DEV && <p>{props.error.message}</p>}
      {import.meta.env.DEV && <p>{props.error.stack}</p>}

      <button type="button" onClick={() => props.reset()}>rest</button>
    </main>
  );
}
