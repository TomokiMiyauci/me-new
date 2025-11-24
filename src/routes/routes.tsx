import { Route } from "react-router";
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
    component: (
      <Layout>
        <Index />
      </Layout>
    ),
  },
  {
    pattern: new URLPattern({ pathname: "/about" }),
    component: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    pattern: new URLPattern({ pathname: "/admin*" }),
    component: (
      <AdminLayout>
        <Admin />
      </AdminLayout>
    ),
  },
] satisfies Route[];
