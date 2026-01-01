import { type JSX, use } from "react";
import type { BundledLanguage } from "shiki";
import {
  type BundledTheme,
  type CodeOptionsSingleTheme,
  type CodeToHastOptionsCommon,
  codeToHtml,
} from "shiki";

export interface ShikiProps
  extends
    CodeToHastOptionsCommon<BundledLanguage>,
    CodeOptionsSingleTheme<BundledTheme> {
  children: string;
}

export default function Shiki(props: ShikiProps): JSX.Element {
  const { children, ...options } = props;

  const html = use(codeToHtml(children, options));

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
