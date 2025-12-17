import { GetAllPostDocument } from "@/gql/graphql.ts";
import ArticleFragment from "@/components/article/article.tsx";
import client from "@/services/graphql_request.ts";
import type { JSX } from "react";
import resolver from "@/services/link.ts";
import Entry from "@/entry.ts";

export default async function Posts(): Promise<JSX.Element> {
  const lang = "en";
  const result = await client.request(GetAllPostDocument, { lang });

  return (
    <main>
      {result.allPost.map((article) => {
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
