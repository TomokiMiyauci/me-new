import type { JSX } from "react";
import OgImage, { type OgImageProps } from "./og_image.tsx";
import ObjectType, { type Article } from "./object_type.tsx";

interface OgpProps extends BasicMetadata, Article {
}

interface BasicMetadata {
  /**
   * The title of your object as it should appear within the graph, e.g., "The Rock".
   */
  title?: string;

  /**
   * The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "https://www.imdb.com/title/tt0117500/".
   */
  url?: string;

  /**
   * A one to two sentence description of your object.
   */
  description?: string;

  /**
   * An image URL or object which should represent your object within the graph.
   */
  image?: string | OgImageProps;

  /**
   * The locale these tags are marked up in. Of the format `language_TERRITORY`.
   */
  locale?: string;

  /**
   * Locales this page is available in.
   */
  localeAlternate?: string[] | string;

  /**
   * If your object is part of a larger web site, the name which should be displayed for the overall site. e.g., "IMDb".
   */
  siteName?: string;

  /**
   * The word that appears before this object's title in a sentence.
   */
  determiner?: "a" | "an" | "the" | "auto" | "";
}

export default function Ogp(props: OgpProps): JSX.Element {
  const {
    title,
    description,
    type,
    image,
    locale,
    localeAlternate,
    siteName,
    url,
    determiner,
  } = props;
  const localeAlternates = Array.isArray(localeAlternate)
    ? localeAlternate
    : localeAlternate
    ? [localeAlternate]
    : [];

  return (
    <>
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {locale && <meta property="og:locale" content={locale} />}
      {localeAlternates.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}
      {siteName && <meta property="og:site_name" content={siteName} />}
      {determiner && <meta property="og:determiner" content={determiner} />}
      {image && (typeof image === "string"
        ? <meta property="og:image" content={image} />
        : <OgImage {...image} />)}
      {type && <meta property="og:type" content={type} />}
      <ObjectType {...props} />
    </>
  );
}
