import { defineField, defineType } from "sanity";
import { displayInternationalizedArrayString } from "../utils/i18n.ts";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
    prepare(selection): Record<string, string> {
      return {
        title: displayInternationalizedArrayString(selection.title),
      };
    },
  },
});
