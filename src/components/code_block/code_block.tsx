import type { ReactNode } from "react";
import { type BundledLanguage, bundledLanguages } from "shiki";
import { transformerNotationHighlight } from "@shikijs/transformers";
import { Shiki } from "react-shiki";

export interface CodeBlockProps {
  fragment: CodeBlockFragment;
}

interface CodeBlockFragment {
  code?: string;
  language?: string;
  highlightedLines?: number[];
}

export default function CodeBlock(
  props: CodeBlockProps,
): ReactNode {
  const { code, language, highlightedLines } = props.fragment;

  if (!code) return;

  const lang = toBundledLanguage(language) ?? "text";
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

function toBundledLanguage(
  language: string | undefined,
): BundledLanguage | undefined {
  if (!language) return;
  if (language in bundledLanguages) return language as BundledLanguage;
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
