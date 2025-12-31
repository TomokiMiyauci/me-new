import { type MiddlewareObject, Router } from "router";
import { dynamic } from "router/middleware";
import { Csp, type NonceContext, NonceProvider } from "router/csp";
import mastache from "mustache";
import cspTemplate from "../csp.mustache?raw";
import { CSP_ENDPOINT } from "~env";
import language from "@/language.json" with { type: "json" };
import appHandler, { type HanderContext } from "@/handlers/app.tsx";

class App implements MiddlewareObject<NonceContext> {
  constructor(
    public bootstrapScriptContent: string,
    public renderHtmlStream: HanderContext["renderHtmlStream"],
  ) {
  }

  handle(
    request: Request,
    ctx: Partial<NonceContext>,
  ): Response | Promise<Response> {
    const context = {
      nonce: ctx.nonce,
      bootstrapScriptContent: this.bootstrapScriptContent,
      renderHtmlStream: this.renderHtmlStream,
      noJs: import.meta.env.DEV,
    } satisfies HanderContext;

    return appHandler(request, context);
  }
}

const csp = dynamic<NonceContext>((_, { nonce }) => {
  const manifest = mastache.render(cspTemplate, {
    nonce,
    endpoint: CSP_ENDPOINT ?? "",
  });

  return new Csp(manifest);
});

export default class HtmlRouter extends Router<NonceContext> {
  constructor(
    bootstrapScriptContent: string,
    render: HanderContext["renderHtmlStream"],
  ) {
    super();

    this
      .use({
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
      .use(csp)
      .use(new App(bootstrapScriptContent, render));
  }
}
