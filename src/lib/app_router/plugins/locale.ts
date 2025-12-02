import type { Plugin, Route } from "../types.ts";

export interface LocaleContext {
  locales: Locale[];
}

export interface Locale {
  locale: string;
  pattern: URLPattern;
}

interface URLPatternHandler {
  (pattern: URLPattern): URLPattern;
}

export class Multilingual implements Plugin<LocaleContext> {
  constructor(public map: Record<string, URLPatternHandler>) {}
  name = "multilingual";
  extendRoutes(
    routes: Route<LocaleContext>[],
  ): Route<LocaleContext>[] {
    const map = this.map;
    const entries = Object.entries(map);
    function* gen(): Generator<Route<LocaleContext>> {
      for (const route of routes) {
        for (const [key, handler] of entries) {
          const pattern = route.metadata?.locales.find((locale) =>
            locale.locale === key
          )?.pattern ?? route.pattern;

          const newPattern = handler(pattern);

          yield {
            component: route.component,
            pattern: newPattern,
            metadata: route.metadata,
          };
        }
      }
    }

    return [...gen()];
  }
}
