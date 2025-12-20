import type { JSX } from "react";
import { Ogp } from "react-ogp";
import { JsonLd } from "react-schemaorg";
import { type TechArticle } from "schema-dts";
import type { Post_Post_MetaFragment } from "@/gql/graphql.ts";

export interface PostMetaFragmentProps {
  fragment: Post_Post_MetaFragment;
  url: URL;
  translations: TranslationAlternation[];
}

interface TranslationAlternation {
  location: string;
  lang: string;
}

export default function PostMetaFragment(
  props: PostMetaFragmentProps,
): JSX.Element {
  const { fragment, url, translations } = props;

  const title = fragment.title ?? undefined;
  const description = fragment.description ?? undefined;
  const createdAt = fragment.createdAt ?? fragment._createdAt;
  const updatedAt = fragment.updatedAt ?? fragment._updatedAt;
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
          section: fragment.categories?.[0]?.name ?? undefined,
          tags: fragment.tags?.map((tag) => tag?.name).filter(isNonNullable),
          publishedTime: createdDate?.toISOString(),
          modifiedTime: updatedDate?.toISOString(),
        }}
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

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
