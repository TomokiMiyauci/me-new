import { DenoEnv } from "deno-env";
import { source } from "@/lib/source.ts";

const data = /* /@__PURE__/ */ JSON.parse(source.consume());

function assertFlatObject(
  input: unknown,
): asserts input is Record<string, string> {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid data");
  }

  for (const value of Object.values(input)) {
    if (typeof value !== "string") {
      throw new Error("Invalid data");
    }
  }
}

assertFlatObject(data);

const env = /* /@__PURE__/ */ new DenoEnv(Object.entries(data));

export default env;
