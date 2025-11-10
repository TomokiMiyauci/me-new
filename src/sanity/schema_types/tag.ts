import { defineField, defineType } from "sanity";
import { displayInternationalizedArrayString } from "../utils/i18n.ts";

export default defineType({
  name: "tag",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "description",
      type: "internationalizedArrayString",
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare(selection) {
      return {
        title: displayInternationalizedArrayString(selection.title),
      };
    },
  },
});
