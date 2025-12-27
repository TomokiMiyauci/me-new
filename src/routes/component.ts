import { type FunctionComponent } from "react";
import { type AppProps } from "@/lib/app.tsx";
import Entry from "./entry.ts";
import { Home, Post, Posts, PrivaryPolicy } from "@/app/manifest.tsx";

export default {
  [Entry.Home]: Home,
  [Entry.Posts]: Posts,
  [Entry.Post]: Post,
  [Entry.PrivacyPolicy]: PrivaryPolicy,
} satisfies Record<Entry, FunctionComponent<AppProps>>;
