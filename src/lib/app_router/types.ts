import type { ReactNode } from "react";

export interface Plugin<T = unknown, U = unknown> {
  name: string;

  extendRoutes: (routes: Route<T, U>[]) => Route<T, U>[];
}

// deno-lint-ignore no-explicit-any
export interface Route<T, U = any> {
  pattern: URLPattern;
  component: (props: U) => ReactNode;
  metadata?: T;
}
