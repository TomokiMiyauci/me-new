import type { Meta } from "@storybook/react-vite";

import ArticleSummary from "./article_summary.tsx";

const meta = {
  component: ArticleSummary,
  tags: ["autodocs"],
  title: "ArticleSummary",
} satisfies Meta<typeof ArticleSummary>;

export default meta;

export const Basic = {
  args: {
    title: "Sample Article Title",
    excerpt:
      "This is a sample excerpt of the article summary component used for testing and demonstration purposes.",
  },
};
