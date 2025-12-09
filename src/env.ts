import { assert } from "@std/assert/assert";

function loadSanityId(): string {
  const SANITY_ID = /* @__PURE__ */ Deno.env.get("SANITY_ID");

  assert(SANITY_ID, "SANITY_ID is not defined");

  return SANITY_ID;
}

function loadSanityDataset(): string {
  const SANITY_DATASET = /* @__PURE__ */ Deno.env.get("SANITY_DATASET");

  assert(SANITY_DATASET, "SANITY_DATASET is not defined");

  return SANITY_DATASET;
}

function loadContentEndpoint(): string {
  const CONTENT_ENDPOINT = /* @__PURE__ */ Deno.env.get("CONTENT_ENDPOINT");

  assert(CONTENT_ENDPOINT, "CONTENT_ENDPOINT is not defined");

  return CONTENT_ENDPOINT;
}

export const SANITY_ID = /* @__PURE__ */ loadSanityId();
export const SANITY_DATASET = /* @__PURE__ */ loadSanityDataset();
export const SENTRY_DSN = /* @__PURE__ */ Deno.env.get("SENTRY_DSN");
export const SENTRY_ENV = /* @__PURE__ */ Deno.env.get("SENTRY_ENV");
export const CSP_ENDPOINT = /* @__PURE__ */ Deno.env.get("CSP_ENDPOINT");
export const CONTENT_ENDPOINT = /* @__PURE__ */ loadContentEndpoint();

export const PUBLIC = {
  SANITY_ID,
  SANITY_DATASET,
  SENTRY_ENV,
  SENTRY_DSN,
  CONTENT_ENDPOINT,
};
