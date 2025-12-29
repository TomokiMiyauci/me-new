import { Router } from "router";
import { TrailingSlash } from "router/trailing-slash";
import Redirect from "@/handlers/redirect/middleware.ts";

export default new Router()
  .use(new TrailingSlash("never"))
  .use(new Redirect());
