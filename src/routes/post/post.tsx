import type { JSX } from "react";
import resolver, { Entry } from "@/services/link.ts";
import client from "@/services/graphql.ts";
import { PostBySlugDocument } from "@/gql/graphql.ts";
import { notFound } from "react-app";
import type { AppProps } from "@/services/app.tsx";

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

  return (
    <main>
      <a href={href ?? undefined}>Post</a>
    </main>
  );
}
