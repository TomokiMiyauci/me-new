export const i18n = {
  defaultLang: "en" as const,
  alternatives: ["ja"] as const,
};

type Locale = typeof i18n["defaultLang"] | typeof i18n.alternatives[number];

export const localeMap = {
  en: "English",
  // deno-lint-ignore prefer-ascii
  ja: "日本語",
} satisfies Record<Locale, string>;
