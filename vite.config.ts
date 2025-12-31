import rsc from "@vitejs/plugin-rsc";
import react from "@vitejs/plugin-react";
import { defineConfig, perEnvironmentPlugin } from "vite";
import { nodeEnv } from "vite-node-env";
import rscAssets from "vite-plugin-rsc-assets-manifest";
import { manifest, outDirResolve } from "vite-plugin-manifest";
import inject from "@rollup/plugin-inject";
import { nodeScheme } from "vite-node-scheme";
import deno from "vite-plugin-deno";
import codegen from "vite-plugin-graphql-codegen";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { port: 8000 },
  envDir: false,
  plugins: [
    rsc({
      // `entries` option is only a shorthand for specifying each `rollupOptions.input` below
      // > entries: { rsc, ssr, client },
      //
      // by default, the plugin setup request handler based on `default export` of `rsc` environment `rollupOptions.input.index`.
      // This can be disabled when setting up own server handler e.g. `@cloudflare/vite-plugin`.
      // > serverHandler: false
      serverHandler: {
        entryName: "main",
        environmentName: "rsc",
      },
      copyServerAssetsToClient: (fileName) => {
        return !fileName.endsWith(".map");
      },
    }),

    // use any of react plugins https://github.com/vitejs/vite-plugin-react
    // to enable client component HMR
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),

    // use https://github.com/antfu-collective/vite-plugin-inspect
    // to understand internal transforms required for RSC.
    // import("vite-plugin-inspect").then(m => m.default()),
    deno(),
    nodeEnv(),
    nodeScheme(),
    rscAssets,
    manifest,
    outDirResolve,
    perEnvironmentPlugin("inject", (env) => {
      if (env.name === "client") {
        // This is deno bug
        // deno-lint-ignore no-explicit-any
        return (inject as any)({
          "Deno.env": "@/framework/polyfills/deno_env.ts",
        });
      }
      return false;
    }),
    codegen({
      configFilePathOverride: "./.graphqlrc",
    }),
    tailwindcss(),
  ],
  resolve: {
    noExternal: true,
  },

  build: {
    license: true,
    assetsInlineLimit: 0,
  },
  // specify entry point for each environment.
  // (currently the plugin assumes `rollupOptions.input.index` for some features.)
  environments: {
    // `rsc` environment loads modules with `react-server` condition.
    // this environment is responsible for:
    // - RSC stream serialization (React VDOM -> RSC stream)
    // - server functions handling
    rsc: {
      build: {
        rollupOptions: {
          input: {
            main: "./src/framework/entry.server.tsx",
          },
        },
        sourcemap: true,
        outDir: "dist/server",
      },
      define: {
        // Patch for "@std/http".
        // This module contains code that includes `import.meta.main`, which causes issues when bundled.
        "import.meta.main": false,
      },
    },

    // `ssr` environment loads modules without `react-server` condition.
    // this environment is responsible for:
    // - RSC stream deserialization (RSC stream -> React VDOM)
    // - traditional SSR (React VDOM -> HTML string/stream)
    ssr: {
      build: {
        rollupOptions: {
          input: {
            index: "./src/framework/entry.ssr.tsx",
          },
        },
        sourcemap: true,
      },
    },

    // client environment is used for hydration and client-side rendering
    // this environment is responsible for:
    // - RSC stream deserialization (RSC stream -> React VDOM)
    // - traditional CSR (React VDOM -> Browser DOM tree mount/hydration)
    // - refetch and re-render RSC
    // - calling server functions
    client: {
      build: {
        rollupOptions: {
          input: {
            index: "./src/framework/entry.browser.tsx",
          },
        },
      },
    },
  },
});
