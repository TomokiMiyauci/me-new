import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { CONTENT_ENDPOINT } from "~env";

export default new ApolloClient({
  link: new HttpLink({ uri: CONTENT_ENDPOINT }),
  cache: new InMemoryCache(),
});
