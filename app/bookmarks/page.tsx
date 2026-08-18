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
        <p className="text-gray-500 dark:text-gray-400">
          ブックマークした記事はありません。
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.slug} className="py-4">
              <Link
                href={`/post/${bookmark.slug}`}
                className="text-lg font-medium text-gray-900 hover:underline dark:text-gray-100"
              >
                {bookmark.title}
              </Link>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatSourceDate(bookmark.date)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
