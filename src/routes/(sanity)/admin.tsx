import { Studio } from "sanity_rsc";
import config from "~/sanity.config.ts";
import { type JSX } from "react";

export default function Admin(): JSX.Element {
  return <Studio config={config} />;
}
