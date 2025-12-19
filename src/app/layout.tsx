import "./index.css";
import { JSX, PropsWithChildren } from "react";
import { type AppProps } from "@/lib/app.tsx";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
// import { localeMap } from "@/language.ts";

export interface Translation {
  location: string;
  label: string;
  lang: string;
}

interface LayoutProps extends PropsWithChildren<AppProps> {
  translations?: Translation[];
}

export default function Layout(props: LayoutProps): JSX.Element {
  const { children, lang, translations } = props;
  const href = resolver.resolve(Entry.Home, { lang });

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <header className="px-4 py-6">
          <a href={href ?? undefined}>
            Home
          </a>

          {translations?.map((translation) => {
            const { label, lang, location } = translation;
            return (
              <li key={lang}>
                <a href={location}>
                  {label}
                </a>
              </li>
            );
          })}
        </header>
        {children}
      </body>
    </html>
  );
}
