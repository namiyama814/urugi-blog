import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    >
      <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V21l-6-4.2L6 21V3.75Z" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground/15 bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-5">
        <Link href="/" className="text-lg font-bold tracking-tight">
          山村留学売木学園 ブログ
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="検索"
            title="検索"
            className="rounded-full p-2 hover:bg-foreground/10"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/bookmarks"
            aria-label="ブックマーク"
            title="ブックマーク"
            className="rounded-full p-2 hover:bg-foreground/10"
          >
            <BookmarkIcon />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
