import { PeriodSelect } from "@/components/admin/PeriodSelect";
import { RankingTable } from "@/components/admin/RankingTable";
import { getDb } from "@/lib/cloudflare";
import { parsePeriod, periodToSinceIso } from "@/lib/analytics/period";
import { getTopSearchQueries } from "@/lib/analytics/query";

export const dynamic = "force-dynamic";

interface AdminSearchPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminSearchPage({ searchParams }: AdminSearchPageProps) {
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

  const topQueries = await getTopSearchQueries(db, sinceIso, 20);

  return (
    <>
      <PeriodSelect currentPeriod={period} basePath="/admin/search" />
      <RankingTable
        title="検索キーワードランキング"
        valueLabel="回"
        rows={topQueries.map((row) => ({ label: row.query, value: row.count }))}
      />
    </>
  );
}
