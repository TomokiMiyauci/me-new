"use client";

import { Studio as _Studio, type StudioProps } from "sanity";
import { type ReactNode, useSyncExternalStore } from "react";

export default function Studio(props: StudioProps): ReactNode {
  const mounted = useIsMounted();

  if (mounted) return <_Studio {...props} />;

  return;
}

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
// eslint-disable-next-line no-empty-function
const emptySubscribe = () => () => {};
