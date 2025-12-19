import type { JSX } from "react";

interface OgArticle {
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

interface OgpProps extends BasicMetadata, Article {
}

interface Article {
  type: "article";
  article: OgArticle;
}

interface BasicMetadata {
  title?: string;
  image?: string;
  url?: string;
  description?: string;
}

export default function Ogp(props: OgpProps): JSX.Element {
  const { title, description, type } = props;

  return (
    <>
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <ObjectTypes {...props} />
    </>
  );
}

function OgArticle(props: OgArticle): JSX.Element {
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

type ObjectTypesProps = Article;

function ObjectTypes(props: ObjectTypesProps): JSX.Element {
  switch (props.type) {
    case "article": {
      return <OgArticle {...props.article} />;
    }
  }
}
