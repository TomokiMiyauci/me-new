import { type Route, route } from "route-kit";
import { withLang } from "route-kit/lang";
import { i18n } from "@/language.ts";
import Entry from "./entry.ts";

export default {
  [Entry.About]: withLang(
    route({
      pathname: () => "/about",
    }),
    i18n,
  ),

  [Entry.Home]: withLang(
    route({
      pathname: () => "/",
    }),
    i18n,
  ),
  [Entry.Posts]: withLang(
    route({
      pathname: () => "/posts",
    }),
    i18n,
  ),
  [Entry.Post]: route({
    params: {
      slug: "required",
    },
    pathname: ({ slug }) => `/posts/${slug}`,
  }),
} satisfies Record<Entry, Route>;
