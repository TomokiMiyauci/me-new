import type { Params, Route } from "../types.ts";

export function withLang<T extends Params>(
  route: Route<T>,
  config: {
    defaultLang: string;
    alternatives: readonly string[];
  },
): Route<T & { lang: string }> {
  const versions = ["default", "alternatives"] as const;

  const entries = versions.flatMap((version) => {
    return route.entries.map((entry) => {
      function pathname(params: T & { lang: string }): string {
        const { lang } = params;

        return `/${lang}` + entry.pathname(params);
      }

      function condition(params: T & { lang: string }): boolean {
        if (config.alternatives.includes(params.lang)) return false;

        if (!entry.condition) return true;

        return entry.condition(params);
      }

      function conditionJs(params: T & { lang: string }): boolean {
        if (!config.alternatives.includes(params.lang)) return false;
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

        case "alternatives": {
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
