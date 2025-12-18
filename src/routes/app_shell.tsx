import { JSX } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "@/app/manifest.tsx";
import GlobalError from "../app/global_error.tsx";
import Entry from "./entry.ts";
import Router from "./router.tsx";
import component from "./component.ts";

export default function AppShell(
  props: {
    entry: Entry | undefined;
    lang: string;
    params: Record<string, string | undefined>;
  },
): JSX.Element {
  const { entry, lang, params } = props;
  const appProps = { lang, params };

  return (
    <ErrorBoundary fallback={<GlobalError />}>
      <ErrorBoundary fallback={<Error {...appProps} />}>
        <Router
          entry={entry}
          map={component}
          lang={lang}
          params={params}
        />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
