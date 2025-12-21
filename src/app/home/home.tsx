import { type JSX } from "react";
import resolver from "@/lib/link.ts";
import { type AppProps } from "@/lib/app.tsx";
import Entry from "@/routes/entry.ts";
import Layout from "../layout.tsx";
import { languages } from "@/language.ts";

export default function Home(props: AppProps): JSX.Element {
  const { lang } = props;
  const post = resolver.resolve(Entry.Posts, { lang });

  // const { t } = i18n;

  return (
    <Layout
      {...props}
      translations={languages.map((lang) => ({
        lang,
        location: resolver.resolve(Entry.Home, { lang }) ?? undefined,
      }))}
    >
      <main>
        {/* <title>{t("home.title")}</title> */}

        <div>
          <a href={post ?? undefined}>Posts</a>
        </div>
      </main>
    </Layout>
  );
}
