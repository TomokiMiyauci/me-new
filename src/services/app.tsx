import { type JSX, lazy } from "react";
import { isNotFoundErrorLike } from "react-app";
import { type FallbackProps } from "react-error-boundary";
import { Entry } from "@/routes/routes.tsx";
import type i18n from "i18next";

const NotFound = /* @__PURE__ */ lazy(() => import("@/routes/_404.tsx"));
const ServerError = /* @__PURE__ */ lazy(() => import("@/routes/_500.tsx"));

export function Fallback(props: FallbackProps): JSX.Element {
  const { error, resetErrorBoundary } = props;

  if (isNotFoundErrorLike(error)) {
    return <NotFound />;
  }

  return <ServerError error={error} resetErrorBoundary={resetErrorBoundary} />;
}

export interface AppProps {
  url: URL;
  lang: string;
  entry: Entry;
  i18n: typeof i18n;
}
