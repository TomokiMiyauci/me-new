import type { JSX } from "react";
import { Ogp } from "react-ogp";
import { JsonLd } from "react-schemaorg";
import type { TechArticle } from "schema-dts";
import type { PostMetaFragment } from "./meta.graphql.ts";
import { SeoMeta } from "react-meta";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import OgImgage from "@/graphql/components/og_image/og_image.tsx";

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

  const { categories, tags, coverImage } = fragment;
  const title = fragment.title ?? undefined;
  const description = fragment.description ?? undefined;
  const createdAt = fragment.createdAt ?? fragment._createdAt;
  const updatedAt = fragment.updatedAt ?? fragment._updatedAt;
  const createdDate = createdAt ? new Date(createdAt) : undefined;
  const updatedDate = updatedAt ? new Date(updatedAt) : undefined;
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
      />
      {coverImage && <OgImgage fragment={coverImage} />}

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

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
