import { GraphQLClient } from "graphql-request";
import { CONTENT_ENDPOINT } from "~env";

export default new GraphQLClient(
  CONTENT_ENDPOINT,
);
