// Framework conventions (arbitrary choices for this demo):
// - Use `x-rsc-action` header to pass server action ID
const HEADER_ACTION_ID = "x-rsc-action";
export const RSC_MEDIA_TYPE = "text/x-component";

// Parsed request information used to route between RSC/SSR rendering and action handling.
// Created by parseRenderRequest() from incoming HTTP requests.
type RenderRequest = {
  isRsc: boolean; // true if request should return RSC payload (via _.rsc suffix)
  isAction: boolean; // true if this is a server action call (POST request)
  actionId?: string; // server action ID from x-rsc-action header
  request: Request; // normalized Request with _.rsc suffix removed from URL
  url: URL; // normalized URL with _.rsc suffix removed
};

export function createRscRenderRequest(
  urlString: string,
  action?: { id: string; body: BodyInit },
): Request {
  const headers = new Headers([["accept", RSC_MEDIA_TYPE]]);
  const method = action ? "POST" : "GET";

  if (action) headers.set(HEADER_ACTION_ID, action.id);

  return new Request(urlString, { method, headers, body: action?.body });
}

export function parseRenderRequest(request: Request): RenderRequest {
  const url = new URL(request.url);
  const isAction = request.method === "POST";
  const accept = request.headers.get("accept");

  if (accept?.includes(RSC_MEDIA_TYPE)) {
    const actionId = request.headers.get(HEADER_ACTION_ID) ?? undefined;

    if (isAction && !actionId) {
      throw new Error("Missing action id header for RSC action request");
    }

    return {
      isRsc: true,
      isAction,
      actionId,
      request: new Request(url, request),
      url,
    };
  } else {
    return { isRsc: false, isAction, request, url };
  }
}
