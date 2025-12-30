// import Entry from "@/entry.ts";
import type i18n from "i18next";

export interface AppProps {
  origin: string;
  lang: string;
  // entry: Entry;
  i18n: typeof i18n;
  params: Record<string, string | undefined>;
}
