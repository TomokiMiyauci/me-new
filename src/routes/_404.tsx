import type { JSX } from "react";
import { FallbackProps } from "error-boundary";
import Layout from "@/routes/(website)/_layout.tsx";

export default function NotFound(props: FallbackProps): JSX.Element {
  return (
    <Layout>
      <main>
        <h1>Not Found</h1>
      </main>
    </Layout>
  );
}
