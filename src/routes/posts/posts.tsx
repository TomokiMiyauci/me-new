import { GetAllPostDocument } from "@/gql/graphql.ts";
import ArticleFragment from "@/components/article/article.tsx";
import client from "@/services/urql.ts";
import type { JSX } from "react";
import resolver from "@/services/link.ts";
import Entry from "@/entry.ts";
import { notFound } from "react-app";

export default async function Posts(): Promise<JSX.Element> {
  const lang = "en";
  const result = await client.query(GetAllPostDocument, { lang });

  if (result.error) {
    throw result.error;
  }

  if (!result.data) {
    notFound();
  }

  return (
    <main>
      {result.data.allPost.map((article) => {
        const slug = article.slug?.current ?? "";
        const href = resolver.resolve(Entry.Post, { slug });

        return (
          <li key={article.key}>
            <a href={href ?? undefined}>
              <ArticleFragment lang={lang} fragment={article} />
            </a>
          </li>
        );
      })}
    </main>
  );
}
