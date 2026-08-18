import * as cheerio from "cheerio";

export interface ParsedPost {
  title: string;
  rawContentHtml: string;
  date: string;
}

/**
 * Parses `<article><div class="entry-box"><h2>TITLE</h2>...content...</div>...<p class="date">YY/MM/DD</p></article>`.
 * Scoping to `article > p.date` (not the whole article text) avoids picking up
 * the unrelated "戻る" link that follows the article in the DOM.
 */
export function parsePostHtml(html: string): ParsedPost {
  const $ = cheerio.load(html);
  const entryBox = $("article > div.entry-box").first();

  const title = entryBox.find("h2").first().text().trim();
  entryBox.find("h2").first().remove();

  const date = $("article > p.date").first().text().trim();

  return {
    title,
    rawContentHtml: entryBox.html() ?? "",
    date,
  };
}
