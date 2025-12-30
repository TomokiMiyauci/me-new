import type { JSX } from "react";

export interface SeoMetaProps {
  title?: string;
  description?: string;
  canonical?: string;
  alternates?: Alternate[];
}

export interface Alternate {
  hrefLang: string;
  href: string;
}

export default function SeoMeta(props: SeoMetaProps): JSX.Element {
  const { title, description, canonical, alternates } = props;
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description}></meta>}
      {canonical && <link rel="canonical" href={canonical} />}
      {alternates?.map((alternate) => (
        <link
          key={alternate.hrefLang}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={alternate.href}
        />
      ))}
    </>
  );
}
