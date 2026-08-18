"use client";

import Link from "next/link";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { formatSourceDate } from "@/lib/formatDate";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">ブックマーク</h1>
      {bookmarks.length === 0 ? (
        <p className="text-foreground/60">ブックマークした記事はありません。</p>
      ) : (
        <ul className="divide-y divide-foreground/10 overflow-hidden rounded-2xl border border-foreground/10">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.slug}
              className="px-4 py-4 transition-colors hover:bg-foreground/5"
            >
              <Link
                href={`/post/${bookmark.slug}`}
                className="font-medium hover:underline"
              >
                {bookmark.title}
              </Link>
              <p className="mt-1 text-sm text-foreground/60">
                {formatSourceDate(bookmark.date)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
