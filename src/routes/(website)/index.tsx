import { Button } from "@miyauci/material-react";
import { type JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div id="root">
      <div>
        <Button>Label</Button>
        <a href="/admin">Admin</a>
        <a href="/about">About</a>
        <a href="https://vite.dev" target="_blank">
          {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
        </a>
        <a
          href="https://react.dev/reference/rsc/server-components"
          target="_blank"
        >
          {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
        </a>
      </div>
      <h1>Vite + RSC</h1>

      <div className="card">
      </div>
      {/* <div className="card">Request URL: {props.url?.href}</div> */}
      <ul className="read-the-docs">
        <li>
          Edit <code>src/client.tsx</code> to test client HMR.
        </li>
        <li>
          Edit <code>src/root.tsx</code> to test server HMR.
        </li>
        <li>
          Visit{" "}
          <a href="?__rsc" target="_blank">
            <code>?__rsc</code>
          </a>{" "}
          to view RSC stream payload.
        </li>
        <li>
          Visit{" "}
          <a href="?__nojs" target="_blank">
            <code>?__nojs</code>
          </a>{" "}
          to test server action without js enabled.
        </li>
      </ul>
    </div>
  );
}
