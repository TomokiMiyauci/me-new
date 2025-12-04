import { type JSX } from "react";
import resolver, { Entry } from "@/services/link.ts";
import { type AppProps } from "@/services/app.tsx";

export default function Home(props: AppProps): JSX.Element {
  const { i18n, lang } = props;
  const admin = resolver.resolve(Entry.Admin, {});
  const about = resolver.resolve(Entry.About, { lang });

  const { t } = i18n;

  return (
    <main>
      <title>{t("home.title")}</title>

      <div>
        <a href={admin ?? undefined}>Admin</a>
        <a href={about ?? undefined}>About</a>
      </div>
    </main>
  );
}
