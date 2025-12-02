import { type InitOptions } from "i18next";
import { i18n as i } from "@/i18n.ts";
import enTranslation from "../locales/en.json" with {
  type: "json",
};
import deTranslation from "../locales/ja.json" with {
  type: "json",
};

const options = {
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

export default options;
