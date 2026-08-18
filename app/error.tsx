"use client";

import { SOURCE_BASE_URL } from "@/lib/scraper/constants";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        元サイトに接続できませんでした。しばらくしてから再度お試しください。
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
        >
          再読み込み
        </button>
        <a
          href={`${SOURCE_BASE_URL}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
        >
          公式サイトを見る
        </a>
      </div>
    </div>
  );
}
