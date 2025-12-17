export type Params = Record<string, string>;

export interface PathnameEntry<T = Params> {
  pathname(params: T): string;
  condition?(params: T): boolean;
}

export interface Route<T extends Params = Params> {
  params: T;
  entries: PathnameEntry<T>[];
}
