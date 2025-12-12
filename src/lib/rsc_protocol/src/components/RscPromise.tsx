import { type ReactNode, use } from "react";
import type { RscPayload } from "../types.ts";
import Rsc from "./Rsc.tsx";

export interface RscPromiseProps {
  promise: Promise<RscPayload>;
}

export default function RscPromise(props: RscPromiseProps): ReactNode {
  const payload = use(props.promise);

  return <Rsc payload={payload} />;
}
