import { GetAllPostDocument } from "@/gql/graphql.ts";
import ArticleFragment from "@/components/article/article.tsx";
import client from "@/services/graphql.ts";
import type { JSX } from "react";
import resolver, { Entry } from "@/services/link.ts";

export default async function Posts(): Promise<JSX.Element> {
  const result = await client.request(GetAllPostDocument);

  return (
    <main>
      {result.allPostPage.map((article) => {
        const slug = article.slug?.current ?? "";
        const href = resolver.resolve(Entry.Post, { slug });

        return (
          <li key={article.key}>
            <a href={href ?? undefined}>
              <ArticleFragment fragment={article} />
            </a>
          </li>
        );
      })}
    </main>
  );
}
