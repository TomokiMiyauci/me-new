import type { ReactNode } from "react";
import type { ReactFormState } from "react-dom/client";

export interface Action {
  id: string;
}

export interface ReturnValue {
  ok: boolean;
  data: unknown;
}

export interface RscPayload {
  // this demo renders/serializes/deserizlies entire root html element
  // but this mechanism can be changed to render/fetch different parts of components
  // based on your own route conventions.
  root: ReactNode;

  // server action return value of non-progressive enhancement case
  returnValue?: ReturnValue;
  // server action form state (e.g. useActionState) of progressive enhancement case

  formState?: ReactFormState;
}
