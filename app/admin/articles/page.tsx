import { PeriodSelect } from "@/components/admin/PeriodSelect";
import { RankingTable } from "@/components/admin/RankingTable";
import { getDb } from "@/lib/cloudflare";
import { parsePeriod, periodToSinceIso } from "@/lib/analytics/period";
import { getLeastViewedPosts, getTopPosts } from "@/lib/analytics/query";

export const dynamic = "force-dynamic";

interface AdminArticlesPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminArticlesPage({ searchParams }: AdminArticlesPageProps) {
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

  const [topPosts, leastViewed] = await Promise.all([
    getTopPosts(db, sinceIso, 10),
    getLeastViewedPosts(db, sinceIso, 10),
  ]);

  return (
    <>
      <PeriodSelect currentPeriod={period} basePath="/admin/articles" />

      <div className="mb-8">
        <RankingTable
          title="最も見られた記事"
          valueLabel="回"
          rows={topPosts.map((post) => ({ label: post.title, value: post.views, href: `/post/${post.slug}` }))}
        />
      </div>

      <div>
        <RankingTable
          title="あまり読まれていない記事(閲覧記録があるもののうちワースト)"
          valueLabel="回"
          rows={leastViewed.map((post) => ({ label: post.title, value: post.views, href: `/post/${post.slug}` }))}
        />
      </div>
    </>
  );
}
