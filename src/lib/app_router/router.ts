import type { Plugin, Route } from "./types.ts";

export class AppRouter<T, U> {
  public routes: Route<T, U>[];
  constructor(routes: Route<T, U>[], options?: { plugins: Plugin<T, U>[] }) {
    for (const plugin of options?.plugins ?? []) {
      routes = plugin.extendRoutes(routes);
    }

    this.routes = routes;
  }

  match(url: URL): Route<T, U> | null {
    for (const route of this.routes) {
      if (route.pattern.test(url)) return route;
    }

    return null;
  }
}
