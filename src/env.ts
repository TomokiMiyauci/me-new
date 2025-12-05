// deno-lint-ignore-file no-process-global
// @TRANSFORM_PROCESS_ENV_TO_DENO_ENV

/**
 * This module includes a special workaround. `process.env` is replaced with `Deno.env.get` during the build process.
 *
 * This is because the Sanity CLI only works with npm, so it must be defined in `process.env`, which npm can use.
 */

class AssertionError extends Error {
  /** Constructs a new instance.
   *
   * @param message The error message.
   * @param options Additional options. This argument is still unstable. It may change in the future release.
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AssertionError";
  }
}

/**
 * Make an assertion, error will be thrown if `expr` does not have truthy value.
 *
 * @example Usage
 * ```ts ignore
 * import { assert } from "@std/assert";
 *
 * assert("hello".includes("ello")); // Doesn't throw
 * assert("hello".includes("world")); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
function assert(expr: unknown, msg = ""): asserts expr {
  if (!expr) {
    throw new AssertionError(msg);
  }
}

function loadSanityId(): string {
  const SANITY_ID = /* @__PURE__ */ process.env["SANITY_ID"];

  assert(SANITY_ID, "SANITY_ID is not defined");

  return SANITY_ID;
}

function loadSanityDataset(): string {
  const SANITY_DATASET = /* @__PURE__ */ process.env["SANITY_DATASET"];

  assert(SANITY_DATASET, "SANITY_DATASET is not defined");

  return SANITY_DATASET;
}

export const SANITY_ID = /* @__PURE__ */ loadSanityId();
export const SANITY_DATASET = /* @__PURE__ */ loadSanityDataset();
export const SENTRY_DSN = /* @__PURE__ */ process.env["SENTRY_DSN"];
export const SENTRY_ENV = /* @__PURE__ */ process.env["SENTRY_ENV"];
export const CSP_ENDPOINT = /* @__PURE__ */ process.env["CSP_ENDPOINT"];

export const PUBLIC = {
  SANITY_ID,
  SANITY_DATASET,
  SENTRY_ENV,
  SENTRY_DSN,
};
