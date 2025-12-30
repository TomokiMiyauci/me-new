import type { JSX } from "react";
import type { AppProps } from "@/lib/app.tsx";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";

export default function Error(props: AppProps): JSX.Element {
  const { i18n, lang } = props;
  const { t } = i18n;

  return (
    <>
      <meta name="robots" content="noindex" />

      <main className="grid min-h-[90dvh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold">500</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            {t("error.unknown_error.message")}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            {t("error.unknown_error.details")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href={resolver.resolve(Entry.Home, { lang }) ?? undefined}
              className="link"
            >
              {t("action.navigation.home")}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
