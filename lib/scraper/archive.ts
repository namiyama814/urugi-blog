import { CACHE_TTL_SECONDS, SOURCE_BASE_URL } from "./constants";
import { getPaginatedList } from "./pageMapping";
import type { PaginatedResult, PostSummary, SortOrder } from "./types";

function sourcePageUrl(sourcePage: number): string {
  return sourcePage <= 1
    ? `${SOURCE_BASE_URL}/`
    : `${SOURCE_BASE_URL}/page/${sourcePage}/`;
}

function cacheTtlSeconds(sourcePage: number): number {
  return sourcePage <= 1
    ? CACHE_TTL_SECONDS.archiveFirstPage
    : CACHE_TTL_SECONDS.archiveOtherPage;
}

/** ourPage is 1-indexed, OUR_PER_PAGE items per page. */
export function getArchivePage(
  ourPage: number,
  sortOrder: SortOrder = "newest",
): Promise<PaginatedResult<PostSummary>> {
  return getPaginatedList(ourPage, { sourcePageUrl, cacheTtlSeconds }, sortOrder);
}
