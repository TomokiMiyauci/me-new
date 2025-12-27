import { type JSX } from "react";
import resolver from "@/lib/link.ts";
import { type AppProps } from "@/lib/app.tsx";
import Entry from "@/routes/entry.ts";
import Layout from "../layout.tsx";
import language from "@/language.json" with { type: "json" };
import greet from "./greet.json" with { type: "json" };
import { BlogDocument } from "./document.ts";
import Picture from "@/fragments/picture/picture.tsx";
import client from "@/lib/apollo_client.ts";

export default async function Home(props: AppProps): Promise<JSX.Element> {
  const { lang, i18n } = props;

  const queryResult = await client.query({
    query: BlogDocument,
    variables: { lang },
  });

  if (!queryResult.data) {
    throw new Error(queryResult.error?.message);
  }

  const blog = queryResult.data.allBlog[0];
  const title = blog?.title ?? "";
  const description = blog?.description;
  const { t } = i18n;

  return (
    <Layout
      {...props}
      translations={language.languages.map((lang) => ({
        lang,
        location: resolver.resolve(Entry.Home, { lang }) ?? undefined,
      }))}
    >
      <main>
        <div className="min-h-[90vh] grid place-content-center">
          <span className="text-rotate text-6xl leading-18 md:text-9xl md:leading-40">
            <span className="justify-items-center">
              {Object.entries(greet).map(([key, message]) => {
                return <span key={key}>{message}</span>;
              })}
            </span>
          </span>
        </div>

        <section>
          <h2 className="text-center text-3xl mb-8">
            {t("category.contents")}
          </h2>

          <ul className="grid md:grid-cols-3">
            {blog && (
              <li className="md:col-2 justify-self-center">
                <a href={resolver.resolve(Entry.Posts, { lang }) ?? undefined}>
                  <div className="card bg-base-100 shadow-sm max-w-96">
                    {blog?.coverImage && <Picture fragment={blog.coverImage} />}
                    <div className="card-body">
                      <h2 className="card-title">{title}</h2>
                      <p>
                        {description}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            )}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
