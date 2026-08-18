import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  basePath: string;
  extraQuery?: Record<string, string>;
}

function buildHref(
  basePath: string,
  page: number,
  extraQuery?: Record<string, string>,
): string {
  const params = new URLSearchParams(extraQuery);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({
  currentPage,
  lastPage,
  basePath,
  extraQuery,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < lastPage ? currentPage + 1 : null;

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 py-4 dark:border-gray-800"
      aria-label="ページネーション"
    >
      {prevPage ? (
        <Link href={buildHref(basePath, prevPage, extraQuery)} className="hover:underline">
          ← 前へ
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {currentPage} / {lastPage}
      </span>
      {nextPage ? (
        <Link href={buildHref(basePath, nextPage, extraQuery)} className="hover:underline">
          次へ →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
