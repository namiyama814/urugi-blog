"use client";

import { useState } from "react";

export function SearchForm({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);

  return (
    <form method="get" action="/search" className="mb-6 flex gap-2">
      <div className="relative flex-1">
        <input
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="キーワードを入力"
          className="search-input w-full rounded-full border border-foreground/15 bg-background px-4 py-2 pr-9 text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="検索キーワードをクリア"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/50 hover:bg-foreground/10 hover:text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2 text-sm text-background"
      >
        検索
      </button>
    </form>
  );
}
