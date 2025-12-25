import "./index.css";
import { JSX, PropsWithChildren } from "react";
import { type AppProps } from "@/lib/app.tsx";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import Header from "~ui/header";
import Footer from "~ui/footer";
import { languages } from "@/language.ts";

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

  const translationItems = languages.map((lang) => {
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
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Header
          logo={<a href={href ?? undefined}>Home</a>}
          translation={{
            title: t("ui.language_menu.label"),
            items: translationItems,
          }}
          lang={lang}
          className="px-4 md:px-8 lg:px-16"
        />

        <div className="px-4 md:px-8 lg:px-16">
          {children}
        </div>

        <Footer
          className="px-4 md:px-8 lg:px-16 mt-16 md:mt-40"
          logo={<a href={href ?? undefined}>Home</a>}
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
    </html>
  );
}
