import type { JSX } from "react";
import resolver from "@/lib/link.ts";
import client from "~lib/graphql-request";
import { PostBySlugDocument } from "@/gql/graphql.ts";
import { notFound } from "react-app";
import type { AppProps } from "@/lib/app.tsx";
import Entry from "@/routes/entry.ts";
import { PortableText } from "@portabletext/react";
import { Ogp } from "react-ogp";
import { JsonLd } from "react-schemaorg";
import { Article } from "schema-dts";

export default async function Post(
  props: AppProps,
): Promise<JSX.Element> {
  const { lang, params } = props;
  const slug = params["slug"];

  if (!slug) {
    throw new Error("Invalid slug");
  }

  const decodedSlug = decodeURIComponent(slug);
  const href = resolver.resolve(Entry.Posts, { lang });
  const result = await client.request(PostBySlugDocument, {
    slug: decodedSlug,
  });

  const postPage = result.allPost[0];

  if (!postPage) notFound();

  const title = postPage.title ?? undefined;
  const description = postPage.description ?? undefined;
  const createdAt = postPage.createdAt ?? postPage._createdAt ?? undefined;
  const updatedAt = postPage.updatedAt ?? postPage._updatedAt ?? undefined;
  const createdDate = createdAt ? new Date(createdAt) : undefined;
  const updatedDate = updatedAt ? new Date(updatedAt) : undefined;

  return (
    <>
      <SeoMeta title={title} description={description} />
      <Ogp
        title={title}
        description={description}
        type="article"
        article={{
          section: postPage.categories?.[0]?.name ?? undefined,
          tags: postPage.tags?.map((tag) => tag?.name).filter(isNonNullable),
          publishedTime: createdDate?.toISOString(),
          modifiedTime: updatedDate?.toISOString(),
        }}
      />
      <JsonLd<Article>
        item={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: description,
          datePublished: createdDate?.toISOString(),
          dateModified: updatedDate?.toISOString(),
        }}
      >
      </JsonLd>

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
    </>
  );
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return !!value;
}

interface SeoMetaProps {
  title?: string;
  description?: string;
}

function SeoMeta(props: SeoMetaProps): JSX.Element {
  return (
    <>
      {props.title && <title>{props.title}</title>}
      {props.description && (
        <meta name="description" content={props.description}></meta>
      )}
    </>
  );
}
