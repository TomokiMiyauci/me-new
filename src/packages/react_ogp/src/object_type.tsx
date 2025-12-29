import { Fragment, type JSX } from "react";
import OgArticle, { type OgArticleProps } from "./og_article.tsx";

export interface Article {
  type?: "article";
  article?: OgArticleProps;
}

export type ObjectTypeProps = Article;

export default function ObjectType(props: ObjectTypeProps): JSX.Element {
  switch (props.type) {
    case "article": {
      return <OgArticle {...props.article} />;
    }
  }

  return <Fragment />;
}
