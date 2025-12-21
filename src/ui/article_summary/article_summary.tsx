import type { JSX, ReactNode } from "react";

export interface ArticleSummaryProps {
  /**
   * Title of the article.
   */
  title: string;

  /**
   * Except of the article body.
   */
  excerpt?: string;

  date?: FormmattedDateProps;
  img?: ReactNode;
}

export default function ArticleSummary(
  props: ArticleSummaryProps,
): JSX.Element {
  const { title, excerpt, date, img } = props;

  return (
    <article className="card sm:card-side hover:bg-base-200 transition-colors sm:max-w-none">
      <div className="p-6 max-sm:pb-0 sm:max-w-48 sm:pe-0">
        {img}
      </div>
      <div className="card-body">
        <h2 className="card-title font-title">{title}</h2>
        <p className="text-xs opacity-60">{excerpt}</p>
        <p>
          <small>
            {date && <FormmattedDate {...date}></FormmattedDate>}
          </small>
        </p>
      </div>
    </article>
  );
}

export interface FormmattedDateProps {
  /**
   * ISO 8601 formatted date string
   */
  dateTime: string;

  /**
   * Human readable date string
   */
  label: string;
}

function FormmattedDate(props: FormmattedDateProps): JSX.Element {
  const { dateTime, label } = props;

  return <time dateTime={dateTime}>{label}</time>;
}
