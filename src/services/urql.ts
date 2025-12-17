import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { CONTENT_ENDPOINT } from "~env";

export default new Client({
  url: CONTENT_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});
