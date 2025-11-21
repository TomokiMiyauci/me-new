import { type JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div id="root">
      <div>
        {/* <Button>Label</Button> */}
        <a href="/admin">Admin</a>
        <a href="/about">About</a>
      </div>
    </div>
  );
}
