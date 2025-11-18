import { Button } from "@miyauci/material-react";
import { type JSX } from "react";
import Error from "@/components/Error.tsx";

export default function Home(): JSX.Element {
  return (
    <div id="root">
      <div>
        <Button>Label</Button>
        <a href="/admin">Admin</a>
        <a href="/about">About</a>
        <Error />
      </div>
    </div>
  );
}
