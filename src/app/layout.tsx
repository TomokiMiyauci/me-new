import "./index.css";
import { JSX, PropsWithChildren } from "react";
import { type AppProps } from "@/lib/app.tsx";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
// import { localeMap } from "@/language.ts";

export default function Layout(
  props: PropsWithChildren<AppProps>,
): JSX.Element {
  const { children, lang } = props;
  const href = resolver.resolve(Entry.Home, { lang });
  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <header>
          <a href={href ?? undefined}>
            Home
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
