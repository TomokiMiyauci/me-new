export interface GraphQLParameters {
  query: string;
  variables?: string;
  extensions?: string;
  operationName?: string;
}

enum Const {
  Json = "application/json",
  ResponseJson = "application/graphql-response+json",
  Accept = "application/graphql-response+json, application/json;q=0.9",
}

export class GraphqlRequest extends Request {
  constructor(
    input: URL | string,
    params: GraphQLParameters,
    init: RequestInit = {},
  ) {
    const url = new URL(input);
    const [finalInput, finalInit] = init?.method === "GET"
      ? new NormalizerForGet().normalize(url, params, init)
      : new NormalizerPost().normalize(url, params, init);

    super(finalInput, finalInit);
  }
}

interface ParameterNormalizer {
  normalize(
    url: URL,
    params: GraphQLParameters,
    init: RequestInit,
  ): [URL, RequestInit];
}

class NormalizerForGet implements ParameterNormalizer {
  normalize(
    url: URL,
    params: GraphQLParameters,
    init: RequestInit,
  ): [URL, RequestInit] {
    const headers = new Headers(init.headers);
    headers.append("accept", Const.Accept);

    return [resolveGet(url, params), {
      ...init,
      headers,
    }];
  }
}

class NormalizerPost implements ParameterNormalizer {
  normalize(
    url: URL,
    params: GraphQLParameters,
    init: RequestInit,
  ): [URL, RequestInit] {
    const headers = new Headers(
      init.headers,
    );

    headers.append("accept", Const.Accept);
    headers.append("content-type", Const.Json);

    const body = JSON.stringify(params);

    return [url, {
      ...init,
      headers,
      body,
    }];
  }
}

function resolveGet(url: URL, params: GraphQLParameters): URL {
  const { query, operationName, extensions, variables } = params;
  const current = new URL(url);

  const searchParams = current.searchParams;
  searchParams.append("query", query);

  if (typeof operationName === "string") {
    searchParams.append("operationName", operationName);
  }
  if (typeof extensions === "string") {
    searchParams.append("extensions", extensions);
  }

  if (typeof variables === "string") {
    searchParams.append("variables", variables);
  }

  return current;
}
