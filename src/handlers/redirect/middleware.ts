import { Redirection, RedirectRule } from "router/redirection";
import { MiddlewareObject, Next } from "router";
import client from "@/lib/apollo_client.ts";
import { RedirectDocument, RedirectQuery } from "./document.ts";

export default class Redirect implements MiddlewareObject {
  async handle(request: Request, next: Next): Promise<Response> {
    const result = await client.query({ query: RedirectDocument });

    if (!result.data) {
      throw new Error(result.error?.message);
    }

    const rules = query2Rules(result.data, request.url);

    const mw = new Redirection(rules);

    return mw.handle(request, next);
  }
}

function query2Rules(query: RedirectQuery, base: URL | string): RedirectRule[] {
  function item2Rule(item: RedirectionItem): RedirectRule {
    const rule = {
      from: new URLPattern({ pathname: item.from }),
      to: new URL(item.to, base),
      status: item.permanent ? 308 : 301,
    } satisfies RedirectRule;

    return rule;
  }

  return query.allRedirect.filter(isRedirectItem).map(item2Rule);
}

type RedirectRaw = RedirectQuery["allRedirect"][number];

type RedirectionItem = {
  to: string;
  from: string;
  permanent?: boolean | null;
};

function isRedirectItem(value: RedirectRaw): value is RedirectionItem {
  return typeof value.from === "string" && typeof value.to === "string";
}
