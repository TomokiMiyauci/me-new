import { isKeyedObject } from "sanity";
import { type Value } from "sanity-plugin-internationalized-array";

export function isValue(value: unknown): value is Value {
  return isKeyedObject(value) && "value" in value;
}
