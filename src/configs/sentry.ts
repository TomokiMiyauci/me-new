import { type Options } from "@sentry/core";
import { SENTRY_DSN, SENTRY_ENV } from "~env";

export default {
  dsn: SENTRY_DSN,
  environment: SENTRY_ENV,
} satisfies Options;
