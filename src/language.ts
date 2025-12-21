export const i18n = {
  defaultLang: "en" as const,
  alternatives: ["ja"] as const,
};

export const languages = [i18n.defaultLang, ...i18n.alternatives];

export type Locale =
  | typeof i18n["defaultLang"]
  | typeof i18n.alternatives[number];
