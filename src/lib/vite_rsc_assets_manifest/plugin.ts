import { normalizePath, type Plugin } from "vite";
import MagicString from "magic-string";
import path from "node:path";
import { stripLiteral } from "strip-literal";

export const rscAssets: Plugin = {
  name: "rsc:load-assets-manifest",
  transform(code) {
    if (!code.includes("import.meta.vite.rsc.loadManifest")) return;

    const s = new MagicString(code);
    for (
      const match of stripLiteral(code).matchAll(
        /import\.meta\.vite\.rsc.\loadManifest\(([\s\S]*?)\)/dg,
      )
    ) {
      const [argStart, argEnd] = match.indices![1]!;
      const argCode = code.slice(argStart, argEnd).trim();
      const environmentName = evalValue<string>(`${argCode}`);

      if (this.environment.mode !== "build") {
        // throw new Error("unimplemented");
      }
      const replacement = JSON.stringify(
        `__vite_rsc_load_assets_manifest:${this.environment.name}:${environmentName}`,
      );

      const [start, end] = match.indices![0]!;
      s.overwrite(start, end, replacement);
    }
    if (s.hasChanged()) {
      return {
        code: s.toString(),
        map: s.generateMap({ hires: "boundary" }),
      };
    }
  },
  renderChunk(code, chunk) {
    if (!code.includes("__vite_rsc_load_assets_manifest")) return;
    const environments = this.environment.getTopLevelConfig().environments;

    const s = new MagicString(code);
    for (
      const match of code.matchAll(
        /['"]__vite_rsc_load_assets_manifest:(\w+):(\w+)['"]/dg,
      )
    ) {
      const [fromEnv, toEnv] = match.slice(1);
      const importPath = normalizeRelativePath(
        path.relative(
          path.join(
            environments[fromEnv!]!.build.outDir,
            chunk.fileName,
            "..",
          ),
          path.join(
            environments[toEnv!]!.build.outDir,
            `__vite_rsc_assets_manifest.js`,
          ),
        ),
      );
      const replacement = `(import(${
        JSON.stringify(importPath)
      }).then((mod) => mod.default))`;
      const [start, end] = match.indices![0]!;
      s.overwrite(start, end, replacement);
    }
    if (s.hasChanged()) {
      return {
        code: s.toString(),
        map: s.generateMap({ hires: "boundary" }),
      };
    }
  },
};

// deno-lint-ignore no-explicit-any
export function evalValue<T = any>(rawValue: string): T {
  const fn = new Function(`
    var console, exports, global, module, process, require
    return (\n${rawValue}\n)
  `);
  return fn();
}

export function normalizeRelativePath(s: string): string {
  s = normalizePath(s);
  return s[0] === "." ? s : "./" + s;
}
