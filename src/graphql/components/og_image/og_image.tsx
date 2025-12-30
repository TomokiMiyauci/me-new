import type { JSX } from "react";
import { type OgImage, OgpImage } from "react-ogp";
import type { OgImageFragment } from "./og_image.graphql.ts";

export interface OgImageProps {
  fragment: OgImageFragment;
}

export default function OgImage(props: OgImageProps): JSX.Element {
  const { fragment } = props;
  const image = toImage(fragment);

  return <OgpImage {...image} />;
}

function toImage(
  fragment: OgImageFragment,
): OgImage {
  const { image, description } = fragment;

  return {
    url: image?.asset?.url ?? undefined,
    type: image?.asset?.mimeType ?? undefined,
    width: image?.asset?.metadata?.dimensions?.width?.toString() ??
      undefined,
    height: image?.asset?.metadata?.dimensions?.height?.toString() ??
      undefined,
    alt: description ?? undefined,
  };
}
