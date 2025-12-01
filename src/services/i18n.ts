import i18next from "i18next";
import { i18n as i } from "~/i18n.ts";
import enTranslation from "../locales/en.json" with {
  type: "json",
};
import deTranslation from "../locales/ja.json" with {
  type: "json",
};

const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;

i18next
  .init({
    fallbackLng: i.defaultLang,
    resources: {
      en: {
        translation: enTranslation,
      },
      ja: {
        translation: deTranslation,
      },
    },
  });

export default (lng?: string | undefined | null) =>
  i18next.getFixedT(lng || systemLocale);
