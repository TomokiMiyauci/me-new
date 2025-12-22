import { type JSX } from "react";
import resolver from "@/lib/link.ts";
import { type AppProps } from "@/lib/app.tsx";
import Entry from "@/routes/entry.ts";
import Layout from "../layout.tsx";
import { languages } from "@/language.ts";
import greet from "./greet.json" with { type: "json" };

export default function Home(props: AppProps): JSX.Element {
  return (
    <Layout
      {...props}
      translations={languages.map((lang) => ({
        lang,
        location: resolver.resolve(Entry.Home, { lang }) ?? undefined,
      }))}
    >
      <main>
        <div className="min-h-[90vh] grid place-content-center">
          <span className="text-rotate text-6xl leading-18 md:text-9xl md:leading-40">
            <span className="justify-items-center">
              {Object.entries(greet).map(([key, message]) => {
                return <span key={key}>{message}</span>;
              })}
            </span>
          </span>
        </div>
      </main>
    </Layout>
  );
}
