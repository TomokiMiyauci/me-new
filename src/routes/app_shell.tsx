import { JSX } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "@/app/manifest.tsx";
import GlobalError from "../app/global_error.tsx";
import Entry from "./entry.ts";
import Router from "./router.tsx";
import component from "./component.ts";
import { type AppProps } from "@/lib/app.tsx";
import Html from "@/app/html.tsx";

export interface AppShellProps {
  app: AppProps;
  entry: Entry | undefined;
}

export default function AppShell(
  props: AppShellProps,
): JSX.Element {
  const { entry, app } = props;

  return (
    <ErrorBoundary fallback={<GlobalError />}>
      <Html {...app}>
        <ErrorBoundary fallback={<Error {...app} />}>
          <Router
            entry={entry}
            app={app}
            map={component}
          />
        </ErrorBoundary>
      </Html>
    </ErrorBoundary>
  );
}
