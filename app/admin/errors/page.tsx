import { PeriodSelect } from "@/components/admin/PeriodSelect";
import { RankingTable } from "@/components/admin/RankingTable";
import { getDb } from "@/lib/cloudflare";
import { parsePeriod, periodToSinceIso } from "@/lib/analytics/period";
import { getScraperErrorCounts } from "@/lib/analytics/query";

export const dynamic = "force-dynamic";

interface AdminErrorsPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminErrorsPage({ searchParams }: AdminErrorsPageProps) {
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

  const scraperErrors = await getScraperErrorCounts(db, sinceIso);

  return (
    <>
      <PeriodSelect currentPeriod={period} basePath="/admin/errors" />
      <RankingTable
        title="スクレイパーのエラー"
        valueLabel="件"
        rows={scraperErrors.map((row) => ({ label: row.kind, value: row.count }))}
      />
    </>
  );
}
