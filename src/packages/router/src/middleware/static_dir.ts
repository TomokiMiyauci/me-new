import type { MiddlewareObject, Next } from "../types.ts";
import { serveFile } from "@std/http/unstable-file-server";
import { relative } from "@std/path/relative";
import { resolve } from "@std/path/resolve";
import { walk } from "@std/fs/walk";

export default class StaticDir implements MiddlewareObject {
  #rootDir: string;
  #promise?: Promise<Map<string, string>>;

  constructor(rootDir: string) {
    this.#rootDir = rootDir;
  }

  async #setup(): Promise<Map<string, string>> {
    if (!this.#promise) {
      this.#promise = this.#scan();
    }

    return await this.#promise;
  }

  get ready(): Promise<void> {
    return this.#setup().then(noop);
  }

  async #scan(): Promise<Map<string, string>> {
    const iterator = walk(this.#rootDir, {
      includeFiles: true,
      includeDirs: false,
      includeSymlinks: false,
    });

    const entries = await Array.fromAsync(iterator);
    const filePaths = entries
      .filter((entry) => entry.isFile)
      .map((entry) => entry.path);

    const map = new Map<string, string>();

    for (const filePath of filePaths) {
      const key = toKey(filePath, this.#rootDir);

      map.set(key, filePath);
    }

    return map;
  }

  async handle(request: Request, next: Next): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const map = await this.#setup();
    const fsPath = map.get(pathname);

    if (fsPath) {
      return serveFile(request, fsPath);
    }

    return next(request);
  }
}

function toKey(filePath: string, root: string): string {
  const relativePath = relative(root, filePath);
  const resolved = resolve("/", relativePath);

  return resolved;
}

function noop(): void {}
