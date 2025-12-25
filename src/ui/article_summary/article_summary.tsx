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
    <article className="flex max-w-xl flex-col items-start justify-between">
      {img && (
        <div className="mb-4">
          {img}
        </div>
      )}

      <div className="flex items-center gap-x-4 text-xs">
        {date && <FormmattedDate {...date}></FormmattedDate>}
      </div>

      <div className="group relative grow">
        <h2 className="mt-3 text-lg/6 font-semibold">{title}</h2>

        <p className="mt-5 line-clamp-3 text-sm/6">
          {excerpt}
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
