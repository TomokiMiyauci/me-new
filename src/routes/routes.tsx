import { Route } from "react-router";
import { type JSX, lazy } from "react";
import { type FallbackProps } from "error-boundary";
import { isNotFoundErrorLike } from "react-app";

const Admin = lazy(() => import("@/routes/(sanity)/admin.tsx"));
const AdminLayout = lazy(() => import("@/routes/(sanity)/_layout.tsx"));
const About = lazy(() => import("@/routes/(website)/about.tsx"));
const Index = lazy(() => import("@/routes/(website)/index.tsx"));
const Layout = lazy(() => import("@/routes/(website)/_layout.tsx"));
const _NotFound = lazy(() => import("@/routes/(website)/_404.tsx"));
const _ServerError = lazy(() => import("@/routes/(website)/_500.tsx"));

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

export const NotFound = (props: FallbackProps) => (
  <Layout>
    <_NotFound {...props} />
  </Layout>
);

export const ServerError = (props: FallbackProps) => (
  <Layout>
    <_ServerError {...props}></_ServerError>
  </Layout>
);

export function Fallback(props: FallbackProps): JSX.Element {
  const { error, reset } = props;

  if (isNotFoundErrorLike(error)) {
    return <NotFound error={error} reset={reset} />;
  }

  return <ServerError error={error} reset={reset} />;
}
