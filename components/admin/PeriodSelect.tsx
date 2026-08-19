"use client";

import type { Period } from "@/lib/analytics/period";

const OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "1週間" },
  { value: "30d", label: "1ヶ月" },
  { value: "90d", label: "3ヶ月" },
  { value: "all", label: "全期間" },
];

export function PeriodSelect({ currentPeriod, basePath }: { currentPeriod: Period; basePath: string }) {
  return (
    <form method="get" action={basePath} className="mb-6 flex justify-end">
      <label className="flex items-center gap-2 text-sm text-foreground/60">
        集計期間
        <select
          name="period"
          defaultValue={currentPeriod}
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
