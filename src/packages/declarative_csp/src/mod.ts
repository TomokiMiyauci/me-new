import { format } from "@miyauci/format";

type Injectable = "nonce" | "endpoint";

interface InjectValue extends Record<Injectable, string> {}

export class DeclarativeCsp {
  #raw: string;
  constructor(json: Record<string, string>) {
    this.#raw = toRaw(json);
  }

  format(value: InjectValue): string {
    return format<Injectable>(this.#raw, value);
  }
}

function toRaw(value: Record<string, string>): string {
  return Object.entries(value).map(([key, value]) => key + " " + value + ";")
    .join("");
}
