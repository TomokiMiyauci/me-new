import type { JSX } from "react";
import { AppProps } from "@/lib/app.tsx";
import Layout from "@/app/layout.tsx";
import { PrivacyPolicyDocument } from "@/gql/graphql.ts";
import client from "~lib/graphql-request";
import { notFound } from "react-app";
import { PortableText } from "@portabletext/react";
import { languages } from "@/language.ts";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";

export default async function PrivacyPolicy(
  props: AppProps,
): Promise<JSX.Element> {
  const { lang, i18n } = props;

  const queryResult = await client.request(PrivacyPolicyDocument, { lang });
  const doc = queryResult.allLegalDocument[0];

  if (!doc) notFound();
  const { t } = i18n;

  return (
    <Layout
      {...props}
      translations={languages.map((lang) => ({
        lang,
        location: resolver.resolve(Entry.PrivacyPolicy, { lang }) ?? "",
      }))}
    >
      <main className="prose mx-auto">
        <h1>{t("document.privacy_policy")}</h1>

        <section>
          {doc.bodyRaw &&
            <PortableText value={doc.bodyRaw} />}
        </section>
      </main>
    </Layout>
  );
}
