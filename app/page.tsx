import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/PostList";
import { getArchivePage } from "@/lib/scraper/archive";
import { ScraperError } from "@/lib/scraper/errors";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  let result;
  try {
    result = await getArchivePage(page);
  } catch (err) {
    if (err instanceof ScraperError && err.kind === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">売木村の山村留学ブログ</h1>
      <PostList posts={result.items} />
      <Pagination
        currentPage={result.currentPage}
        lastPage={result.lastPage}
        basePath="/"
      />
    </div>
  );
}
