import type { JSX, PropsWithChildren } from "react";
import type { AppProps } from "@/lib/app.tsx";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import { Footer, Header } from "~component";
import language from "@/language.json" with { type: "json" };
import Logo from "@/components/logo/logo.tsx";

interface LayoutProps extends PropsWithChildren<AppProps> {
  translations?: TranslationItem[];
}

interface TranslationItem {
  location: string | undefined;
  lang: string;
}

export default function Layout(props: LayoutProps): JSX.Element {
  const { children, lang, translations, i18n } = props;
  const { t } = i18n;
  const href = resolver.resolve(Entry.Home, { lang });

  const translationItems = language.languages.map((lang) => {
    const location = translations?.find((item) => item.lang === lang)
      ?.location;
    return {
      // deno-lint-ignore no-explicit-any
      label: t(`locale.${lang}` as any),
      lang,
      location,
    };
  });

  return (
    <body className="font-roboto">
      <Header
        logo={
          <a
            className="inline-flex gap-4 justify-center items-center"
            href={href ?? undefined}
          >
            <Logo />
          </a>
        }
        translation={{
          title: t("ui.language_menu.label"),
          items: translationItems,
          usage: t("ui.language_menu.description"),
        }}
        lang={lang}
        className="px-4 md:px-8 lg:px-16"
      />

      <div className="px-4 md:px-8 lg:px-16">
        {children}
      </div>

      <Footer
        className="px-4 md:px-8 lg:px-16 mt-16 md:mt-40"
        logo={
          <a href={href ?? undefined}>
            <Logo />
          </a>
        }
        navigation={[
          {
            name: t("category.contents"),
            items: [
              {
                name: t("resource.blog"),
                location: resolver.resolve(Entry.Posts, { lang }) ?? "",
              },
            ],
          },
          {
            name: t("category.legal"),
            items: [
              {
                name: t("document.privacy_policy"),
                location: resolver.resolve(Entry.PrivacyPolicy, { lang }) ??
                  "",
              },
            ],
          },
        ]}
        copyright={t("copyright")}
      />
    </body>
  );
}
