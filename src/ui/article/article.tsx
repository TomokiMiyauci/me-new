import type { JSX, ReactNode } from "react";

export interface ArticleProps {
  title: string;
  body?: ReactNode;
}

export default function Article(props: ArticleProps): JSX.Element {
  const { title, body } = props;

  return (
    <article className="prose mx-auto">
      <h1>{title}</h1>

      {body && <section>{body}</section>}
    </article>
  );
}
