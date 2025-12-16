import type { JSX } from "react";
import resolver from "@/services/link.ts";
import client from "@/services/graphql.ts";
import { PostBySlugDocument } from "@/gql/graphql.ts";
import { notFound } from "react-app";
import type { AppProps } from "@/services/app.tsx";
import Entry from "@/entry.ts";

export default async function Post(props: AppProps): Promise<JSX.Element> {
  const { lang, params } = props;
  const slug = params["slug"];

  if (!slug) {
    throw new Error("Invalid slug");
  }

  const decodedSlug = decodeURIComponent(slug);
  const href = resolver.resolve(Entry.Posts, { lang });
  const { allPostPage } = await client.request(PostBySlugDocument, {
    slug: decodedSlug,
  });
  const postPage = allPostPage[0];

  if (!postPage) notFound();

  const title = postPage.post?.title || "Untitled";

  return (
    <main>
      <a href={href ?? undefined}>Back to Post</a>

      <h1>{title}</h1>
    </main>
  );
}
