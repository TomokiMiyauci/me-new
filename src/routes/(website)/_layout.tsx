import "./index.css";
import { JSX, ReactNode } from "react";

export interface AppProps {
  children: ReactNode;
}

export default function App(props: AppProps): JSX.Element {
  const { children } = props;

  return (
    <html lang="en">
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
