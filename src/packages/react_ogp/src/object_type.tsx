import type { JSX, ReactNode } from "react";
import OgArticle, { type OgArticleProps } from "./og_article.tsx";

export interface Article {
  type?: "article";
  article?: OgArticleProps;
}

export interface Website {
  type?: "website";
}

export type ObjectTypeProps = Article | Website;

export default function ObjectType(props: ObjectTypeProps): JSX.Element {
  const { type } = props;

  function renderObjectType(): ReactNode {
    switch (type) {
      case "article": {
        return <OgArticle {...props.article} />;
      }
    }
  }

  return (
    <>
      {type && <meta property="og:type" content={type} />}
      {renderObjectType()}
    </>
  );
}
