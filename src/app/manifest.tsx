import { JSX } from "react";
import { type AppProps } from "@/lib/app.tsx";
import AboutEntry from "@/routes/about/about.tsx";
import IndexEntry from "@/routes/home/home.tsx";
import PostsEntry from "@/routes/posts//posts.tsx";
import PostEntry from "@/routes/post/post.tsx";
import LayoutEntry from "@/routes/_layout.tsx";

export function About(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <AboutEntry {...props} />
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
