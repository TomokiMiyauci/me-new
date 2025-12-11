import { type JSX } from "react";
import resolver from "@/services/link.ts";
import { type AppProps } from "@/services/app.tsx";
import Entry from "@/entry.ts";

export default function Home(props: AppProps): JSX.Element {
  const { i18n, lang } = props;
  const post = resolver.resolve(Entry.Posts, { lang });

  const { t } = i18n;

  return (
    <main>
      <title>{t("home.title")}</title>

      <div>
        <a href={post ?? undefined}>Posts</a>
      </div>
    </main>
  );
}
