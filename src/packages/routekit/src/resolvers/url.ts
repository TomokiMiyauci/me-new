import { mapEntries } from "@std/collections/map-entries";
import type { Params, Route } from "../types.ts";

export class URLResolver<T extends PropertyKey> {
  #routes: {
    key: T;
    pattern: URLPattern;
    condition?(params: Params): boolean;
  }[];
  constructor(routes: Record<T, Route>) {
    this.#routes = Object.entries<Route>(routes).flatMap(([key, route]) => {
      const params = mapEntries(
        route.params ?? {},
        ([key]) => [key, `:${key}`] as [string, string],
      );

      const entries = route.entries.map((entry) => {
        return {
          condition: entry.condition?.bind(entry),
          pathname: entry.pathname(params),
        };
      });

      return entries.map(({ pathname, condition }) => {
        const pattern = new URLPattern({ pathname });
        return {
          pattern,
          key: key as T,
          condition,
        };
      });
    });
  }

  resolve(
    url: URL,
  ):
    | {
      key: T;
      pattern: URLPattern;
      params: Record<string, string | undefined>;
    }
    | null {
    for (const route of this.#routes) {
      const result = route.pattern.exec(url);

      if (result) {
        const params = result.pathname.groups;

        if (route.condition) {
          const result = route.condition(params as Record<string, string>);

          if (!result) continue;
        }

        return {
          key: route.key,
          pattern: route.pattern,
          params,
        };
      }
    }

    return null;
  }
}
