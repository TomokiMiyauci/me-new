import { JSX } from "react";

export default function ServerError(): JSX.Element {
  return (
    <main>
      <h1>Server Error</h1>
      {
        /* {import.meta.env.DEV && <p>{props.error.message}</p>}
      {import.meta.env.DEV && <p>{props.error.stack}</p>}

      <button type="button" onClick={() => props.resetErrorBoundary()}>
        rest
      </button> */
      }
    </main>
  );
}
