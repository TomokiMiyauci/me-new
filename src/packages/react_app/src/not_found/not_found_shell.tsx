import { notFound } from "./utils.ts";
import type { JSX } from "react";

export interface NotFoundShellProps {
  message?: string;
}

export default function NotFoundShell(props: NotFoundShellProps): JSX.Element {
  const { message } = props;
  notFound(message);
}
