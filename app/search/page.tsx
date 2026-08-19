import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/PostList";
import { SearchForm } from "@/components/SearchForm";
import { SortSelect } from "@/components/SortSelect";
import { recordSearchQuery, recordSortUsage } from "@/lib/analytics/record";
import { ScraperError } from "@/lib/scraper/errors";
import { parseSortOrder } from "@/lib/scraper/parseSortOrder";
import { searchPosts } from "@/lib/scraper/search";
import type { PaginatedResult, PostSummary } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const sort = parseSortOrder(params.sort);
  recordSortUsage("search", sort);

  let result: PaginatedResult<PostSummary> | null = null;
  if (query) {
    try {
      result = await searchPosts(query, page, sort);
    } catch (err) {
      if (err instanceof ScraperError && err.kind === "NOT_FOUND") {
        notFound();
      }
      throw err;
    }
    if (page === 1) recordSearchQuery(query, result.items.length);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">検索</h1>
      <SearchForm initialQuery={query} />
      {result && (
        <>
          <SortSelect currentSort={sort} basePath="/search" extraQuery={{ q: query }} />
          <PostList posts={result.items} />
          <Pagination
            currentPage={result.currentPage}
            lastPage={result.lastPage}
            basePath="/search"
            extraQuery={sort !== "newest" ? { q: query, sort } : { q: query }}
          />
        </>
      )}
    </div>
  );
}
