import type { JSX } from "react";

export interface SeoMetaProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export default function SeoMeta(props: SeoMetaProps): JSX.Element {
  const { title, description, canonical } = props;
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description}></meta>}
      {canonical && <link rel="canonical" href={canonical} />}
    </>
  );
}
