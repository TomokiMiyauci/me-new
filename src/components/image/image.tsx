import type { JSX } from "react";
import type { Image_ImgageFragment } from "@/gql/graphql.ts";
import { Img, SanityImageObject } from "@biggleszx/react-sanity-image";
import { client } from "@/utils.ts";
import { SanityAsset } from "@sanity/image-url";

export interface ImageProps {
  fragment: Image_ImgageFragment;
}

interface ImgImage extends SanityAsset, SanityImageObject {}

export default function Image(props: ImageProps): JSX.Element {
  const { fragment } = props;

  const result = validate(fragment);

  if (!result) throw new Error("unreachable");

  return <Img client={client} image={fragment} />;
}

function validate(value: Image_ImgageFragment): value is ImgImage {
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
