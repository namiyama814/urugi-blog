import { parse } from "node-html-parser";
import { closeUnclosedListTag } from "./htmlQuirks";
import { slugFromUrl } from "./slug";
import type { PostSummary } from "./types";

/**
 * Parses a `<ul class="list">` block, shared verbatim by the archive pages and
 * WordPress's native search results (`/blog/?s=...`) since both emit identical markup.
 * An empty search result renders `<li>ブログ記事はまだありません</li>` with no `<a>` — skip those.
 */
export function parseListHtml(html: string): PostSummary[] {
  const root = parse(closeUnclosedListTag(html));
  const posts: PostSummary[] = [];

  for (const li of root.querySelectorAll("ul.list > li")) {
    const a = li.querySelector("a");
    if (!a) continue;
    const href = a.getAttribute("href");
    if (!href) continue;

    const title = a.text.trim();
    const dateMatch = li.text.match(/\((\d{2}\/\d{2}\/\d{2})\)/);

    posts.push({
      slug: slugFromUrl(href),
      url: href,
      title,
      date: dateMatch?.[1] ?? "",
    });
  }

  return posts;
}
