import type { ReactNode } from "react";

export interface RouterProps<T = unknown> {
  url: URL;
  fallback?: ReactNode;
  routes: Route<T>[];
  context: T;
}

interface RoutingProps<T = unknown> {
  params: Record<string, string>;
  context: T;
}

export interface Route<T = unknown> {
  pattern: URLPattern;
  component(props: RoutingProps<T>): ReactNode;
}

export default function Router<T = unknown>(props: RouterProps<T>): ReactNode {
  const { routes, url, fallback, context } = props;

  for (const route of routes) {
    const result = route.pattern.exec(url);
    if (result) {
      const params = result.pathname.groups as Record<string, string>;

      if (route.component) {
        return route.component({ context, params });
      }
    }
  }

  return fallback;
}
