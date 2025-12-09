import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://flrzu0ln.api.sanity.io/v2023-08-01/graphql/dev/default",
  documents: "src/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
    "src/": {
      preset: "near-operation-file",
      presetConfig: { baseTypesPath: "gql/graphql.ts" },
    },
  },
  importExtension: ".ts",
  emitLegacyCommonJSImports: false,
};

export default config;
