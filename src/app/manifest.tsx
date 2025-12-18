import { JSX } from "react";
import { type AppProps } from "@/lib/app.tsx";
import AboutEntry from "./about/about.tsx";
import IndexEntry from "./home/home.tsx";
import PostsEntry from "./posts//posts.tsx";
import PostEntry from "./post/post.tsx";
import LayoutEntry from "./_layout.tsx";
import NotFoundEntry from "./_404.tsx";
import ServerErrorEntry from "./_500.tsx";

export function About(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <AboutEntry />
    </LayoutEntry>
  );
}

export function Home(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <IndexEntry {...props} />
    </LayoutEntry>
  );
}

export function Posts(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <PostsEntry />
    </LayoutEntry>
  );
}

export function Post(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <PostEntry {...props} />
    </LayoutEntry>
  );
}

export function NotFound(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <NotFoundEntry />
    </LayoutEntry>
  );
}

export function ServerError(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <ServerErrorEntry />
    </LayoutEntry>
  );
}
