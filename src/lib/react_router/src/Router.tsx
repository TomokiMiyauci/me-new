import { type ReactNode } from "react";

export interface RouterProps {
  url: URL;
  fallback?: ReactNode;
  routes: Route[];
}

export interface Route {
  pattern: URLPattern;
  component: ReactNode;
}

export default function Router(props: RouterProps): ReactNode {
  const { routes, url, fallback } = props;

  for (const route of routes) {
    if (route.pattern.test(url)) {
      return route.component;
    }
  }

  return fallback;
}
