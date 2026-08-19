import { SOURCE_BASE_URL } from "./constants";
import type { PostSlug } from "./types";

const POST_PREFIX = "post-";

/** Drops the source site's "post-" prefix from a numeric-id last segment (e.g.
 * "post-21117" -> "21117") for a cleaner app URL. Non-numeric/custom slugs are left as-is. */
function stripPostPrefix(segments: PostSlug): PostSlug {
  const last = segments[segments.length - 1];
  if (!last?.startsWith(POST_PREFIX)) return segments;
  const id = last.slice(POST_PREFIX.length);
  if (!/^\d+$/.test(id)) return segments;
  return [...segments.slice(0, -1), id];
}

/** Inverse of stripPostPrefix, restoring the source site's slug shape before building its URL.
 * Segments that were never stripped (custom slugs, or already-prefixed legacy app slugs) pass through untouched. */
function restorePostPrefix(segments: PostSlug): PostSlug {
  const last = segments[segments.length - 1];
  if (!last || !/^\d+$/.test(last)) return segments;
  return [...segments.slice(0, -1), `${POST_PREFIX}${last}`];
}

/** "https://sanson.urugi.jp/blog/2026/08/post-21117/" -> ["2026", "08", "21117"] */
export function slugFromUrl(url: string): PostSlug {
  const path = new URL(url).pathname.replace(/^\/blog\//, "");
  return stripPostPrefix(path.split("/").filter(Boolean));
}

export function slugToUrl(slug: PostSlug): string {
  return `${SOURCE_BASE_URL}/${restorePostPrefix(slug).join("/")}/`;
}
