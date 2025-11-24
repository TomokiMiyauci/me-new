import { type FallbackProps } from "error-boundary";
import { type JSX, lazy } from "react";
import { isNotFoundErrorLike } from "react-app";

const NotFound = /* @__PURE__ */ lazy(() => import("@/routes/_404.tsx"));
const ServerError = /* @__PURE__ */ lazy(() => import("@/routes/_500.tsx"));

export function Fallback(props: FallbackProps): JSX.Element {
  const { error, reset } = props;

  if (isNotFoundErrorLike(error)) {
    return <NotFound />;
  }

  return <ServerError error={error} reset={reset} />;
}
