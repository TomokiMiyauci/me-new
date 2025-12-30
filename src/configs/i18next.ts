import type { InitOptions } from "i18next";
import language from "@/language.json" with { type: "json" };
import enTranslation from "@/locales/en.json" with {
  type: "json",
};
import jaTranslation from "@/locales/ja.json" with {
  type: "json",
};

export default {
  fallbackLng: language.default,
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
    defaultNS: "en";
    // custom resources type
    resources: {
      en: typeof enTranslation;
      ja: typeof jaTranslation;
    };
    // other
  }
}
