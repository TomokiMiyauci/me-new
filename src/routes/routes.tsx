import { type FunctionComponent, lazy } from "react";
import { type Route, route } from "route-kit";
import { withLang } from "route-kit/lang";
import { type AppProps } from "@/services/app.tsx";
import { i18n } from "~/i18n.ts";

export enum Entry {
  About,
  Home,
  Admin,
}

const Admin = /* @__PURE__ */ lazy(() => import("@/routes/(sanity)/admin.tsx"));
const AdminLayout = /* @__PURE__ */ lazy(() =>
  import("@/routes/(sanity)/_layout.tsx")
);
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
  [Entry.Admin]: route({
    entries: [
      { pathname: () => "/admin" },

      // TODO(miuyauci) use params slug
      { pathname: () => "/admin/*" },
    ],
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
  [Entry.Admin]: (props) => (
    <AdminLayout {...props}>
      <Admin />
    </AdminLayout>
  ),
} satisfies Record<Entry, FunctionComponent<AppProps>>;
