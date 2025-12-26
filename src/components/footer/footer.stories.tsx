import type { Meta } from "@storybook/react-vite";

import Footer from "./footer.tsx";

const meta = {
  component: Footer,
  tags: ["autodocs"],
  args: {
    logo: "Logo",
    copyright: "2025 Test Company",
    navigation: [
      {
        name: "Test",
        items: [
          {
            name: "Test Nav1",
            location: "#test1",
          },
          {
            name: "Test Nav2",
            location: "#test2",
          },
          {
            name: "Test Nav3",
            location: "#test3",
          },
        ],
      },
      {
        name: "Test2",
        items: [
          {
            name: "Test Nav1",
            location: "#test1",
          },
          {
            name: "Test Nav2",
            location: "#test2",
          },
          {
            name: "Test Nav3",
            location: "#test3",
          },
        ],
      },
      {
        name: "Test3",
        items: [
          {
            name: "Test Nav1",
            location: "#test1",
          },
          {
            name: "Test Nav2",
            location: "#test2",
          },
          {
            name: "Test Nav3",
            location: "#test3",
          },
        ],
      },
    ],
  },
} satisfies Meta<typeof Footer>;

export default meta;

export const Basic = {};
