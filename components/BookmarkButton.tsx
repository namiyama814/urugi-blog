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
      aria-label={bookmarked ? "ブックマークを解除" : "ブックマークに追加"}
      title={bookmarked ? "ブックマークを解除" : "ブックマークに追加"}
      className="relative z-10 shrink-0 rounded-full p-2 text-foreground hover:bg-foreground/10"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V21l-6-4.2L6 21V3.75Z" />
      </svg>
    </button>
  );
}
