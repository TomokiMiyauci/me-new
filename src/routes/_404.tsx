import type { JSX } from "react";
import Layout from "@/routes/(website)/_layout.tsx";

export default function NotFound(): JSX.Element {
  return (
    <Layout>
      <main>
        <h1>Not Found</h1>
      </main>
    </Layout>
  );
}
