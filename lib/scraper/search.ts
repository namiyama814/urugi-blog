import { CACHE_TTL_SECONDS, SOURCE_BASE_URL } from "./constants";
import { getPaginatedList } from "./pageMapping";
import type { PaginatedResult, PostSummary, SortOrder } from "./types";

function buildSourcePageUrl(query: string) {
  return (sourcePage: number): string => {
    const qs = `s=${encodeURIComponent(query)}`;
    return sourcePage <= 1
      ? `${SOURCE_BASE_URL}/?${qs}`
      : `${SOURCE_BASE_URL}/page/${sourcePage}/?${qs}`;
  };
}

export function searchPosts(
  query: string,
  ourPage: number,
  sortOrder: SortOrder = "newest",
): Promise<PaginatedResult<PostSummary>> {
  return getPaginatedList(
    ourPage,
    {
      sourcePageUrl: buildSourcePageUrl(query),
      cacheTtlSeconds: () => CACHE_TTL_SECONDS.search,
    },
    sortOrder,
  );
}
