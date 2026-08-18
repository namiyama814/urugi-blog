import { sanitizePostHtml } from "../sanitize";
import { CACHE_TTL_SECONDS } from "./constants";
import { fetchHtml } from "./fetchHtml";
import { parsePostHtml } from "./parsePost";
import { slugToUrl } from "./slug";
import type { PostDetail, PostSlug } from "./types";

export async function getPost(slug: PostSlug): Promise<PostDetail> {
  const url = slugToUrl(slug);
  const html = await fetchHtml(url, { cacheTtlSeconds: CACHE_TTL_SECONDS.post });
  const parsed = parsePostHtml(html);

  return {
    slug,
    url,
    title: parsed.title,
    date: parsed.date,
    contentHtml: sanitizePostHtml(parsed.rawContentHtml),
  };
}
