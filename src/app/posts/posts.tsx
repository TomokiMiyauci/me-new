// TODO(miyauci): use ./query.ts but lint error occurs
import {
  ArticlesByLangDocument,
  BlogByLangDocument,
} from "@/app/posts/document.ts";
import ArticleFragment from "@/components/article/article.tsx";
import client from "~lib/graphql-client";
import type { JSX } from "react";
import resolver from "@/lib/link.ts";
import Entry from "@/routes/entry.ts";
import { AppProps } from "@/lib/app.tsx";
import language from "@/language.json" with { type: "json" };
import Layout from "@/app/layout.tsx";

export default async function Posts(props: AppProps): Promise<JSX.Element> {
  const { lang } = props;
  const [result, blog] = await Promise.all([
    client.query(ArticlesByLangDocument, { lang }),
    client.query(BlogByLangDocument, { lang }),
  ]);

  const title = blog.blogs[0]?.title;
  const description = blog.blogs[0]?.description;
  return (
    <Layout
      {...props}
      translations={language.languages.map((lang) => ({
        lang,
        location: resolver.resolve(Entry.Posts, { lang }) ?? undefined,
      }))}
    >
      <main className="mt-4 mb-32 sm:mt-24">
        <section className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-lg/8">
            {description}
          </p>
        </section>

        <section>
          <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {result.articles.map((article) => {
              const slug = article.slug?.current ?? "";
              const href = resolver.resolve(Entry.Post, { slug, lang });

              return (
                <li key={article.key}>
                  <a href={href ?? undefined}>
                    <ArticleFragment lang={lang} fragment={article} />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
