import type { Route } from "../types.ts";

export class EntryResolver<T extends Record<string, Route>> {
  constructor(public routes: T) {
  }

  resolve<U extends keyof T>(key: U, params: T[U]["params"]): string | null {
    for (const entry of this.routes[key]?.entries ?? []) {
      if (entry.condition) {
        if (!entry.condition(params)) {
          continue;
        }
      }

      return entry.pathname(params);
    }

    return null;
  }
}
