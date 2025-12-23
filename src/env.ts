import { assert } from "@std/assert/assert";

function loadContentEndpoint(): string {
  const CONTENT_ENDPOINT = /* @__PURE__ */ Deno.env.get("CONTENT_ENDPOINT");

  assert(CONTENT_ENDPOINT, "CONTENT_ENDPOINT is not defined");

  return CONTENT_ENDPOINT;
}

function loadCspEndpoint(): string {
  const CSP_ENDPOINT = /* @__PURE__ */ Deno.env.get("CSP_ENDPOINT");

  assert(CSP_ENDPOINT, "CSP_ENDPOINT is not defined");

  return CSP_ENDPOINT;
}

export const SENTRY_DSN = /* @__PURE__ */ Deno.env.get("SENTRY_DSN");
export const SENTRY_ENV = /* @__PURE__ */ Deno.env.get("SENTRY_ENV");
export const CSP_ENDPOINT = /* @__PURE__ */ loadCspEndpoint();
export const CONTENT_ENDPOINT = /* @__PURE__ */ loadContentEndpoint();

export const PUBLIC = {
  SENTRY_ENV,
  SENTRY_DSN,
  CONTENT_ENDPOINT,
};
