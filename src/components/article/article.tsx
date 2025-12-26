import type { JSX, ReactNode } from "react";
import clsx from "clsx";

export interface ArticleProps {
  title: string;
  body?: ReactNode;
}

export default function Article(
  props:
    & ArticleProps
    & JSX.IntrinsicElements["article"],
): JSX.Element {
  const { title, body, ...rest } = props;
  const { className, ...restProps } = rest;

  return (
    <article className={clsx(className, "prose max-w-none")} {...restProps}>
      <h1>{title}</h1>

      {body && <section>{body}</section>}
    </article>
  );
}
