import { GetAllPostDocument } from "@/gql/graphql.ts";
import ArticleFragment from "@/components/article/article.tsx";
import client from "~lib/graphql-client";
import type { JSX } from "react";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import { AppProps } from "@/lib/app.tsx";
import { languages } from "@/language.ts";
import Layout from "@/app/layout.tsx";

export default async function Posts(props: AppProps): Promise<JSX.Element> {
  const { lang, i18n } = props;
  const result = await client.query(GetAllPostDocument, { lang });
  const { t } = i18n;
  return (
    <Layout
      {...props}
      translations={languages.map((lang) => ({
        lang,
        location: resolver.resolve(Entry.Posts, { lang }) ?? undefined,
      }))}
    >
      <main>
        <section>
          <h1 className="text-9xl text-center mt-32 mb-24">
            {t("resource.blog")}
          </h1>
        </section>

        <section className="max-w-[65ch] mx-auto mt-48 mb-64">
          <ul className="grid justify-items-stretch gap-6">
            {result.allPost.map((article) => {
              const slug = article.slug?.current ?? "";
              const href = resolver.resolve(Entry.Post, { slug, lang });

              return (
                <li key={article.key}>
                  <a href={href ?? undefined}>
                    <ArticleFragment lang={lang} fragment={article} />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
