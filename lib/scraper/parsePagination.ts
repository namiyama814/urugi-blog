import { parse } from "node-html-parser";
import { closeUnclosedListTag } from "./htmlQuirks";

export interface SourcePagination {
  currentPage: number;
  lastPage: number;
}

/** Reads the source site's `<nav class="navigation pagination">`, if present. */
export function parsePaginationHtml(html: string): SourcePagination {
  const root = parse(closeUnclosedListTag(html));
  const nav = root.querySelector("nav.navigation.pagination");
  if (!nav) {
    return { currentPage: 1, lastPage: 1 };
  }

  let lastPage = 1;
  let currentPage = 1;

  for (const el of nav.querySelectorAll(".page-numbers")) {
    const num = Number(el.text.trim());
    if (Number.isNaN(num)) continue;
    lastPage = Math.max(lastPage, num);
    const classes = el.getAttribute("class")?.split(/\s+/) ?? [];
    if (classes.includes("current")) currentPage = num;
  }

  return { currentPage, lastPage };
}
