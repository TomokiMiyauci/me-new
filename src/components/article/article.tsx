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
  const articleSummaryProps = articleFragmentToArticleSummaryProps(
    fragment,
    { lang },
  );

  return <ArticleSummary {...articleSummaryProps} />;
}

function articleFragmentToArticleSummaryProps(
  fragment: Article_ArticleFragment,
  ctx: { lang: string },
): ArticleSummaryProps {
  const {
    title,
    _createdAt,
    description,
    createdAt: specifiedCreatedAt,
  } = fragment;
  const excerpt = description ?? undefined;
  const createdAt = (specifiedCreatedAt ?? _createdAt) ?? undefined;
  const date = createdAt
    ? {
      dateTime: new Date(createdAt).toISOString(),
      label: new Date(createdAt).toLocaleDateString(ctx.lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
    : undefined;

  const props = {
    title: title ?? "",
    excerpt,
    date,
  } satisfies ArticleSummaryProps;

  return props;
}
