import { JSX } from "react";
import { NotFoundBoundary } from "react-app";
import Entry from "./entry.ts";
import component from "./component.ts";
import { NotFound } from "@/pages/manifest.tsx";
import { type AppProps } from "@/lib/app.tsx";

export interface RouterProps {
  entry: Entry | undefined;
  map: typeof component;
  app: AppProps;
}

export default function Router(props: RouterProps): JSX.Element {
  const { entry, map, app } = props;

  if (!entry) return <NotFound {...app} />;

  const Component = map[entry];

  return (
    <NotFoundBoundary fallback={<NotFound {...app} />}>
      <Component {...app} />
    </NotFoundBoundary>
  );
}
