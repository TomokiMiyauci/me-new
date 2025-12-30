import { JSX } from "react";
import { type AppProps } from "@/lib/app.tsx";
import IndexEntry from "./home/home.tsx";
import PostsEntry from "./posts//posts.tsx";
import PostEntry from "./post/post.tsx";
import LayoutEntry from "./layout.tsx";
import NotFoundEntry from "./not_found/not_found.tsx";
import ErrorEntry from "./error/error.tsx";
import PrivacyPolicyEntry from "./privacy_policy/privacy_policy.tsx";

export const Home = IndexEntry;

export const Posts = PostsEntry;

export const Post = PostEntry;

export const PrivacyPolicy = PrivacyPolicyEntry;

export function NotFound(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <NotFoundEntry {...props} />
    </LayoutEntry>
  );
}

export function Error(props: AppProps): JSX.Element {
  return (
    <LayoutEntry {...props}>
      <ErrorEntry {...props} />
    </LayoutEntry>
  );
}
