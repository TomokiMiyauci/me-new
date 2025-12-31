import type { JSX } from "react";
import type { PictureFragment } from "./picture.graphql.ts";
import { Img, type SanityImageObject } from "@biggleszx/react-sanity-image";
import client from "@/lib/sanity_client.ts";
import clsx from "clsx";
import type { SanityAsset } from "@sanity/image-url";

export interface PictureProps {
  fragment: PictureFragment;
  clasName?: string;
}

interface ImgImage extends SanityAsset, SanityImageObject {}

export default function Picture(props: PictureProps): JSX.Element {
  const { fragment, clasName } = props;

  const image = fragment.image;
  const result = validate(image);
  const description = fragment.description;

  if (!result) throw new Error("unreachable");

  return (
    <Img
      className={clsx("aspect-video object-cover", clasName)}
      alt={description ?? undefined}
      client={client}
      image={image}
    />
  );
}

function validate(value: PictureFragment["image"]): value is ImgImage {
  if (
    !value?.asset ||
    !value.asset.metadata ||
    !value.asset.metadata.dimensions ||
    !value.asset.metadata.dimensions.height ||
    !value.asset.metadata.dimensions.width
  ) {
    return false;
  }
  return true;
}
