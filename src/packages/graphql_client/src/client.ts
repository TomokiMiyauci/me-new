import { GraphqlRequest } from "./request.ts";
import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Middleware, MiddlewareOrMiddlewareObject } from "./types.ts";

export type Variables = object;

interface Options {
  middleware: MiddlewareOrMiddlewareObject[];
}

export class GraphQLClient {
  #url: URL;
  #middleware: [...Middleware[], Middleware];
  constructor(url: URL | string, options?: Options) {
    this.#url = new URL(url);

    const externals = [...options?.middleware ?? []].map(normalizeMiddleware);
    this.#middleware = [...externals, (req) => fetch(req)];
  }

  async query<T = unknown, V extends Variables = Variables>(
    document: TypedDocumentNode<T, V>,
    variables?: V,
  ): Promise<T> {
    const raw = print(document);
    const url = new URL(this.#url);

    const request = new GraphqlRequest(url, {
      query: raw,
      variables: variables && JSON.stringify(variables),
    }, { method: "GET" });

    const response = await this.exec(request);

    if (!response.ok) {
      throw new Error();
    }

    if (response.bodyUsed) {
      throw new Error();
    }

    const json = await response.json();

    return json.data;
  }

  exec(request: Request): Promise<Response> {
    return exec(request, this.#middleware);
  }
}

function exec(
  request: Request,
  middleware: readonly Middleware[],
): Promise<Response> {
  const [first, ...rest] = middleware;

  if (!first) throw new Error();

  function next(request: Request): Promise<Response> {
    const [first, ...resta] = rest;

    if (!first) throw new Error();

    return exec(request, [first, ...resta]);
  }

  return Promise.resolve(first(request, next));
}

function normalizeMiddleware(
  middleware: MiddlewareOrMiddlewareObject,
): Middleware {
  return typeof middleware === "function"
    ? middleware
    : middleware.handle.bind(middleware);
}
