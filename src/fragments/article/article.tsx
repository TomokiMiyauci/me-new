import type { ArticleFragment } from "./fragment.ts";
import type { JSX } from "react";
import { ArticleSummary, type ArticleSummaryProps } from "~component";
import Image from "../image/image.tsx";

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
    img: (
      coverImage && (
        <figure>
          <Image fragment={coverImage} />
        </figure>
      )
    ),
  } satisfies ArticleSummaryProps;

  return props;
}
