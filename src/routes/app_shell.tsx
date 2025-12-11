import { Route, Router } from "react-router";
import Home from "./home/home.tsx";
import About from "./about/about.tsx";
import Posts from "./posts/posts.tsx";
import Post from "./post/post.tsx";
import { JSX } from "react";
import Layout from "./_layout.tsx";
import NotFound from "./_404.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { NotFoundBoundary, NotFoundShell } from "react-app";
import ServerError from "./_500.tsx";
import GlobalError from "./_global_error.tsx";
import { type AppProps } from "@/services/app.tsx";

const routes = [
  {
    pattern: new URLPattern({ pathname: "/" }),
    component: ({ context, params }) => <Home {...context} params={params} />,
  },
  {
    pattern: new URLPattern({ pathname: "/about" }),
    component: ({ context, params }) => <About {...context} params={params} />,
  },
  {
    pattern: new URLPattern({ pathname: "/posts" }),
    component: () => <Posts />,
  },
  {
    pattern: new URLPattern({ pathname: "/posts/:slug" }),
    component: ({ params, context }) => <Post {...context} params={params} />,
  },
] satisfies Route<AppProps>[];

export default function AppShell(props: AppProps): JSX.Element {
  return (
    <ErrorBoundary fallback={<GlobalError />}>
      <Layout {...props}>
        <ErrorBoundary fallback={<ServerError />}>
          <NotFoundBoundary fallback={<NotFound />}>
            <Router
              url={props.url}
              routes={routes}
              fallback={<NotFoundShell />}
              context={props}
            >
            </Router>
          </NotFoundBoundary>
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  );
}
