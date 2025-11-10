import { defineField, defineType } from "sanity";

export default defineType({
  name: "policy",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "bodyContent" }),
    defineField({
      name: "createdAt",
      type: "datetime",
    }),
    defineField({
      name: "updatedAt",
      type: "datetime",
    }),
  ],

  preview: {
    select: { title: "title" },
  },
});
