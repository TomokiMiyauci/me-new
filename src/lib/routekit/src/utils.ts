import type { Params, Route } from "./types.ts";

export function route<T extends Params>(arg: {
  params?: T;
  entries: {
    condition?(params: T): boolean;
    pathname(params: T): string;
  }[];
}): Route<T>;
export function route<T extends Params>(arg: {
  params?: T;
  pathname: (params: T) => string;
}): Route<T>;
export function route<T extends Params>(arg: {
  params?: T;
  pathname?: (params: T) => string;
  entries?: {
    condition?(params: T): boolean;
    pathname: (params: T) => string;
  }[];
}): Route<T> {
  const params = arg.params ?? ({} as T);

  if (arg.entries) {
    return {
      params,
      entries: arg.entries,
    };
  }

  if (arg.pathname) {
    return {
      params,
      entries: [
        { pathname: arg.pathname.bind(arg) },
      ],
    };
  }

  throw new Error("unreachable");
}
