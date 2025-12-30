import type { ArticleFragment } from "./article.graphql.ts";
import type { JSX } from "react";
import { ArticleSummary, type ArticleSummaryProps } from "~component";
import Picture from "@/graphql/components/picture/picture.tsx";

export interface ArticleProps {
  lang: string;
  fragment: ArticleFragment;
}

export default function Article(props: ArticleProps): JSX.Element {
  const { fragment, lang } = props;
  const articleSummaryProps = fragmentToArticleSummaryProps(
    fragment,
    { lang },
  );

  return <ArticleSummary {...articleSummaryProps} />;
}

function fragmentToArticleSummaryProps(
  fragment: ArticleFragment,
  ctx: { lang: string },
): ArticleSummaryProps {
  const {
    title,
    _createdAt,
    description,
    createdAt: specifiedCreatedAt,
    coverImage,
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
    img: coverImage &&
      <Picture fragment={coverImage} />,
  } satisfies ArticleSummaryProps;

  return props;
}
