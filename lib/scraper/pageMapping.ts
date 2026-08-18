import { OUR_PER_PAGE } from "./constants";
import { ScraperError } from "./errors";
import { fetchHtml } from "./fetchHtml";
import { parseListHtml } from "./parseList";
import { parsePaginationHtml } from "./parsePagination";
import type { PaginatedResult, PostSummary } from "./types";

export interface SourcePageFetcher {
  /** Builds the source-site URL for 1-indexed source page `sourcePage`. */
  sourcePageUrl: (sourcePage: number) => string;
  /** Cache TTL (seconds) to use when fetching `sourcePage`. */
  cacheTtlSeconds: (sourcePage: number) => number;
}

async function fetchSourcePage(sourcePage: number, fetcher: SourcePageFetcher) {
  const html = await fetchHtml(fetcher.sourcePageUrl(sourcePage), {
    cacheTtlSeconds: fetcher.cacheTtlSeconds(sourcePage),
  });
  return {
    items: parseListHtml(html),
    pagination: parsePaginationHtml(html),
  };
}

/**
 * Maps this app's own `OUR_PER_PAGE`-sized pages onto the source site's (larger,
 * and not necessarily constant) page size, fetching only the source page(s) needed
 * to cover the requested window. Never hard-codes the source's items-per-page —
 * it's read from the live page 1 response so a source-side setting change degrades
 * gracefully instead of silently mis-paginating.
 */
export async function getPaginatedList(
  ourPage: number,
  fetcher: SourcePageFetcher,
): Promise<PaginatedResult<PostSummary>> {
  const sourcePageCache = new Map<number, PostSummary[]>();

  const first = await fetchSourcePage(1, fetcher);
  sourcePageCache.set(1, first.items);
  const sourcePerPage = first.items.length || OUR_PER_PAGE;
  const lastSourcePage = first.pagination.lastPage;

  let totalCount: number;
  if (lastSourcePage <= 1) {
    totalCount = first.items.length;
  } else {
    const last = await fetchSourcePage(lastSourcePage, fetcher);
    sourcePageCache.set(lastSourcePage, last.items);
    totalCount = (lastSourcePage - 1) * sourcePerPage + last.items.length;
  }

  const ourLastPage = Math.max(1, Math.ceil(totalCount / OUR_PER_PAGE));
  if (ourPage < 1 || ourPage > ourLastPage) {
    throw new ScraperError("NOT_FOUND", fetcher.sourcePageUrl(1));
  }

  const startIndex = (ourPage - 1) * OUR_PER_PAGE;
  const endIndex = startIndex + OUR_PER_PAGE;
  const firstSourcePage = Math.floor(startIndex / sourcePerPage) + 1;
  const lastSourcePageNeeded = Math.floor((endIndex - 1) / sourcePerPage) + 1;

  const pages: PostSummary[][] = [];
  for (let p = firstSourcePage; p <= lastSourcePageNeeded; p++) {
    if (!sourcePageCache.has(p)) {
      const page = await fetchSourcePage(p, fetcher);
      sourcePageCache.set(p, page.items);
    }
    pages.push(sourcePageCache.get(p) ?? []);
  }

  const combined = pages.flat();
  const localStart = startIndex - (firstSourcePage - 1) * sourcePerPage;
  const items = combined.slice(localStart, localStart + OUR_PER_PAGE);

  return { items, currentPage: ourPage, lastPage: ourLastPage };
}
