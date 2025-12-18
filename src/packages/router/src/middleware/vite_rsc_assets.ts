import type { Handler, MiddlewareObject, Next } from "@/types.ts";
import { serveFile } from "@std/http/file-server";
import { isAbsolute, join } from "@std/path";

export interface RscAssetsManifestLike {
  clientReferenceDeps: Record<string, LanguageMap>;
  serverResources: Record<string, LanguageMap>;
}

export interface ViteManifest {
  [k: string]: Metadata;
}

interface Metadata {
  file: string;
  name: string;
  src?: string;
  isDynamicEntry?: boolean;
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
}

interface LanguageMap {
  js: string[];
  css: string[];
}

export class ViteRscAssets implements MiddlewareObject {
  #routes: Route[];
  constructor(
    clientManifest: ViteManifest,
    rscManifest: RscAssetsManifestLike,
    fsRoot: string,
  ) {
    if (!isAbsolute(fsRoot)) {
      throw new Error();
    }

    const rsc = {
      clients: Object.entries(rscManifest.clientReferenceDeps).flatMap((
        [_, map],
      ) => map.js.concat(map.css)),
      servers: Object.entries(rscManifest.serverResources).flatMap((
        [_, map],
      ) => map.js.concat(map.css)),
    };
    const clients = extractDeps(clientManifest).map((path) => join("/", path));
    const entries = new Set<string>(
      clients.concat(rsc.clients, rsc.servers),
    );

    function toRoutes(): Route[] {
      return entries.values().map((entry) => {
        const pattern = new URLPattern({ pathname: escapeURLPattern(entry) });
        const filePath = join(fsRoot, entry);
        function handler(request: Request): Promise<Response> {
          return serveFile(request, filePath);
        }
        const route = { pattern, handler } satisfies Route;

        return route;
      }).toArray();
    }

    this.#routes = toRoutes();
  }

  handle(
    request: Request,
    next: Next,
  ): Response | Promise<Response> {
    for (const route of this.#routes) {
      if (route.pattern.test(request.url)) {
        return route.handler(request);
      }
    }

    return next(request);
  }
}

function extractDeps(manifest: ViteManifest): string[] {
  return Object.entries(manifest).flatMap(([_, metadata]) => {
    return (metadata.css ?? []).concat(metadata.file);
  });
}

interface Route {
  pattern: URLPattern;
  handler: Handler;
}

/**
 * Escape special characters
 */
function escapeURLPattern(value: string): string {
  return value.replace(/([(){}?:])/g, "\\$1");
}
