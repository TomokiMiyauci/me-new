import type { Plugin } from "vite";
import { isBuiltin } from "node:module";

export function nodeScheme(): Plugin {
  return {
    name: "vite-plugin-node-builtin-scheme",
    enforce: "pre",

    resolveId(source) {
      if (isBuiltin(source)) {
        if (!source.startsWith("node:")) {
          return { id: `node:${source}`, external: true };
        }
      }
    },
  };
}
