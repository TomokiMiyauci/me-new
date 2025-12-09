import { type FunctionComponent, lazy } from "react";
import { type Route, route } from "route-kit";
import { withLang } from "route-kit/lang";
import { type AppProps } from "@/services/app.tsx";
import { i18n } from "@/language.ts";

export enum Entry {
  About,
  Home,
  Posts,
  Post,
}

const About = /* @__PURE__ */ lazy(() =>
  import("@/routes/(website)/about.tsx")
);
const Index = /* @__PURE__ */ lazy(() =>
  import("@/routes/(website)/index.tsx")
);
const Posts = /* @__PURE__ */ lazy(() =>
  import("@/routes/(website)/posts/index.tsx")
);

const Post = /* @__PURE__ */ lazy(() =>
  import("@/routes/(website)/posts//[slug]/index.tsx")
);
const Layout = /* @__PURE__ */ lazy(() =>
  import("@/routes/(website)/_layout.tsx")
);

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
  [Entry.Home]: (props) => (
    <Layout {...props}>
      <Index {...props} />
    </Layout>
  ),
  [Entry.About]: (props) => (
    <Layout {...props}>
      <About {...props} />
    </Layout>
  ),
  [Entry.Posts]: (props) => (
    <Layout {...props}>
      <Posts />
    </Layout>
  ),
  [Entry.Post]: (props) => (
    <Layout {...props}>
      <Post {...props} />
    </Layout>
  ),
} satisfies Record<Entry, FunctionComponent<AppProps>>;
