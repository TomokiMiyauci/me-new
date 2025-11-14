import { normalizePath, type Plugin } from "vite";
import MagicString from "magic-string";
import path from "node:path";
import { stripLiteral } from "strip-literal";

export const manifest: Plugin = {
  name: "load-manifest",
  transform(code) {
    if (!code.includes("import.meta.vite.loadManifest")) return;

    const s = new MagicString(code);
    for (
      const match of stripLiteral(code).matchAll(
        /import\.meta\.vite\.loadManifest\(([\s\S]*?)\)/dg,
      )
    ) {
      const [argStart, argEnd] = match.indices![1]!;
      const argCode = code.slice(argStart, argEnd).trim();
      const environmentName = evalValue<string>(`${argCode}`);

      if (this.environment.mode !== "build") {
        throw new Error("unimplemented");
      }
      const replacement = JSON.stringify(
        `__vite_load_manifest:${this.environment.name}:${environmentName}`,
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
    if (!code.includes("__vite_load_manifest")) return;
    const environments = this.environment.getTopLevelConfig().environments;

    const s = new MagicString(code);
    for (
      const match of code.matchAll(
        /['"]__vite_load_manifest:(\w+):(\w+)['"]/dg,
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
            ".vite",
            "manifest.json",
          ),
        ),
      );
      const replacement = `(fetch(import.meta.resolve(${
        JSON.stringify(importPath)
      })).then((res) => res.json()))`;
      console.log(replacement);
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

export const outDirResolve: Plugin = {
  name: "load-manifest",
  transform(code) {
    if (!code.includes("import.meta.vite.outDir.resolve")) return;

    const s = new MagicString(code);
    for (
      const match of stripLiteral(code).matchAll(
        /import\.meta\.vite\.outDir\.resolve\(([\s\S]*?)\)/dg,
      )
    ) {
      const [argStart, argEnd] = match.indices![1]!;
      const argCode = code.slice(argStart, argEnd).trim();
      const environmentName = evalValue<string>(`${argCode}`);

      if (this.environment.mode !== "build") {
        throw new Error("unimplemented");
      }
      const replacement = JSON.stringify(
        `__vite_out_dir_resolve:${this.environment.name}:${environmentName}`,
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
    if (!code.includes("__vite_out_dir_resolve")) return;
    const environments = this.environment.getTopLevelConfig().environments;

    const s = new MagicString(code);
    for (
      const match of code.matchAll(
        /['"]__vite_out_dir_resolve:(\w+):(\w+)['"]/dg,
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
          path.join(environments[toEnv!]!.build.outDir),
        ),
      );
      const replacement = `(import.meta.resolve(${
        JSON.stringify(importPath)
      }))`;
      console.log(replacement);
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
