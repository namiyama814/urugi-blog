"use client";

import type { SortOrder } from "@/lib/scraper/types";

const OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "新しい順" },
  { value: "oldest", label: "古い順" },
  { value: "schoolyear", label: "今年度" },
];

interface SortSelectProps {
  currentSort: SortOrder;
  basePath: string;
  extraQuery?: Record<string, string>;
}

export function SortSelect({ currentSort, basePath, extraQuery }: SortSelectProps) {
  return (
    <form method="get" action={basePath} className="mb-4 flex justify-end">
      {Object.entries(extraQuery ?? {}).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <label className="flex items-center gap-2 text-sm text-foreground/60">
        並び替え
        <select
          name="sort"
          defaultValue={currentSort}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="rounded-full border border-foreground/15 bg-background px-3 py-1.5 text-foreground"
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
