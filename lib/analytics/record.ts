import { getAnalyticsRuntime } from "@/lib/cloudflare";
import type { ScraperErrorKind } from "@/lib/scraper/errors";
import type { SortOrder } from "@/lib/scraper/types";

type Device = "mobile" | "pc" | "other";

function classifyDevice(userAgent: string | null): Device {
  if (!userAgent) return "other";
  return /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent) ? "mobile" : "pc";
}

/**
 * Every analytics write goes through this: resolves the runtime, schedules the
 * write via waitUntil (so it never adds latency to the response), and swallows
 * any failure at every layer. Recording must never be able to break the site.
 */
async function safeWrite(fn: (db: D1Database) => Promise<unknown>): Promise<void> {
  try {
    const runtime = await getAnalyticsRuntime();
    if (!runtime) return;
    runtime.waitUntil(
      fn(runtime.db).catch((err) => {
        console.error("[analytics] write failed", err);
      }),
    );
  } catch (err) {
    console.error("[analytics] record setup failed", err);
  }
}

export function recordPostView(slug: string, title: string, userAgent: string | null): void {
  void safeWrite((db) =>
    db
      .prepare("INSERT INTO post_views (slug, title, viewed_at, device) VALUES (?, ?, ?, ?)")
      .bind(slug, title, new Date().toISOString(), classifyDevice(userAgent))
      .run(),
  );
}

export function recordFeedView(slug: string): void {
  void safeWrite((db) =>
    db
      .prepare("INSERT INTO feed_views (slug, viewed_at) VALUES (?, ?)")
      .bind(slug, new Date().toISOString())
      .run(),
  );
}

/** result_count is the first page's item count (an approximate "got results?"
 * signal), not an exact total — PaginatedResult carries no total-count field. */
export function recordSearchQuery(query: string, resultCount: number): void {
  void safeWrite((db) =>
    db
      .prepare("INSERT INTO search_queries (query, result_count, searched_at) VALUES (?, ?, ?)")
      .bind(query, resultCount, new Date().toISOString())
      .run(),
  );
}

export function recordSortUsage(page: "home" | "search", sortOrder: SortOrder): void {
  void safeWrite((db) =>
    db
      .prepare("INSERT INTO sort_usage (page, sort_order, used_at) VALUES (?, ?, ?)")
      .bind(page, sortOrder, new Date().toISOString())
      .run(),
  );
}

export function recordScraperError(kind: ScraperErrorKind, url: string): void {
  void safeWrite((db) =>
    db
      .prepare("INSERT INTO scraper_errors (kind, url, occurred_at) VALUES (?, ?, ?)")
      .bind(kind, url, new Date().toISOString())
      .run(),
  );
}
