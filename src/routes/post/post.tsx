import type { JSX } from "react";
import resolver from "@/services/link.ts";
import client from "@/services/urql.ts";
import { PostBySlugDocument } from "@/gql/graphql.ts";
import { notFound } from "react-app";
import type { AppProps } from "@/services/app.tsx";
import Entry from "@/entry.ts";
import { PortableText } from "@portabletext/react";

export default async function Post(props: AppProps): Promise<JSX.Element> {
  const { lang, params } = props;
  const slug = params["slug"];

  if (!slug) {
    throw new Error("Invalid slug");
  }

  const decodedSlug = decodeURIComponent(slug);
  const href = resolver.resolve(Entry.Posts, { lang });
  const result = await client.query(PostBySlugDocument, {
    slug: decodedSlug,
  });

  if (result.error) {
    throw result.error;
  }

  if (!result.data) {
    notFound();
  }

  const postPage = result.data.allPost[0];

  if (!postPage) notFound();

  const title = postPage.title || "Untitled";
  return (
    <main>
      <article>
        <a href={href ?? undefined}>Back to Post</a>

        <h1>{title}</h1>

        {postPage.bodyRaw && (
          <section>
            <PortableText value={postPage.bodyRaw} />
          </section>
        )}
      </article>
    </main>
  );
}
