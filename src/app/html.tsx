import "./index.css";
import { JSX, PropsWithChildren } from "react";
import { type AppProps } from "@/lib/app.tsx";

export default function Html(props: PropsWithChildren<AppProps>): JSX.Element {
  const { children, lang } = props;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      {children}
    </html>
  );
}
