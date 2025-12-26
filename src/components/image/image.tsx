import type { JSX } from "react";
import type { Image_ImageFragment } from "./fragment.ts";
import { Img, SanityImageObject } from "@biggleszx/react-sanity-image";
import client from "@/lib/sanity_client.ts";
import { SanityAsset } from "@sanity/image-url";

export interface ImageProps {
  fragment: Image_ImageFragment;
}

interface ImgImage extends SanityAsset, SanityImageObject {}

export default function Image(props: ImageProps): JSX.Element {
  const { fragment } = props;

  const result = validate(fragment);

  if (!result) throw new Error("unreachable");

  return <Img client={client} image={fragment} />;
}

function validate(value: Image_ImageFragment): value is ImgImage {
  if (
    !value.asset ||
    !value.asset.metadata ||
    !value.asset.metadata.dimensions ||
    !value.asset.metadata.dimensions.height ||
    !value.asset.metadata.dimensions.width
  ) {
    return false;
  }
  return true;
}
