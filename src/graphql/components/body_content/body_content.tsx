// deno-lint-ignore-file no-explicit-any
import type {
  PortableTextReactComponents,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import type { JSX } from "react";
import CodeBlock from "@/components/code_block/code_block.tsx";

function Code(props: PortableTextTypeComponentProps<any>): JSX.Element {
  return <CodeBlock fragment={props.value} />;
}

export default {
  types: { code: Code },
} satisfies Partial<PortableTextReactComponents>;
