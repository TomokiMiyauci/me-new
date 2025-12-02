import {
  type Loader,
  RequestedModuleType,
  ResolutionMode,
  Workspace,
} from "@deno/loader";
import type { MinimalPluginContextWithoutEnvironment, Plugin } from "vite";
import { isBuiltin } from "node:module";
import type { LoadResult, ResolveIdResult } from "rollup";

export interface DenoPluginOptions {
  /** Show debugging logs */
  debug?: boolean;
  /** Use this path to a `deno.json` instead of auto-discovering it. */
  configPath?: string;
  /** Don't transpile files when loading them */
  noTranspile?: boolean;
  /** Keep JSX as is, instead of transpiling it according to compilerOptions. */
  preserveJsx?: boolean;
}

export function denoPlugin(options: DenoPluginOptions = {}): Plugin {
  let workspace: Workspace;
  let loader: Loader;

  return {
    name: "deno",
    async configResolved(
      this: MinimalPluginContextWithoutEnvironment,
      config,
    ): Promise<void> {
      workspace = new Workspace({
        debug: options.debug,
        configPath: options.configPath,
        nodeConditions: config.resolve.conditions,
        noTranspile: options.noTranspile,
        preserveJsx: options.preserveJsx,
        platform: config.build.ssr ? "node" : "browser",
      });

      loader = await workspace.createLoader();
    },
    async resolveId(
      source,
      importer,
    ): Promise<ResolveIdResult> {
      if (isBuiltin(source)) return { id: source, external: true };

      try {
        const resolved = await loader.resolve(
          source,
          importer,
          ResolutionMode.Import,
        );
        return resolved;
      } catch {
        // Fall thought
      }
    },
    async load(id): Promise<LoadResult> {
      if (!isSupported(id)) return;

      const attributes = this.getModuleInfo(id)?.attributes ?? {};
      const moduleType = getModuleType(id, attributes);

      const res = await loader.load(id, moduleType);

      if (res.kind === "external") return;

      const code = new TextDecoder().decode(res.code);

      switch (moduleType) {
        case RequestedModuleType.Default:
        case RequestedModuleType.Json: {
          return { code };
        }
        case RequestedModuleType.Text: {
          return { code: `export default \`${code}\`;` };
        }
        case RequestedModuleType.Bytes: {
          return {
            code: `export default new TextEncoder().encode(\`${code}\`);`,
          };
        }
      }
    },
  };
}

function isSupported(id: string): boolean {
  return id.startsWith("http:") ||
    id.startsWith("https:") ||
    id.startsWith("npm:") ||
    id.startsWith("jsr:") ||
    id.startsWith("file:");
}

function getModuleType(
  file: string,
  withArgs: Record<string, string>,
): RequestedModuleType {
  switch (withArgs["type"]) {
    case "text":
      return RequestedModuleType.Text;
    case "bytes":
      return RequestedModuleType.Bytes;
    case "json":
      return RequestedModuleType.Json;
    default:
      if (file.endsWith(".json")) {
        return RequestedModuleType.Json;
      }

      return RequestedModuleType.Default;
  }
}
