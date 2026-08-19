-- post_summaries: AI-generated one-line summary per post, generated once (on
-- first view of the post detail page — see lib/ai/summarize.ts) and cached
-- forever, since the source article text never changes after publishing.
CREATE TABLE post_summaries (
  slug TEXT PRIMARY KEY,    -- post.slug.join("/"), e.g. "2026/08/21117"
  summary TEXT NOT NULL,
  created_at TEXT NOT NULL  -- ISO 8601 UTC (new Date().toISOString())
);
