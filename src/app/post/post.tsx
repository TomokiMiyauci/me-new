import type { JSX } from "react";
import resolver from "@/lib/link.ts";
import client from "~lib/graphql-request";
import {
  PostBySlugDocument,
  TranslationBySlugDocument,
  TranslationBySlugQuery,
} from "@/gql/graphql.ts";
import { notFound } from "react-app";
import type { AppProps } from "@/lib/app.tsx";
import Entry from "@/routes/entry.ts";
import { PortableText } from "@portabletext/react";
import { Ogp } from "react-ogp";
import { JsonLd } from "react-schemaorg";
import { type TechArticle } from "schema-dts";
import Article from "~ui/article";
import Layout, { type Translation } from "@/app/layout.tsx";
import { localeMap } from "@/language.ts";

export default async function Post(
  props: AppProps,
): Promise<JSX.Element> {
  const { lang, params, url } = props;
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
  const id = postPage?.id;

  if (!postPage || !id) notFound();

  const translationsQuery = await client.request(TranslationBySlugDocument, {
    id,
  });

  const title = postPage.title ?? undefined;
  const description = postPage.description ?? undefined;
  const createdAt = postPage.createdAt ?? postPage._createdAt ?? undefined;
  const updatedAt = postPage.updatedAt ?? postPage._updatedAt ?? undefined;
  const createdDate = createdAt ? new Date(createdAt) : undefined;
  const updatedDate = updatedAt ? new Date(updatedAt) : undefined;

  const normalized = normalizeTranslation(translationsQuery);

  const alternatives = normalized.map(({ slug, language }) => {
    return {
      location: resolver.resolve(Entry.Post, { lang: language, slug }),
      lang: language,
    };
  }).filter(isTranslationAlternation);

  const translations = toTranslations(alternatives, localeMap);

  return (
    <Layout translations={translations} {...props}>
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

      {alternatives.map(({ location, lang }) => {
        return (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={new URL(location, url).toString()}
          />
        );
      })}

      <main className="px-4 space-y-2">
        <p>
          <a href={href ?? undefined}>Back to Post</a>
        </p>

        <Article
          title={title ?? ""}
          body={postPage.bodyRaw && <PortableText value={postPage.bodyRaw} />}
        />
      </main>
    </Layout>
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

interface NormalizedTranslation {
  slug: string;
  language: string;
}

interface TranslationAlternation {
  location: string;
  lang: string;
}

function isTranslationAlternation(
  _: object,
): _ is TranslationAlternation {
  return true;
}

function toTranslations(
  alternatives: TranslationAlternation[],
  labelMap: Record<string, string>,
): Translation[] {
  return Object.entries(labelMap).map(([lang, label]) => {
    const alt = alternatives.find((alt) => alt.lang === lang);

    if (!alt) return;

    return {
      location: alt.location,
      label,
      lang,
    };
  }).filter(isNonNullable);
}

function normalizeTranslation(
  query: TranslationBySlugQuery,
): NormalizedTranslation[] {
  const result = query.allTranslationMetadata.flatMap((t) => {
    return t.translations?.map((t) => {
      switch (t?.value?.__typename) {
        case "Post": {
          const value = t.value;
          return {
            language: value.language,
            slug: value.slug?.current,
          };
        }
      }

      return {};
    }).filter(isNormalizedTranslation) ?? [];
  });

  return result;
}

function isNormalizedTranslation(
  value: object,
): value is NormalizedTranslation {
  return value !== null && "slug" in value && "language" in value;
}
