import type { RscPayload } from "./types.ts";
import { type ReactNode, use } from "react";

export interface Ref<T> {
  current: T;
}

export function createRef<T>(init: T): [Ref<T>, (value: T) => void] {
  const ref = { current: init };

  function setState(value: T): void {
    ref.current = value;
  }

  return [ref, setState];
}

interface RscProps {
  payload: RscPayload;
}

export function Rsc(props: RscProps): ReactNode {
  return props.payload.root;
}

interface RscPromiseProps {
  promise: Promise<RscPayload>;
}

export function RscPromise(props: RscPromiseProps) {
  const payload = use(props.promise);

  return <Rsc payload={payload}></Rsc>;
}
