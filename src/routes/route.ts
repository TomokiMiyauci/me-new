import { type Route, route } from "route-kit";
import { withLang } from "route-kit/lang";
import language from "@/language.json" with { type: "json" };
import Entry from "./entry.ts";

export default {
  [Entry.Home]: withLang(
    route({
      pathname: () => "/",
    }),
    language,
  ),
  [Entry.Posts]: withLang(
    route({
      pathname: () => "/posts",
    }),
    language,
  ),
  [Entry.Post]: withLang(
    route({
      params: {
        slug: "required",
      },
      pathname: ({ slug }) => `/posts/${slug}`,
    }),
    language,
  ),
  [Entry.PrivacyPolicy]: withLang(
    route(
      { pathname: () => `/privacy-policy` },
    ),
    language,
  ),
} satisfies Record<Entry, Route>;
