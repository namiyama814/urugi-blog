import * as cheerio from "cheerio";
import { slugFromUrl } from "./slug";
import type { PostSummary } from "./types";

/**
 * Parses a `<ul class="list">` block, shared verbatim by the archive pages and
 * WordPress's native search results (`/blog/?s=...`) since both emit identical markup.
 * An empty search result renders `<li>ブログ記事はまだありません</li>` with no `<a>` — skip those.
 */
export function parseListHtml(html: string): PostSummary[] {
  const $ = cheerio.load(html);
  const posts: PostSummary[] = [];

  $("ul.list > li").each((_, li) => {
    const $li = $(li);
    const $a = $li.find("a").first();
    const href = $a.attr("href");
    if (!href) return;

    const title = $a.text().trim();
    const dateText = $li.clone().children("a").remove().end().text();
    const dateMatch = dateText.match(/\((\d{2}\/\d{2}\/\d{2})\)/);

    posts.push({
      slug: slugFromUrl(href),
      url: href,
      title,
      date: dateMatch?.[1] ?? "",
    });
  });

  return posts;
}
