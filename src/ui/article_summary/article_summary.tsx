import type { JSX } from "react";

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
}

export default function ArticleSummary(
  props: ArticleSummaryProps,
): JSX.Element {
  const { title, excerpt, date } = props;

  return (
    <article>
      <span>{title}</span>

      {excerpt && <p>{excerpt}</p>}

      {date && <FormmattedDate dateTime={date.dateTime} label={date.label} />}
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
