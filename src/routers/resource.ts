import { Router } from "router";
import sitemap from "@/handlers/sitemap/handler.ts";
import robots from "@/handlers/robots/handler.ts";

export default class ResourceRouter extends Router {
  constructor() {
    super();

    this
      .get("/robots.txt", robots)
      .get("/sitemap.xml", sitemap);
  }
}
