import {
  EnumChangefreq,
  SitemapItemLoose,
  SitemapStream,
  streamToPromise,
} from "sitemap";
import { apolloClient } from "~lib";
import language from "@/language.json" with { type: "json" };
import Entry from "@/routes/entry.ts";
import resolver from "@/lib/link.ts";
import { PostSlugsDocument } from "./document.ts";

export default async function sitemap(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const stream = new SitemapStream({
    hostname: url.origin,
    xmlns: { image: false, video: false, news: false, xhtml: false },
  });
  const asyncPathnames = getPathnames();
  const pathnames = await Array.fromAsync(asyncPathnames);

  for (const pathname of pathnames) {
    stream.write(
      {
        url: pathname,
        changefreq: EnumChangefreq.DAILY,
        priority: 0.8,
      } satisfies SitemapItemLoose,
    );
  }

  stream.end();
  const content = await streamToPromise(stream).then((buffer) => {
    return buffer.toString();
  });

  return new Response(content, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
}

async function* getPathnames(): AsyncIterable<string> {
  const pathnames = language.languages.flatMap((
    lang,
  ) => [
    resolver.resolve(Entry.Home, { lang }),
    resolver.resolve(Entry.Posts, { lang }),
    resolver.resolve(Entry.PrivacyPolicy, { lang }),
  ]).filter(isNonNullable);

  yield* pathnames;

  const queryResult = await apolloClient.query({ query: PostSlugsDocument });

  if (!queryResult.data) {
    throw new Error(queryResult.error?.message);
  }

  for (const post of queryResult.data.posts) {
    if (
      post.slug?.current && post.lang && language.languages.includes(post.lang)
    ) {
      const pathname = resolver.resolve(Entry.Post, {
        lang: post.lang,
        slug: post.slug.current,
      });

      if (pathname) yield pathname;
    }
  }
}

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
