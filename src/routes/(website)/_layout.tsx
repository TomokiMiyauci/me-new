import "./index.css";
import { JSX, PropsWithChildren } from "react";
import { type AppProps } from "@/services/app.tsx";

export default function App(props: PropsWithChildren<AppProps>): JSX.Element {
  const { children, lang } = props;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + RSC</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
