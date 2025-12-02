export const i18n = {
  defaultLang: "en" as const,
  alternatives: ["ja"] as const,
};

type Locale = typeof i18n["defaultLang"] | typeof i18n.alternatives[number];

export const localeMap = {
  ja: "日本語",
  en: "English",
} satisfies Record<Locale, string>;
