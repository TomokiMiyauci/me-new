// import { type LocaleConfig } from "@/lib/locale/mod.ts";

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ja"] as const,
};

type Locale = typeof i18n.locales[number];

export const localeMap = {
  ja: "日本語",
  en: "English",
} satisfies Record<Locale, string>;
