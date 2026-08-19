import type { ScraperErrorKind } from "@/lib/scraper/errors";
import type { SortOrder } from "@/lib/scraper/types";

export interface RankedPost {
  slug: string;
  title: string;
  views: number;
}

export interface DailyPvPoint {
  day: string;
  views: number;
}

export interface QueryRanking {
  query: string;
  count: number;
}

export interface SortUsageRow {
  page: "home" | "search";
  sortOrder: SortOrder;
  count: number;
}

export interface ScraperErrorCount {
  kind: ScraperErrorKind;
  count: number;
}

export interface FeedVsPostViews {
  feedViews: number;
  postViews: number;
  ratio: number | null;
}

export interface DeviceRatioRow {
  device: "mobile" | "pc" | "other";
  count: number;
}

export async function getTopPosts(
  db: D1Database,
  sinceIso: string | null,
  limit: number,
): Promise<RankedPost[]> {
  const query = sinceIso
    ? db
        .prepare(
          "SELECT slug, MAX(title) AS title, COUNT(*) AS views FROM post_views WHERE viewed_at >= ? GROUP BY slug ORDER BY views DESC LIMIT ?",
        )
        .bind(sinceIso, limit)
    : db
        .prepare(
          "SELECT slug, MAX(title) AS title, COUNT(*) AS views FROM post_views GROUP BY slug ORDER BY views DESC LIMIT ?",
        )
        .bind(limit);
  const { results } = await query.all<RankedPost>();
  return results;
}

export async function getLeastViewedPosts(
  db: D1Database,
  sinceIso: string | null,
  limit: number,
): Promise<RankedPost[]> {
  // Structurally excludes posts with zero recorded views (they never appear in
  // post_views at all) — this is "least viewed among tracked posts," not a diff
  // against the full ~1400-post external archive. See plan notes.
  const query = sinceIso
    ? db
        .prepare(
          "SELECT slug, MAX(title) AS title, COUNT(*) AS views FROM post_views WHERE viewed_at >= ? GROUP BY slug ORDER BY views ASC LIMIT ?",
        )
        .bind(sinceIso, limit)
    : db
        .prepare(
          "SELECT slug, MAX(title) AS title, COUNT(*) AS views FROM post_views GROUP BY slug ORDER BY views ASC LIMIT ?",
        )
        .bind(limit);
  const { results } = await query.all<RankedPost>();
  return results;
}

export async function getDailyPageViews(
  db: D1Database,
  sinceIso: string | null,
): Promise<DailyPvPoint[]> {
  const query = sinceIso
    ? db
        .prepare(
          "SELECT substr(viewed_at, 1, 10) AS day, COUNT(*) AS views FROM post_views WHERE viewed_at >= ? GROUP BY day ORDER BY day ASC",
        )
        .bind(sinceIso)
    : db.prepare(
        "SELECT substr(viewed_at, 1, 10) AS day, COUNT(*) AS views FROM post_views GROUP BY day ORDER BY day ASC",
      );
  const { results } = await query.all<DailyPvPoint>();
  return results;
}

export async function getTopSearchQueries(
  db: D1Database,
  sinceIso: string | null,
  limit: number,
): Promise<QueryRanking[]> {
  const query = sinceIso
    ? db
        .prepare(
          "SELECT query, COUNT(*) AS count FROM search_queries WHERE searched_at >= ? GROUP BY query ORDER BY count DESC LIMIT ?",
        )
        .bind(sinceIso, limit)
    : db
        .prepare(
          "SELECT query, COUNT(*) AS count FROM search_queries GROUP BY query ORDER BY count DESC LIMIT ?",
        )
        .bind(limit);
  const { results } = await query.all<QueryRanking>();
  return results;
}

export async function getSortUsage(db: D1Database, sinceIso: string | null): Promise<SortUsageRow[]> {
  const query = sinceIso
    ? db
        .prepare(
          "SELECT page, sort_order, COUNT(*) AS count FROM sort_usage WHERE used_at >= ? GROUP BY page, sort_order ORDER BY page, count DESC",
        )
        .bind(sinceIso)
    : db.prepare(
        "SELECT page, sort_order, COUNT(*) AS count FROM sort_usage GROUP BY page, sort_order ORDER BY page, count DESC",
      );
  const { results } = await query.all<{ page: "home" | "search"; sort_order: SortOrder; count: number }>();
  return results.map((row) => ({ page: row.page, sortOrder: row.sort_order, count: row.count }));
}

export async function getScraperErrorCounts(
  db: D1Database,
  sinceIso: string | null,
): Promise<ScraperErrorCount[]> {
  const query = sinceIso
    ? db
        .prepare(
          "SELECT kind, COUNT(*) AS count FROM scraper_errors WHERE occurred_at >= ? GROUP BY kind ORDER BY count DESC",
        )
        .bind(sinceIso)
    : db.prepare("SELECT kind, COUNT(*) AS count FROM scraper_errors GROUP BY kind ORDER BY count DESC");
  const { results } = await query.all<ScraperErrorCount>();
  return results;
}

export async function getFeedVsPostViews(
  db: D1Database,
  sinceIso: string | null,
): Promise<FeedVsPostViews> {
  const query = sinceIso
    ? db
        .prepare(
          "SELECT (SELECT COUNT(*) FROM feed_views WHERE viewed_at >= ?1) AS feed_views, (SELECT COUNT(*) FROM post_views WHERE viewed_at >= ?1) AS post_views",
        )
        .bind(sinceIso)
    : db.prepare(
        "SELECT (SELECT COUNT(*) FROM feed_views) AS feed_views, (SELECT COUNT(*) FROM post_views) AS post_views",
      );
  const row = await query.first<{ feed_views: number; post_views: number }>();
  const feedViews = row?.feed_views ?? 0;
  const postViews = row?.post_views ?? 0;
  return { feedViews, postViews, ratio: postViews > 0 ? feedViews / postViews : null };
}

export async function getDeviceRatio(db: D1Database, sinceIso: string | null): Promise<DeviceRatioRow[]> {
  const query = sinceIso
    ? db
        .prepare(
          "SELECT device, COUNT(*) AS count FROM post_views WHERE viewed_at >= ? GROUP BY device ORDER BY count DESC",
        )
        .bind(sinceIso)
    : db.prepare("SELECT device, COUNT(*) AS count FROM post_views GROUP BY device ORDER BY count DESC");
  const { results } = await query.all<DeviceRatioRow>();
  return results;
}
