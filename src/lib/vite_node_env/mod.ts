import type { Plugin } from "vite";

export function nodeEnv(): Plugin {
  return {
    name: "set-node-env-production",
    config(config, { mode }) {
      if (mode === "production") {
        config.define = {
          ...config.define,
          "process.env.NODE_ENV": '"production"',
        };
      }
    },
  };
}
