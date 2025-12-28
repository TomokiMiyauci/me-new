import { join } from "node:path";
import type { Params, Route } from "../types.ts";

export function withLang<T extends Params>(
  route: Route<T>,
  config: {
    default: string;
    languages: readonly string[];
  },
): Route<T & { lang: string }> {
  const versions = ["default", "languages"] as const;

  const entries = versions.flatMap((version) => {
    return route.entries.map((entry) => {
      function pathname(params: T & { lang: string }): string {
        const { lang } = params;

        const base = entry.pathname(params);

        if (base === "/") return `/${lang}`;

        return join(`/${lang}`, base);
      }

      function condition(params: T & { lang: string }): boolean {
        if (config.languages.includes(params.lang)) return false;

        if (!entry.condition) return true;

        return entry.condition(params);
      }

      function conditionJs(params: T & { lang: string }): boolean {
        if (!config.languages.includes(params.lang)) return false;
        if (!entry.condition) return true;

        return entry.condition(params);
      }

      switch (version) {
        case "default": {
          return {
            condition,
            pathname: entry.pathname.bind(entry),
          };
        }

        case "languages": {
          return {
            condition: conditionJs,
            pathname,
          };
        }
      }
    });
  });

  return {
    params: {
      ...route.params,
      lang: "required",
    },
    entries,
  };
}
