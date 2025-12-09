import { GraphQLClient } from "graphql-request";
import { CONTENT_ENDPOINT } from "@/env.ts";

export default new GraphQLClient(
  CONTENT_ENDPOINT,
);
