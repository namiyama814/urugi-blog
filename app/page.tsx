import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/PostList";
import { SortSelect } from "@/components/SortSelect";
import { recordSortUsage } from "@/lib/analytics/record";
import { getArchivePage } from "@/lib/scraper/archive";
import { ScraperError } from "@/lib/scraper/errors";
import { parseSortOrder } from "@/lib/scraper/parseSortOrder";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const sort = parseSortOrder(params.sort);
  recordSortUsage("home", sort);

  let result;
  try {
    result = await getArchivePage(page, sort);
  } catch (err) {
    if (err instanceof ScraperError && err.kind === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <SortSelect currentSort={sort} basePath="/" />
      <PostList posts={result.items} />
      <Pagination
        currentPage={result.currentPage}
        lastPage={result.lastPage}
        basePath="/"
        extraQuery={sort !== "newest" ? { sort } : undefined}
      />
    </div>
  );
}
