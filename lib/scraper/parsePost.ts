import { parse } from "node-html-parser";
import { toFullWidthKatakana } from "../normalizeText";

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
  const root = parse(html);
  const entryBox = root.querySelector("article > div.entry-box");

  const h2 = entryBox?.querySelector("h2");
  const title = toFullWidthKatakana(h2?.text.trim() ?? "");
  h2?.remove();

  const date = root.querySelector("article > p.date")?.text.trim() ?? "";

  return {
    title,
    rawContentHtml: entryBox?.innerHTML ?? "",
    date,
  };
}
