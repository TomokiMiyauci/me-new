export const SANITY_ID = /* @__PURE__ */ Deno.env.get("SANITY_ID");
export const SANITY_DATASET = /* @__PURE__ */ Deno.env.get("SANITY_DATASET");
export const SENTRY_DSN = /* @__PURE__ */ Deno.env.get("SENTRY_DSN");
export const SENTRY_ENV = /* @__PURE__ */ Deno.env.get("SENTRY_ENV");

export const PUBLIC = {
  SANITY_ID,
  SANITY_DATASET,
  SENTRY_ENV,
  SENTRY_DSN,
};
