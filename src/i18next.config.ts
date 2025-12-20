import { type InitOptions } from "i18next";
import { i18n as i } from "@/language.ts";
import enTranslation from "@/locales/en.json" with {
  type: "json",
};
import jaTranslation from "@/locales/ja.json" with {
  type: "json",
};

export default {
  fallbackLng: i.defaultLang,
  resources: {
    en: {
      translation: enTranslation,
    },
    ja: {
      translation: jaTranslation,
    },
  },
} satisfies InitOptions;

import "i18next";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: typeof i["defaultLang"];
    // custom resources type
    resources: {
      en: typeof enTranslation;
      ja: typeof jaTranslation;
    };
    // other
  }
}
