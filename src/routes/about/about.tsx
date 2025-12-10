import resolver from "@/services/link.ts";
import { type AppProps } from "@/services/app.tsx";
import type { JSX } from "react";
import Entry from "@/entry.ts";

export default function About(props: AppProps): JSX.Element {
  const href = resolver.resolve(Entry.Home, { lang: props.lang });
  const { t } = props.i18n;

  return (
    <main>
      <h1>About</h1>
      <a href={href ?? undefined}>{t("action.navigation.home")}</a>
    </main>
  );
}
