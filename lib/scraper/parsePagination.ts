import * as cheerio from "cheerio";

export interface SourcePagination {
  currentPage: number;
  lastPage: number;
}

/** Reads the source site's `<nav class="navigation pagination">`, if present. */
export function parsePaginationHtml(html: string): SourcePagination {
  const $ = cheerio.load(html);
  const nav = $("nav.navigation.pagination");
  if (nav.length === 0) {
    return { currentPage: 1, lastPage: 1 };
  }

  let lastPage = 1;
  let currentPage = 1;

  nav.find(".page-numbers").each((_, el) => {
    const $el = $(el);
    const num = Number($el.text().trim());
    if (Number.isNaN(num)) return;
    lastPage = Math.max(lastPage, num);
    if ($el.hasClass("current")) currentPage = num;
  });

  return { currentPage, lastPage };
}
