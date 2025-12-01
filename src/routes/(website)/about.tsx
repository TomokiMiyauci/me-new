import resolver, { Entry } from "@/services/link.ts";
import { type AppProps } from "@/services/app.tsx";
import { t } from "i18next";

export default function About(props: AppProps) {
  const href = resolver.resolve(Entry.Home, { lang: props.lang });

  return (
    <main>
      <h1>About</h1>
      <a href={href ?? undefined}>{t("action.navigation.home")}</a>
    </main>
  );
}
