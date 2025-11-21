import type { ReactNode } from "react";
import type { RscPayload } from "../types.ts";

export interface RscProps {
  payload: RscPayload;
}

export default function Rsc(props: RscProps): ReactNode {
  const { payload } = props;

  return payload.root;
}
