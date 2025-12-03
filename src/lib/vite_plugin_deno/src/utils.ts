import { RequestedModuleType } from "@deno/loader";
import supports from "./supports.json" with { type: "json" };

export function isSupported(specifier: string): boolean {
  return supports.some((support) => specifier.startsWith(support));
}

const PREFIX = "deno::";

export class VirtualSpecifier {
  decode(specifier: string): string {
    if (this.isVirtual(specifier)) return specifier.slice(PREFIX.length);

    return specifier;
  }

  encode(specifier: string): string {
    return PREFIX + specifier;
  }

  isVirtual(specifier: string): boolean {
    return specifier.startsWith(PREFIX);
  }
}

export function getModuleType(
  specifier: string,
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
      if (specifier.endsWith(".json")) {
        return RequestedModuleType.Json;
      }

      return RequestedModuleType.Default;
  }
}

export function isNodeScheme(specifier: string): boolean {
  return specifier.startsWith("node:");
}

export function isFileScheme(specifier: string): boolean {
  return specifier.startsWith("file:");
}
