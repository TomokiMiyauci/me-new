import type { CodegenConfig } from "@graphql-codegen/cli";

export default {
  overwrite: true,
  schema:
    "https://qruzdhzp.api.sanity.io/v2023-08-01/graphql/development/default",
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
