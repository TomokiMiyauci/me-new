import type { JSX } from "react";
import OgImage, { type OgImageProps } from "./og_image.tsx";
import ObjectType, { type Article } from "./object_type.tsx";

interface OgpProps extends BasicMetadata, Article {
}

interface BasicMetadata {
  title?: string;
  url?: string;
  description?: string;
  image?: string | OgImageProps;
}

export default function Ogp(props: OgpProps): JSX.Element {
  const { title, description, type, image } = props;

  return (
    <>
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {image && (typeof image === "string"
        ? <meta property="og:image" content={image} />
        : <OgImage {...image} />)}
      <ObjectType {...props} />
    </>
  );
}
