import template from "./robots.txt?raw";
import { format } from "@miyauci/format";

export default function robots(request: Request): Response {
  const sitemapURL = new URL("sitemap.xml", request.url);
  const contents = formatRobots(sitemapURL);

  return new Response(contents, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

function formatRobots(url: URL | string): string {
  const contents = format<"SITEMAP_URL">(template, {
    SITEMAP_URL: url.toString(),
  });

  return contents;
}
