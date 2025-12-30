import { type MiddlewareObject, Router } from "router";
import { dynamic } from "router/middleware";
import { Csp, type NonceContext, NonceProvider } from "router/csp";
import mastache from "mustache";
import cspTemplate from "../csp.mustache?raw";
import { CSP_ENDPOINT } from "~env";
import { Redirection } from "router/redirection";
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
    endpoint: CSP_ENDPOINT,
  });

  return new Csp(manifest);
});

export default class HtmlRouter extends Router<NonceContext> {
  constructor(
    bootstrapScriptContent: string,
    render: HanderContext["renderHtmlStream"],
  ) {
    super();

    this.use(dynamic<NonceContext>(({ url }) =>
      new Redirection([{
        from: new URLPattern({ pathname: "/" }),
        to: new URL("/" + language.default, url),
        status: 302,
      }])
    ))
      .use(new NonceProvider())
      .use(csp)
      .use(new App(bootstrapScriptContent, render));
  }
}
