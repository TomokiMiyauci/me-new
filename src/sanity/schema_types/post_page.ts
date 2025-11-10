import { defineField, defineType } from "sanity";
import slugify from "github-slugid";

enum Group {
  Congig = "config",
  Content = "content",
}

const postPage = defineType({
  name: "post.page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "post.title",
        slugify: (input) => {
          return slugify(input);
        },
      },
      group: Group.Congig,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "post",
      type: "post",
      validation: (rule) => rule.required(),
      group: Group.Content,
    }),
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  groups: [
    {
      default: true,
      name: Group.Content,
    },
    {
      name: Group.Congig,
    },
  ],
  preview: {
    select: {
      title: "post.title",
      subtitle: "slug.current",
    },
  },
});

export default postPage;
