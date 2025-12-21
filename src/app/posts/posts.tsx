import { GetAllPostDocument } from "@/gql/graphql.ts";
import ArticleFragment from "@/components/article/article.tsx";
import client from "~lib/graphql-request";
import type { JSX } from "react";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import { AppProps } from "@/lib/app.tsx";
import Layout from "../layout.tsx";
import { languages } from "@/language.ts";

export default async function Posts(props: AppProps): Promise<JSX.Element> {
  const { lang } = props;
  const result = await client.request(GetAllPostDocument, { lang });

  return (
    <Layout
      {...props}
      translations={languages.map((lang) => ({
        lang,
        location: resolver.resolve(Entry.Posts, { lang }) ?? undefined,
      }))}
    >
      <main>
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
      </main>
    </Layout>
  );
}
