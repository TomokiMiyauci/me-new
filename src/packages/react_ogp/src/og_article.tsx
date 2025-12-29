import type { JSX } from "react";

export interface OgArticleProps {
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export default function OgArticle(props: OgArticleProps): JSX.Element {
  const { publishedTime, modifiedTime, section, tags } = props;

  return (
    <>
      {publishedTime && (
        <meta
          property="article:published_time"
          content={publishedTime}
        />
      )}
      {modifiedTime && (
        <meta
          property="article:modified_time"
          content={modifiedTime}
        />
      )}
      {section && <meta property="article:section" content={section} />}
      {tags &&
        tags.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
    </>
  );
}
