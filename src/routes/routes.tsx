import { Route } from "app-router";
import { LocaleContext } from "app-router/locale";
import { lazy } from "react";

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

export default [
  {
    pattern: new URLPattern({ pathname: "/" }),
    component: (props) => (
      <Layout {...props}>
        <Index />
      </Layout>
    ),
  },
  {
    pattern: new URLPattern({ pathname: "/about" }),
    component: (props) => (
      <Layout {...props}>
        <About />
      </Layout>
    ),
  },
  {
    pattern: new URLPattern({ pathname: "/admin*" }),
    component: (props) => (
      <AdminLayout {...props}>
        <Admin />
      </AdminLayout>
    ),
    metadata: {
      locales: [],
    },
  },
] satisfies Route<LocaleContext, { url: URL }>[];
