import {
  type Loader,
  RequestedModuleType,
  ResolutionMode,
  Workspace,
} from "@deno/loader";
import type { MinimalPluginContextWithoutEnvironment, Plugin } from "vite";
import { fromFileUrl, isAbsolute, toFileUrl } from "@std/path";
import type { LoadResult, ResolveIdResult } from "rollup";
import { format } from "@miyauci/format";
import {
  getModuleType,
  isFileScheme,
  isNodeScheme,
  isSupported,
  VirtualSpecifier,
} from "./utils.ts";
import template from "./template.json" with { type: "json" };

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
  const specifier = new VirtualSpecifier();

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
    /**
     * This reports resolvable IDs for Deno in the following format:
     * - deno::URL
     * - ABSOLUTE_PATH
     *
     * Reporting IDs as URLs causes the Native ESM Loader in dev environments to evaluate the `https:` scheme before the load function, resulting in failure.
     * Therefore, we prefix the URL format with `deno::`.
     *
     * Additionally, File URLs are not recognized as local files and cause issues in the dev environment. Therefore, file URLs are reported as ABSOLUTE_PATH.
     */
    async resolveId(
      source,
      importer,
    ): Promise<ResolveIdResult> {
      importer = importer && specifier.decode(importer);

      try {
        const resolved = await loader.resolve(
          source,
          importer,
          ResolutionMode.Import,
        );

        // Loader returns values even for schemes not supported by Deno, such as `virtual:`, so it must be checked.
        if (!isSupported(resolved)) return;

        if (isNodeScheme(resolved)) {
          return { id: source, external: true };
        }

        if (isFileScheme(resolved)) {
          const file = fromFileUrl(resolved);

          return file;
        }

        return specifier.encode(resolved);
      } catch {
        // Because import map resolution exists, the resolution targets cannot be determined in advance.
        // Therefore, we must attempt resolution even for unnecessary targets.
      }
    },
    async load(id): Promise<LoadResult> {
      const attributes = this.getModuleInfo(id)?.attributes ?? {};

      if (isAbsolute(id)) {
        const url = toFileUrl(id);

        id = url.toString();
      } else if (specifier.isVirtual(id)) {
        id = specifier.decode(id);
      } else {
        return;
      }

      const moduleType = getModuleType(id, attributes);

      const res = await loader.load(id, moduleType);

      if (res.kind === "external") return;

      const decoded = new TextDecoder().decode(res.code);

      switch (moduleType) {
        case RequestedModuleType.Default:
        case RequestedModuleType.Json: {
          return { code: decoded };
        }
        case RequestedModuleType.Text: {
          const code = format(template.TEXT_MODULE, {
            source: decoded,
          });

          return { code };
        }
        case RequestedModuleType.Bytes: {
          const code = format(template.BYTES_MODULE, {
            source: decoded,
          });

          return { code };
        }
      }
    },
  };
}
