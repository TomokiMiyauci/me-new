import type { JSX } from "react";

export interface OgImageProps {
  /**
   * Identical to `og:image`.
   */
  url?: string;

  /**
   * An alternate {@link url} to use if the webpage requires **HTTPS**.
   */
  secureUrl?: string;

  /**
   * A MIME type for this image.
   */
  type?: string;

  /**
   * The number of pixels wide.
   */
  width?: string;

  /**
   * The number of pixels high.
   */
  height?: string;

  /**
   * A description of what is in the image (not a caption).
   */
  alt?: string;
}

export default function OgImage(props: OgImageProps): JSX.Element {
  const { url, secureUrl, type, width, height, alt } = props;
  return (
    <>
      {url && <meta property="og:image:url" content={url} />}
      {secureUrl && <meta property="og:image:secure_url" content={secureUrl} />}
      {type && <meta property="og:image:type" content={type} />}
      {width && <meta property="og:image:width" content={width} />}
      {height && <meta property="og:image:height" content={height} />}
      {alt && <meta property="og:image:alt" content={alt} />}
    </>
  );
}
