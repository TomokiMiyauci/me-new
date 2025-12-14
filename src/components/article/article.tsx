import type { Article_ArticleFragment } from "@/gql/graphql.ts";
import type { JSX } from "react";
import ArticleSummary, { type ArticleSummaryProps } from "~ui/article-summary";

export interface ArticleFragmentProps {
  lang: string;
  fragment: Article_ArticleFragment;
}

export default function ArticleFragment(
  props: ArticleFragmentProps,
): JSX.Element {
  const { fragment, lang } = props;
  const { post, _createdAt } = fragment;
  const title = post?.title ?? "";
  const excerpt = post?.description ?? undefined;
  const createdAt = (post?.createdAt ?? _createdAt) ?? undefined;
  const date = createdAt
    ? {
      dateTime: new Date(createdAt).toISOString(),
      label: new Date(createdAt).toLocaleDateString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
    : undefined;

  const articleSummaryProps = {
    title,
    excerpt,
    date,
  } satisfies ArticleSummaryProps;

  return <ArticleSummary {...articleSummaryProps} />;
}
