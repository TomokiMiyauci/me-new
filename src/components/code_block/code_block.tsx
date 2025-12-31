// deno-lint-ignore-file prefer-ascii
import type { ReactNode } from "react";
import { type BundledLanguage, bundledLanguages } from "shiki";
import { transformerNotationHighlight } from "@shikijs/transformers";

import { type JSX, use } from "react";
import type {
  BundledTheme,
  CodeOptionsSingleTheme,
  CodeToHastOptionsCommon,
} from "shiki";
import { codeToHtml } from "shiki";

export interface ShikiProps
  extends
    CodeToHastOptionsCommon<BundledLanguage>,
    CodeOptionsSingleTheme<BundledTheme> {
  children: string;
}

export function Shiki(props: ShikiProps): JSX.Element {
  const { children, ...options } = props;

  const html = use(codeToHtml(children, options));

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export interface CodeBlockProps {
  fragment: any;
}

export default function CodeBlock(
  props: CodeBlockProps,
): ReactNode {
  const { code, language, highlightedLines } = props.fragment;

  if (!code) return;

  const lang = toBundledLanguage(language);
  const content = convertHighlightedContent(code, highlightedLines);

  return (
    <Shiki
      transformers={[transformerNotationHighlight()]}
      lang={lang}
      theme="github-light"
    >
      {content}
    </Shiki>
  );
}

function toBundledLanguage(language: string | undefined): BundledLanguage {
  if (!language) return "文言";
  if (language in bundledLanguages) return language as BundledLanguage;

  return "文言";
}

function convertHighlightedContent(
  content: string,
  highlightedLines: number[] | undefined,
): string {
  if (!highlightedLines) return content;

  const sentences = content.split("\n");
  const newSentences = highlightedLines.reduce((acc, lineNumber) => {
    const index = lineNumber - 1;

    if (index in acc) {
      const sentence = acc[index];

      acc[index] = sentence + "// [!code highlight]";
    }

    return acc;
  }, sentences);

  return newSentences.join("\n");
}
