import { Router } from "router";
import { TrailingSlash } from "router/trailing-slash";
import Redirect from "@/handlers/redirect/middleware.ts";

export default class BaseRouter extends Router {
  constructor() {
    super();

    this
      .use(new TrailingSlash("never"))
      .use(new Redirect());
  }
}
