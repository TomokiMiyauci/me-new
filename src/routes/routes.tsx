import { Route } from "react-router";
import { lazy } from "react";

const Admin = lazy(() => import("@/routes/(sanity)/admin.tsx"));
const AdminLayout = lazy(() => import("@/routes/(sanity)/_layout.tsx"));
const About = lazy(() => import("@/routes/(website)/about.tsx"));
const Index = lazy(() => import("@/routes/(website)/index.tsx"));
const Layout = lazy(() => import("@/routes/(website)/_layout.tsx"));
const _NotFound = lazy(() => import("@/routes/(website)/_404.tsx"));

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

interface NotFoundProps {
  onRender?: VoidFunction;
}

export const NotFound = (props: NotFoundProps) => {
  props.onRender?.();

  return (
    <Layout>
      <_NotFound />
    </Layout>
  );
};
