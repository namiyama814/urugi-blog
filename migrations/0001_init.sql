-- post_views: one row per view of a post detail page (app/post/[year]/[month]/[id]/page.tsx).
CREATE TABLE post_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,       -- post.slug.join("/"), e.g. "2026/08/21117"
  title TEXT NOT NULL,
  viewed_at TEXT NOT NULL,  -- ISO 8601 UTC (new Date().toISOString())
  device TEXT NOT NULL      -- 'mobile' | 'pc' | 'other'
);
CREATE INDEX idx_post_views_viewed_at ON post_views(viewed_at);
CREATE INDEX idx_post_views_slug_viewed_at ON post_views(slug, viewed_at);

-- feed_views: one row per view of a post's /feed reel viewer.
CREATE TABLE feed_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  viewed_at TEXT NOT NULL
);
CREATE INDEX idx_feed_views_viewed_at ON feed_views(viewed_at);
CREATE INDEX idx_feed_views_slug_viewed_at ON feed_views(slug, viewed_at);

-- search_queries: one row per search submission (page 1 only — see lib/analytics/record.ts).
CREATE TABLE search_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  result_count INTEGER NOT NULL,
  searched_at TEXT NOT NULL
);
CREATE INDEX idx_search_queries_searched_at ON search_queries(searched_at);
CREATE INDEX idx_search_queries_query_searched_at ON search_queries(query, searched_at);

-- sort_usage: one row per archive/search page load, recording the sort order in effect.
CREATE TABLE sort_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,       -- 'home' | 'search'
  sort_order TEXT NOT NULL, -- SortOrder: 'newest' | 'oldest' | 'schoolyear'
  used_at TEXT NOT NULL
);
CREATE INDEX idx_sort_usage_used_at ON sort_usage(used_at);
CREATE INDEX idx_sort_usage_page_sort_used_at ON sort_usage(page, sort_order, used_at);

-- scraper_errors: one row per ScraperError thrown by lib/scraper/fetchHtml.ts.
CREATE TABLE scraper_errors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,       -- ScraperErrorKind
  url TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);
CREATE INDEX idx_scraper_errors_occurred_at ON scraper_errors(occurred_at);
CREATE INDEX idx_scraper_errors_kind_occurred_at ON scraper_errors(kind, occurred_at);
