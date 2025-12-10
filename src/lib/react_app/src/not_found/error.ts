import { KEY } from "./constant.ts";

export default class NotFoundError extends Error {
  override name: string = "NotFound";

  digest = KEY;
}
