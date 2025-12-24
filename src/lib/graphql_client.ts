import { GraphQLClient, WebCache } from "graphql-client";
import { CONTENT_ENDPOINT } from "~env";
import constants from "@/constant.json" with { type: "json" };

const cache = await caches.open(constants.CACHE_KEY);

export default new GraphQLClient(CONTENT_ENDPOINT, {
  middleware: [
    new WebCache(cache),
  ],
});
