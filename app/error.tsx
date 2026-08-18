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
      <p className="mb-4 text-foreground/70">
        元サイトに接続できませんでした。しばらくしてから再度お試しください。
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5"
        >
          再読み込み
        </button>
        <a
          href={`${SOURCE_BASE_URL}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5"
        >
          公式サイトを見る
        </a>
      </div>
    </div>
  );
}
