import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    process.env.WP_GRAPHQL_URL ||
    "https://foodfocusthailand.com/wp-cms/graphql",
  documents: ["src/**/*.ts", "src/**/*.astro"],
  ignoreNoDocuments: true,
  generates: {
    "./src/types/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
};

export default config;
