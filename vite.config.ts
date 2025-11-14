import rsc from "@vitejs/plugin-rsc";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { nodeScheme } from "vite-node-scheme";
import { nodeEnv } from "vite-node-env";
import rscAssets from "vite-plugin-rsc-assets-manifest";
import { manifest, outDirResolve } from "vite-plugin-manifest";

export default defineConfig({
  server: { port: 8000 },
  envPrefix: "PUBLIC_",
  plugins: [
    rsc({
      // `entries` option is only a shorthand for specifying each `rollupOptions.input` below
      // > entries: { rsc, ssr, client },
      //
      // by default, the plugin setup request handler based on `default export` of `rsc` environment `rollupOptions.input.index`.
      // This can be disabled when setting up own server handler e.g. `@cloudflare/vite-plugin`.
      // > serverHandler: false
    }),

    // use any of react plugins https://github.com/vitejs/vite-plugin-react
    // to enable client component HMR
    react(),

    // use https://github.com/antfu-collective/vite-plugin-inspect
    // to understand internal transforms required for RSC.
    // import("vite-plugin-inspect").then(m => m.default()),
    deno(),
    nodeEnv(),
    cjsInterop({
      dependencies: [
        "prop-types",
      ],
    }),
    nodeScheme(),
    {
      name: "builder",
      buildApp: async (builder) => {
        const envs = Object.values(builder.environments);

        for (const env of envs) {
          if (!env.isBuilt) await builder.build(env);
        }
      },
    },
    rscAssets,
    manifest,
    outDirResolve,
  ],

  resolve: {
    alias: {
      "npm:react@^19.1.1/jsx-runtime": "react/jsx-runtime",
    },
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
            index: "./src/framework/entry.rsc.tsx",
          },
        },
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
          external: [
            "sanity",
            /^sanity\/.*$/,
          ],
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

    server: {
      build: {
        rollupOptions: {
          input: {
            main: "./src/server.ts",
          },
          "plugins": [{
            transform: (code) => {
              return code.replace(
                `Deno.args.includes("dev")`,
                JSON.stringify(false),
              );
            },
            name: "optimize-deno-args-dev",
          }],
          external: ["@std/http", "@std/path", "router"],
        },
        outDir: "dist/server",
        ssr: true,
      },
    },
  },
});
