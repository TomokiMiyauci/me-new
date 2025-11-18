import rsc from "@vitejs/plugin-rsc";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";
import { defineConfig, type Plugin } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { nodeEnv } from "vite-node-env";
import rscAssets from "vite-plugin-rsc-assets-manifest";
import { manifest, outDirResolve } from "vite-plugin-manifest";
import inject from "@rollup/plugin-inject";
import { viteStaticCopy } from "vite-plugin-static-copy";
import {
  type ModuleNameWithoutNodePrefix,
  nodePolyfills,
} from "vite-plugin-node-polyfills";
import { nodeScheme } from "vite-node-scheme";
import { builtinModules } from "node:module";

const buildEnvironment = {
  name: "build-env",
  buildApp: async (builder) => {
    const envs = Object.values(builder.environments);

    for (const env of envs) {
      if (!env.isBuilt) await builder.build(env);
    }
  },
} satisfies Plugin;

export default defineConfig(({ command }) => ({
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
    }),

    // use any of react plugins https://github.com/vitejs/vite-plugin-react
    // to enable client component HMR
    react(),

    // use https://github.com/antfu-collective/vite-plugin-inspect
    // to understand internal transforms required for RSC.
    // import("vite-plugin-inspect").then(m => m.default()),

    // Patch for @deno/vite-plugin
    // @deno/vite-plugin is not suported JSON module. The JSON module is used by @std/http.
    {
      name: "deno-json-patch-resolver",
      resolveId(id) {
        if (id === "./deno.json") {
          return "./deno.json";
        }
      },
    },
    deno(),
    nodeEnv(),
    nodeScheme(),
    cjsInterop({
      dependencies: [
        "prop-types",
      ],
    }),
    buildEnvironment,
    rscAssets,
    manifest,
    outDirResolve,
    {
      // This is workaround for rsc plugin constraints
      // client: {
      //       build: {
      //         rollupOptions: {
      //           plugins: [inject(...)],
      //         },
      //       },
      //     },
      name: "apply-transform-client-only",
      transform(...args) {
        if (this.environment.name === "client") {
          // deno-lint-ignore no-explicit-any
          const { transform } = (inject as any)({
            "Deno.env": "./src/framework/polyfills/deno_env.ts",
          })!;

          return transform.apply(this, args);
        }
      },
    },
    viteStaticCopy({
      targets: [
        { src: "./deno.prod.json", dest: ".", rename: "deno.json" },
      ],
    }),

    // Polyfill for global symbols like Buffer.
    nodePolyfills({
      exclude: [...builtinModules] as ModuleNameWithoutNodePrefix[],
      protocolImports: false,
    }),
  ],

  resolve: {
    alias: {
      "npm:react@^19.1.1/jsx-runtime": "react/jsx-runtime",
    },
    noExternal: true,
    // The tranform of cjs fails in dev.
    external: command === "build" ? undefined : ["readable-stream"],
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
}));
