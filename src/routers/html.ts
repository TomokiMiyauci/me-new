import { Router } from "router";
import { dynamic } from "router/middleware";
import { Csp, type NonceContext, NonceProvider } from "router/csp";
import mastache from "mustache";
import cspTemplate from "../csp.mustache?raw";
import { CSP_ENDPOINT } from "~env";
import language from "@/language.json" with { type: "json" };

const csp = dynamic<NonceContext>((_, { nonce }) => {
  const manifest = mastache.render(cspTemplate, {
    nonce,
    endpoint: CSP_ENDPOINT ?? "",
  });

  return new Csp(manifest);
});

export default new Router<NonceContext>()
  .use({
    // TODO
    handle(req, next): Promise<Response> | Response {
      const url = new URL(req.url);

      const prefixies = language.languages.map((lang) => "/" + lang);

      if (!prefixies.some((prefix) => url.pathname.startsWith(prefix))) {
        const fallback = "/" + language.default + url.pathname;
        const newURL = new URL(fallback, url);

        newURL.search = url.search;

        return Response.redirect(newURL);
      }

      return next(req);
    },
  })
  .use(new NonceProvider())
  .use(csp);
