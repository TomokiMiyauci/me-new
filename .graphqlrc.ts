import type { CodegenConfig } from "@graphql-codegen/cli";

export default {
  overwrite: true,
  schema: "https://flrzu0ln.api.sanity.io/v2023-08-01/graphql/dev/default",
  documents: "src/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
  },
  importExtension: ".ts",
  emitLegacyCommonJSImports: false,
  config: {
    scalars: {
      Date: "string",
      DateTime: "string",
    },
  },
} satisfies CodegenConfig;
