import { JSX } from "react";
import { NotFoundBoundary } from "react-app";
import Entry from "./entry.ts";
import c from "./component.ts";
import { NotFound } from "@/app/manifest.tsx";

export interface RouterProps {
  entry: Entry | undefined;
  map: typeof c;
  lang: string;
  params: Record<string, string | undefined>;
}

export default function Router(props: RouterProps): JSX.Element {
  const { entry, map, lang, params } = props;
  const appProps = { lang, params };

  if (!entry) return <NotFound {...appProps} />;

  const Component = map[entry];

  return (
    <NotFoundBoundary fallback={<NotFound {...appProps} />}>
      <Component {...appProps} />
    </NotFoundBoundary>
  );
}
