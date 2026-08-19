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

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

function PageNumberLink({
  page,
  href,
}: {
  page: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm text-foreground/70 hover:bg-foreground/10"
    >
      {page}
    </Link>
  );
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
      className="flex items-center justify-center gap-1 py-6"
      aria-label="ページネーション"
    >
      {prevPage ? (
        <Link
          href={buildHref(basePath, prevPage, extraQuery)}
          aria-label="前のページ"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-foreground/10"
        >
          <ChevronIcon direction="left" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center text-foreground/20">
          <ChevronIcon direction="left" />
        </span>
      )}

      {prevPage && (
        <PageNumberLink page={prevPage} href={buildHref(basePath, prevPage, extraQuery)} />
      )}

      <form method="get" action={basePath} className="contents">
        {Object.entries(extraQuery ?? {}).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <input
          key={currentPage}
          type="number"
          name="page"
          min={1}
          max={lastPage}
          defaultValue={currentPage}
          aria-label="ページ番号を入力してジャンプ"
          className="page-jump-input h-9 w-12 rounded-full bg-foreground text-center text-sm font-medium text-background outline-none"
        />
      </form>

      {nextPage && (
        <PageNumberLink page={nextPage} href={buildHref(basePath, nextPage, extraQuery)} />
      )}

      {nextPage ? (
        <Link
          href={buildHref(basePath, nextPage, extraQuery)}
          aria-label="次のページ"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-foreground/10"
        >
          <ChevronIcon direction="right" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center text-foreground/20">
          <ChevronIcon direction="right" />
        </span>
      )}
    </nav>
  );
}
