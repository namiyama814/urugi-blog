import { PeriodSelect } from "@/components/admin/PeriodSelect";
import { RatioBar } from "@/components/admin/RatioBar";
import { getDb } from "@/lib/cloudflare";
import { parsePeriod, periodToSinceIso } from "@/lib/analytics/period";
import { getDeviceRatio, getSortUsage } from "@/lib/analytics/query";
import type { SortOrder } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

const SORT_LABELS: Record<SortOrder, string> = {
  newest: "新しい順",
  oldest: "古い順",
  schoolyear: "今年度",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "モバイル",
  pc: "PC",
  other: "不明",
};

interface AdminUsagePageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminUsagePage({ searchParams }: AdminUsagePageProps) {
  const { period: periodParam } = await searchParams;
  const period = parsePeriod(periodParam);
  const sinceIso = periodToSinceIso(period);

  const db = await getDb();
  if (!db) {
    return (
      <p className="text-sm text-foreground/60">
        DBバインディングが見つかりません(ローカル環境でD1が未設定の可能性があります)。
      </p>
    );
  }

  const [sortUsage, deviceRatio] = await Promise.all([getSortUsage(db, sinceIso), getDeviceRatio(db, sinceIso)]);

  const homeSortUsage = sortUsage.filter((row) => row.page === "home");
  const searchSortUsage = sortUsage.filter((row) => row.page === "search");

  return (
    <>
      <PeriodSelect currentPeriod={period} basePath="/admin/usage" />

      <div className="mb-8 space-y-6">
        <RatioBar
          title="並び替えの利用比率(記事一覧)"
          segments={homeSortUsage.map((row) => ({ label: SORT_LABELS[row.sortOrder], value: row.count }))}
        />
        <RatioBar
          title="並び替えの利用比率(検索結果)"
          segments={searchSortUsage.map((row) => ({ label: SORT_LABELS[row.sortOrder], value: row.count }))}
        />
      </div>

      <RatioBar
        title="デバイス比率"
        segments={deviceRatio.map((row) => ({ label: DEVICE_LABELS[row.device] ?? row.device, value: row.count }))}
      />
    </>
  );
}
