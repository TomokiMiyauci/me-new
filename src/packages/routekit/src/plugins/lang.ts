import { join } from "node:path";
import type { Params, Route } from "../types.ts";

export function withLang<T extends Params>(
  route: Route<T>,
  config: {
    default: string;
    languages: readonly string[];
  },
): Route<T & { lang: string }> {
  const entries = route.entries.map((entry) => {
    function pathname(params: T & { lang: string }): string {
      const { lang } = params;

      const base = entry.pathname(params);

      if (base === "/") return `/${lang}`;

      return join(`/${lang}`, base);
    }

    function condition(params: T & { lang: string }): boolean {
      if (!config.languages.includes(params.lang)) return false;
      if (!entry.condition) return true;

      return entry.condition(params);
    }

    return {
      condition,
      pathname,
    };
  });

  return {
    params: {
      ...route.params,
      lang: "required",
    },
    entries,
  };
}
