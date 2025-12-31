import type { JSX } from "react";
import { Error } from "@/pages/manifest.tsx";
import type Entry from "./entry.ts";
import Router from "./router.tsx";
import component from "./component.ts";
import type { AppProps } from "@/lib/app.tsx";
import Html from "@/pages/html.tsx";
import { ErrorBoundary, GlobalError } from "react-app";

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
