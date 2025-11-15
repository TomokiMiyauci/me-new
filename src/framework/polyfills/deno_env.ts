import { DenoEnv } from "deno-env";
import { source } from "@/services/source.ts";

const data = JSON.parse(source.consume());

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

const env = new DenoEnv(Object.entries(data));

export default env;
