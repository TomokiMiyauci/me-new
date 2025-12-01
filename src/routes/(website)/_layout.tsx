import "./index.css";
import { JSX, PropsWithChildren } from "react";
import { type AppProps } from "@/services/app.tsx";
import resolver from "@/services/link.ts";

export default function App(props: PropsWithChildren<AppProps>): JSX.Element {
  const { children, lang, entry } = props;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + RSC</title>
      </head>
      <body>
        <header>
          <ul>
            <li>
              <a
                href={resolver.resolve(entry, { lang: "en" }) ?? undefined}
              >
                English
              </a>
            </li>
            <li>
              <a
                href={resolver.resolve(entry, { lang: "ja" }) ?? undefined}
              >
                日本語
              </a>
            </li>
          </ul>
        </header>
        {children}
      </body>
    </html>
  );
}
