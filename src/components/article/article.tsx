import type { Article_ArticleFragment } from "@/gql/graphql.ts";
import type { JSX } from "react";

export default function ArticleFragment(props: {
  fragment: Article_ArticleFragment;
}): JSX.Element {
  const { fragment } = props;

  return <div>{fragment._id}</div>;
}
