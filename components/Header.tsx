import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-foreground/10">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold">
          うるぎブログ（非公式）
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/search" className="hover:underline">
            検索
          </Link>
          <Link href="/bookmarks" className="hover:underline">
            ブックマーク
          </Link>
        </nav>
      </div>
    </header>
  );
}
