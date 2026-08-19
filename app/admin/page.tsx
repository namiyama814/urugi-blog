import { BarChart } from "@/components/admin/BarChart";
import { PeriodSelect } from "@/components/admin/PeriodSelect";
import { StatTile } from "@/components/admin/StatTile";
import { getDb } from "@/lib/cloudflare";
import { parsePeriod, periodToSinceIso } from "@/lib/analytics/period";
import { getDailyPageViews, getFeedVsPostViews } from "@/lib/analytics/query";

export const dynamic = "force-dynamic";

interface AdminOverviewPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminOverviewPage({ searchParams }: AdminOverviewPageProps) {
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

  const [dailyPv, feedVsPost] = await Promise.all([
    getDailyPageViews(db, sinceIso),
    getFeedVsPostViews(db, sinceIso),
  ]);

  return (
    <>
      <PeriodSelect currentPeriod={period} basePath="/admin" />

      <div className="mb-8 grid grid-cols-3 gap-3">
        <StatTile label="記事の総PV" value={feedVsPost.postViews.toLocaleString("ja-JP")} />
        <StatTile label="フィード閲覧数" value={feedVsPost.feedViews.toLocaleString("ja-JP")} />
        <StatTile
          label="フィード遷移率"
          value={feedVsPost.ratio === null ? "—" : `${Math.round(feedVsPost.ratio * 100)}%`}
        />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground/70">日次PV推移</h2>
        <BarChart
          data={dailyPv.map((point) => ({ label: point.day, value: point.views }))}
          ariaLabel="日次PV推移グラフ"
        />
      </div>
    </>
  );
}
