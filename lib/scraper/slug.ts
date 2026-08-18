import { SOURCE_BASE_URL } from "./constants";
import type { PostSlug } from "./types";

/** "https://sanson.urugi.jp/blog/2026/08/post-21117/" -> ["2026", "08", "post-21117"] */
export function slugFromUrl(url: string): PostSlug {
  const path = new URL(url).pathname.replace(/^\/blog\//, "");
  return path.split("/").filter(Boolean);
}

export function slugToUrl(slug: PostSlug): string {
  return `${SOURCE_BASE_URL}/${slug.join("/")}/`;
}
