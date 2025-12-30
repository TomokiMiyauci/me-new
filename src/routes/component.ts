import { type FunctionComponent } from "react";
import { type AppProps } from "@/lib/app.tsx";
import Entry from "./entry.ts";
import { Home, Post, Posts, PrivacyPolicy } from "@/pages/manifest.tsx";

export default {
  [Entry.Home]: Home,
  [Entry.Posts]: Posts,
  [Entry.Post]: Post,
  [Entry.PrivacyPolicy]: PrivacyPolicy,
} satisfies Record<Entry, FunctionComponent<AppProps>>;
