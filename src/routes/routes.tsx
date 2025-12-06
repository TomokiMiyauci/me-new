import { type FunctionComponent, lazy } from "react";
import { type Route, route } from "route-kit";
import { withLang } from "route-kit/lang";
import { type AppProps } from "@/services/app.tsx";
import { i18n } from "@/language.ts";

export enum Entry {
  About,
  Home,
}

const About = /* @__PURE__ */ lazy(() =>
  import("@/routes/(website)/about.tsx")
);
const Index = /* @__PURE__ */ lazy(() =>
  import("@/routes/(website)/index.tsx")
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
} satisfies Record<Entry, FunctionComponent<AppProps>>;
