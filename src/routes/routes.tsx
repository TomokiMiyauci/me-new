import { type FunctionComponent, JSX } from "react";
import { type Route, route } from "route-kit";
import { withLang } from "route-kit/lang";
import { type AppProps } from "@/services/app.tsx";
import { i18n } from "@/language.ts";
import LayoutEntry from "./_layout.tsx";
import HomeEntry from "./home/home.tsx";
import AboutEntry from "./about/about.tsx";
import PostsEntry from "./posts/posts.tsx";
import PostEntry from "./post/post.tsx";

export enum Entry {
  About,
  Home,
  Posts,
  Post,
}

function About(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <AboutEntry {...props} />
    </LayoutEntry>
  );
}

function Home(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <HomeEntry {...props} />
    </LayoutEntry>
  );
}

function Posts(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <PostsEntry />
    </LayoutEntry>
  );
}

function Post(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <PostEntry {...props} />
    </LayoutEntry>
  );
}

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

export const components = {
  [Entry.Home]: Home,
  [Entry.About]: About,
  [Entry.Posts]: Posts,
  [Entry.Post]: Post,
} satisfies Record<Entry, FunctionComponent<AppProps>>;
