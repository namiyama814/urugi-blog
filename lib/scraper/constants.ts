export const SOURCE_BASE_URL = "https://sanson.urugi.jp/blog";

/** Posts shown per page in this app's own list/search UI (source site uses 30). */
export const OUR_PER_PAGE = 10;

export const USER_AGENT =
  "urugi-blog/0.1 (+https://github.com/namiyama/urugi-blog; unofficial personal reader for sanson.urugi.jp/blog; contact: namiyama814@proton.me)";

export const FETCH_TIMEOUT_MS = 8000;

export const CACHE_TTL_SECONDS = {
  archiveFirstPage: 300,
  archiveOtherPage: 3600,
  post: 86400,
  search: 300,
  totalCount: 1800,
} as const;
