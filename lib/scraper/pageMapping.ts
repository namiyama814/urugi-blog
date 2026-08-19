import { OUR_PER_PAGE } from "./constants";
import { ScraperError } from "./errors";
import { fetchHtml } from "./fetchHtml";
import { parseListHtml } from "./parseList";
import { parsePaginationHtml } from "./parsePagination";
import { currentSchoolYearStart, parseSourceDate } from "./schoolYear";
import type { PaginatedResult, PostSummary, SortOrder } from "./types";

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

interface TotalCountInfo {
  totalCount: number;
  sourcePerPage: number;
  lastSourcePage: number;
  sourcePageCache: Map<number, PostSummary[]>;
}

async function fetchTotalCount(fetcher: SourcePageFetcher): Promise<TotalCountInfo> {
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

  return { totalCount, sourcePerPage, lastSourcePage, sourcePageCache };
}

/** Fetches absolute (newest-first, 0-indexed) items `[startIndex, endIndex)`, using/populating `sourcePageCache`. */
async function fetchAbsoluteRange(
  fetcher: SourcePageFetcher,
  sourcePageCache: Map<number, PostSummary[]>,
  sourcePerPage: number,
  startIndex: number,
  endIndex: number,
): Promise<PostSummary[]> {
  if (endIndex <= startIndex) return [];

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
  return combined.slice(localStart, localStart + (endIndex - startIndex));
}

async function getNewestOrOldestPage(
  ourPage: number,
  fetcher: SourcePageFetcher,
  sortOrder: "newest" | "oldest",
): Promise<PaginatedResult<PostSummary>> {
  const { totalCount, sourcePerPage, sourcePageCache } = await fetchTotalCount(fetcher);

  const ourLastPage = Math.max(1, Math.ceil(totalCount / OUR_PER_PAGE));
  if (ourPage < 1 || ourPage > ourLastPage) {
    throw new ScraperError("NOT_FOUND", fetcher.sourcePageUrl(1));
  }

  let startIndex: number;
  let endIndex: number;
  if (sortOrder === "newest") {
    startIndex = (ourPage - 1) * OUR_PER_PAGE;
    endIndex = startIndex + OUR_PER_PAGE;
  } else {
    const startFromOldest = (ourPage - 1) * OUR_PER_PAGE;
    const endFromOldest = startFromOldest + OUR_PER_PAGE;
    startIndex = Math.max(0, totalCount - endFromOldest);
    endIndex = totalCount - startFromOldest;
  }
  endIndex = Math.min(endIndex, totalCount);

  const items = await fetchAbsoluteRange(
    fetcher,
    sourcePageCache,
    sourcePerPage,
    startIndex,
    endIndex,
  );
  if (sortOrder === "oldest") items.reverse();

  return { items, currentPage: ourPage, lastPage: ourLastPage };
}

/**
 * Scans source pages (newest first) from the start, keeping only posts within the
 * current school year (Apr 1 - present), and stops once it reaches an older post -
 * since the source lists posts newest-first, everything after that is out of range too.
 */
async function getSchoolYearPage(
  ourPage: number,
  fetcher: SourcePageFetcher,
): Promise<PaginatedResult<PostSummary>> {
  const schoolYearStart = currentSchoolYearStart();
  const matched: PostSummary[] = [];

  let sourcePage = 1;
  let lastSourcePage = 1;
  do {
    const page = await fetchSourcePage(sourcePage, fetcher);
    if (sourcePage === 1) lastSourcePage = page.pagination.lastPage;

    let hitOlderPost = false;
    for (const item of page.items) {
      const date = parseSourceDate(item.date);
      if (date && date < schoolYearStart) {
        hitOlderPost = true;
        break;
      }
      matched.push(item);
    }
    if (hitOlderPost) break;

    sourcePage++;
  } while (sourcePage <= lastSourcePage);

  const ourLastPage = Math.max(1, Math.ceil(matched.length / OUR_PER_PAGE));
  if (ourPage < 1 || (matched.length > 0 && ourPage > ourLastPage)) {
    throw new ScraperError("NOT_FOUND", fetcher.sourcePageUrl(1));
  }

  const startIndex = (ourPage - 1) * OUR_PER_PAGE;
  const items = matched.slice(startIndex, startIndex + OUR_PER_PAGE);

  return { items, currentPage: ourPage, lastPage: ourLastPage };
}

/**
 * Maps this app's own `OUR_PER_PAGE`-sized pages onto the source site's (larger,
 * and not necessarily constant) page size, fetching only the source page(s) needed
 * to cover the requested window. Never hard-codes the source's items-per-page —
 * it's read from the live page 1 response so a source-side setting change degrades
 * gracefully instead of silently mis-paginating.
 */
export function getPaginatedList(
  ourPage: number,
  fetcher: SourcePageFetcher,
  sortOrder: SortOrder = "newest",
): Promise<PaginatedResult<PostSummary>> {
  if (sortOrder === "schoolyear") return getSchoolYearPage(ourPage, fetcher);
  return getNewestOrOldestPage(ourPage, fetcher, sortOrder);
}
