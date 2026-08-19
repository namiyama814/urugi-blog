"use client";

import { useImageBookmarks } from "@/contexts/ImageBookmarksContext";

interface ImageBookmarkButtonProps {
  src: string;
  alt: string;
  caption?: string;
  postSlug: string;
  postTitle: string;
}

export function ImageBookmarkButton({
  src,
  alt,
  caption,
  postSlug,
  postTitle,
}: ImageBookmarkButtonProps) {
  const { isImageBookmarked, toggleImage } = useImageBookmarks();
  const bookmarked = isImageBookmarked(src);

  return (
    <button
      type="button"
      onClick={() => toggleImage({ src, alt, caption, postSlug, postTitle })}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "この写真のブックマークを解除" : "この写真をブックマーク"}
      title={bookmarked ? "この写真のブックマークを解除" : "この写真をブックマーク"}
      className="rounded-full p-2.5 text-white drop-shadow-md hover:bg-white/10"
    >
      <svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        aria-hidden="true"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      >
        <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V21l-6-4.2L6 21V3.75Z" />
      </svg>
    </button>
  );
}
