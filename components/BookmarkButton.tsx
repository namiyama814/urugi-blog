"use client";

import { useBookmarks } from "@/contexts/BookmarksContext";

interface BookmarkButtonProps {
  slug: string;
  title: string;
  date: string;
}

export function BookmarkButton({ slug, title, date }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(slug);

  return (
    <button
      type="button"
      onClick={() => toggle({ slug, title, date })}
      aria-pressed={bookmarked}
      className="shrink-0 rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
    >
      {bookmarked ? "★ ブックマーク済み" : "☆ ブックマーク"}
    </button>
  );
}
