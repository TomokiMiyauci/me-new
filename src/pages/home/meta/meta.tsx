import type { JSX } from "react";
import type { HomeMetaFragment } from "./meta.graphql.ts";
import { type Alternate, SeoMeta } from "react-meta";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import language from "@/language.json" with { type: "json" };
import { isNonNullable } from "isx";
import { Ogp } from "react-ogp";
import OgImage from "@/graphql/components/og_image/og_image.tsx";

export interface HomeMetaProps {
  fragment: HomeMetaFragment;
  origin: string;
  lang: string;
}

export default function HomeMeta(props: HomeMetaProps): JSX.Element {
  const { fragment, origin, lang } = props;
  const { coverImage } = fragment;

  const title = fragment.title ?? undefined;
  const desciription = fragment.description ?? undefined;
  const pathname = resolver.resolve(Entry.Home, { lang });
  const canonicalURL = pathname ? new URL(pathname, origin) : undefined;
  const alternates = language.languages.map((lang) => {
    const altPathname = resolver.resolve(Entry.Home, { lang });
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
