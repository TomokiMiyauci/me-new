import { Cache, GraphQLClient } from "graphql-client";
import { CONTENT_ENDPOINT } from "~env";
import constants from "@/constant.json" with { type: "json" };
import { fromCache, WebCache } from "web-cache";

const cache = await caches.open(constants.CACHE_KEY);
const webCache = new WebCache(fromCache(cache));

export default new GraphQLClient(CONTENT_ENDPOINT, {
  middleware: [
    new Cache(webCache),
  ],
});
