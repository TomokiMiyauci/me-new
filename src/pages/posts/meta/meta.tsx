import type { JSX } from "react";
import { type Alternate, SeoMeta } from "react-meta";
import type { PostsMetaFragment } from "@/pages/posts/meta/meta.graphql.ts";
import OgImage from "@/graphql/components/og_image/og_image.tsx";
import { Ogp } from "react-ogp";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import language from "@/language.json" with { type: "json" };
import { isNonNullable } from "isx";

export interface PostsMetaProps {
  fragment: PostsMetaFragment;
  origin: string;
  lang: string;
}

export default function PostsMeta(props: PostsMetaProps): JSX.Element {
  const { fragment, origin, lang } = props;

  const title = fragment.title ?? undefined;
  const desciription = fragment.description ?? undefined;
  const { coverImage } = fragment;
  const pathname = resolver.resolve(Entry.Posts, { lang });
  const canonicalURL = pathname ? new URL(pathname, origin) : undefined;
  const alternates = language.languages.map((lang) => {
    const altPathname = resolver.resolve(Entry.Posts, { lang });
    if (!altPathname) return null;

    return {
      hrefLang: lang,
      href: new URL(altPathname, origin).toString(),
    } satisfies Alternate;
  }).filter(isNonNullable);

  return (
    <>
      <SeoMeta
        title={title}
        description={desciription}
        canonical={canonicalURL?.toString()}
        alternates={alternates}
      />
      <Ogp title={title} description={desciription} type="website" />
      {coverImage && <OgImage fragment={coverImage} />}
    </>
  );
}
