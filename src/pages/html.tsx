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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:opsz,wght@14..32,100..900&?family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />

        <Ogp siteName={t("site.name")} />
      </head>

      {children}
    </html>
  );
}
