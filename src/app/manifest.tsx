import { JSX } from "react";
import { type AppProps } from "@/lib/app.tsx";
import IndexEntry from "./home/home.tsx";
import PostsEntry from "./posts//posts.tsx";
import PostEntry from "./post/post.tsx";
import LayoutEntry from "./layout.tsx";
import NotFoundEntry from "./not_found/not_found.tsx";
import ErrorEntry from "./error/error.tsx";
import PrivacyPolicyEntry from "./privacy_policy/privacy_policy.tsx";
import Html from "./html.tsx";

export function Home(props: AppProps): JSX.Element {
  return (
    <Html {...props}>
      <IndexEntry {...props} />
    </Html>
  );
}

export function Posts(props: AppProps): JSX.Element {
  return (
    <Html {...props}>
      <PostsEntry {...props} />
    </Html>
  );
}

export function Post(props: AppProps): JSX.Element {
  return (
    <Html {...props}>
      <PostEntry {...props} />
    </Html>
  );
}

export function PrivacyPolicy(props: AppProps): JSX.Element {
  return (
    <Html {...props}>
      <PrivacyPolicyEntry {...props} />
    </Html>
  );
}

export function NotFound(props: AppProps): JSX.Element {
  return (
    <Html {...props}>
      <LayoutEntry {...props}>
        <NotFoundEntry {...props} />
      </LayoutEntry>
    </Html>
  );
}

export function Error(props: AppProps): JSX.Element {
  return (
    <Html {...props}>
      <LayoutEntry {...props}>
        <ErrorEntry {...props} />
      </LayoutEntry>
    </Html>
  );
}
