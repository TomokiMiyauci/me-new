import type { JSX } from "react";
import { SeoMeta } from "react-meta";

export default function PostsMeta(): JSX.Element {
  return (
    <>
      <SeoMeta
        title="Posts"
        description="All posts"
      />
    </>
  );
}
