import { type FunctionComponent } from "react";
import { type AppProps } from "@/services/app.tsx";
import Entry from "@/entry.ts";
import { About, Home, Post, Posts } from "@/routes/manifest.tsx";

export default {
  [Entry.Home]: Home,
  [Entry.About]: About,
  [Entry.Posts]: Posts,
  [Entry.Post]: Post,
} satisfies Record<Entry, FunctionComponent<AppProps>>;
