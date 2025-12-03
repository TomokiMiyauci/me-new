import { type InitOptions } from "i18next";
import { i18n as i } from "@/language.ts";
import enTranslation from "@/locales/en.json" with {
  type: "json",
};
import deTranslation from "@/locales/ja.json" with {
  type: "json",
};

export default {
  fallbackLng: i.defaultLang,
  resources: {
    en: {
      translation: enTranslation,
    },
    ja: {
      translation: deTranslation,
    },
  },
} satisfies InitOptions;
