"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schema_types/mod.ts";
import { SANITY_DATASET, SANITY_ID } from "@/env.ts";
import {
  internationalizedArray,
  type Language,
} from "sanity-plugin-internationalized-array";
import { documentInternationalization } from "@sanity/document-internationalization";
import { i18n, localeMap } from "./i18n.ts";
// import { media } from "sanity-plugin-media";
import { codeInput } from "@sanity/code-input";

function toLanguages(map: Record<string, string>): Language[] {
  return Object.entries(map).map(([id, title]) => ({ id, title }));
}

const languages = toLanguages(localeMap);

export default defineConfig({
  basePath: "/admin",
  projectId: SANITY_ID,
  dataset: SANITY_DATASET,

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      languages,
      defaultLanguages: [i18n.defaultLocale],
      fieldTypes: ["string", "bodyContent"],
      buttonAddAll: false,
    }),
    documentInternationalization({
      supportedLanguages: languages,
      schemaTypes: ["post.page", "category"],
    }),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});
