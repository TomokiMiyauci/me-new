import { isSupported } from "@oddbird/popover-polyfill/fn";

if (!isSupported()) {
  const { apply } = await import("@oddbird/popover-polyfill/fn");

  apply();
}
