import type { JSX } from "react";
import { type OgImage, Ogp } from "react-ogp";
import { JsonLd } from "react-schemaorg";
import { type TechArticle } from "schema-dts";
import type { PostMetaFragment } from "./meta.graphql.ts";
import { SeoMeta } from "react-meta";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";

export interface PostMetaProps {
  fragment: PostMetaFragment;
  url: URL;
  translations: TranslationAlternation[];
  lang: string;
  slug: string;
}

interface TranslationAlternation {
  location: string;
  lang: string;
}

export default function PostMeta(props: PostMetaProps): JSX.Element {
  const { fragment, url, translations, lang, slug } = props;

  const { categories, tags } = fragment;
  const title = fragment.title ?? undefined;
  const description = fragment.description ?? undefined;
  const createdAt = fragment.createdAt ?? fragment._createdAt;
  const updatedAt = fragment.updatedAt ?? fragment._updatedAt;
  const createdDate = createdAt ? new Date(createdAt) : undefined;
  const updatedDate = updatedAt ? new Date(updatedAt) : undefined;
  const image = toImage(fragment.coverImage);
  const pathname = resolver.resolve(Entry.Post, { slug, lang });
  const canonicalURL = pathname ? new URL(pathname, url).toString() : undefined;

  return (
    <>
      <SeoMeta
        title={title}
        description={description}
        canonical={canonicalURL}
      />
      <Ogp
        title={title}
        description={description}
        url={canonicalURL}
        type="article"
        article={{
          section: categories?.[0]?.name ?? undefined,
          tags: tags?.map((tag) => tag?.name).filter(isNonNullable),
          publishedTime: createdDate?.toISOString(),
          modifiedTime: updatedDate?.toISOString(),
        }}
        image={image}
      />

      <JsonLd<TechArticle>
        item={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: title,
          description: description,
          datePublished: createdDate?.toISOString(),
          dateModified: updatedDate?.toISOString(),
        }}
      >
      </JsonLd>

      {translations.map(({ location, lang }) => {
        return (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={new URL(location, url).toString()}
          />
        );
      })}
    </>
  );
}

function toImage(
  fragment: PostMetaFragment["coverImage"],
): undefined | OgImage {
  if (!fragment) return;

  const { image, description } = fragment;

  return {
    url: image?.asset?.url ?? undefined,
    type: image?.asset?.mimeType ?? undefined,
    width: image?.asset?.metadata?.dimensions?.width?.toString() ??
      undefined,
    height: image?.asset?.metadata?.dimensions?.height?.toString() ??
      undefined,
    alt: description ?? undefined,
  };
}

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
