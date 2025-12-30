import "./index.css";
import type { JSX, PropsWithChildren } from "react";
import type { AppProps } from "@/lib/app.tsx";
import { Ogp } from "react-ogp";

export default function Html(props: PropsWithChildren<AppProps>): JSX.Element {
  const { children, lang, i18n } = props;
  const { t } = i18n;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="logo.svg" type="image/svg+xml" />

        <Ogp siteName={t("site.name")} />
      </head>

      {children}
    </html>
  );
}
