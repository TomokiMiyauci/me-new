import type { JSX } from "react";
import resolver from "@/lib/link.ts";
import client from "~lib/graphql-client";
import {
  PostBySlugDocument,
  TranslationBySlugDocument,
  TranslationBySlugQuery,
} from "@/gql/graphql.ts";
import { notFound } from "react-app";
import type { AppProps } from "@/lib/app.tsx";
import Entry from "@/routes/entry.ts";
import { PortableText } from "@portabletext/react";
import Article from "~ui/article";
import Layout from "@/app/layout.tsx";
import PostMeta from "./post_meta.tsx";

export default async function Post(
  props: AppProps,
): Promise<JSX.Element> {
  const { lang, params, url, i18n } = props;
  const slug = params["slug"];

  if (!slug) {
    throw new Error("Invalid slug");
  }

  const decodedSlug = decodeURIComponent(slug);
  const result = await client.query(PostBySlugDocument, {
    slug: decodedSlug,
    lang,
  });

  const postPage = result.allPost[0];
  const id = postPage?.id;

  if (!postPage || !id) notFound();

  const translationsQuery = await client.query(TranslationBySlugDocument, {
    id,
  });

  const title = postPage.title ?? "";

  const normalized = normalizeTranslation(translationsQuery);

  const alternatives = normalized.map(({ slug, language }) => {
    return {
      location: resolver.resolve(Entry.Post, { lang: language, slug }),
      lang: language,
    };
  }).filter(isTranslationAlternation);

  const { t } = i18n;
  return (
    <Layout translations={alternatives} {...props}>
      <PostMeta url={url} fragment={postPage} translations={alternatives} />

      <main className="space-y-2 lg:max-w-[65ch] mx-auto">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href={resolver.resolve(Entry.Home, { lang }) ?? undefined}>
                {t("resource.home")}
              </a>
            </li>
            <li>
              <a href={resolver.resolve(Entry.Posts, { lang }) ?? undefined}>
                {t("resource.blog")}
              </a>
            </li>
            <li>
              <a href="">
                {title}
              </a>
            </li>
          </ul>
        </div>

        <Article
          title={title}
          body={postPage.bodyRaw && <PortableText value={postPage.bodyRaw} />}
        />
      </main>
    </Layout>
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
