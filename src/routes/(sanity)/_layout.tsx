import "./style.css";
import { type JSX, PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren): JSX.Element {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
