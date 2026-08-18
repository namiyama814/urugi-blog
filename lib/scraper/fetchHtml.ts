import { FETCH_TIMEOUT_MS, USER_AGENT } from "./constants";
import { ScraperError } from "./errors";

interface FetchHtmlOptions {
  /** When set, response bodies are cached (Cloudflare Workers Cache API) for this many seconds. */
  cacheTtlSeconds?: number;
}

/**
 * `caches` is a Cloudflare Workers global (present under wrangler/opennextjs-cloudflare).
 * Plain `next dev` on Node.js has no such global, so caching is skipped there.
 */
function getCache(): Cache | undefined {
  if (typeof caches === "undefined") return undefined;
  // lib.dom.d.ts's CacheStorage doesn't declare `.default`; the Workers runtime does.
  return (caches as CacheStorage & { default: Cache }).default;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url: string): Promise<Response> {
  try {
    const response = await fetchWithTimeout(url);
    if (response.status >= 500) {
      return await fetchWithTimeout(url);
    }
    return response;
  } catch {
    try {
      return await fetchWithTimeout(url);
    } catch (retryErr) {
      if (retryErr instanceof Error && retryErr.name === "AbortError") {
        throw new ScraperError("TIMEOUT", url);
      }
      throw new ScraperError(
        "NETWORK_ERROR",
        url,
        retryErr instanceof Error ? retryErr.message : String(retryErr),
      );
    }
  }
}

/** Fetches HTML from the source site, with optional Workers-Cache-API caching. */
export async function fetchHtml(
  url: string,
  { cacheTtlSeconds }: FetchHtmlOptions = {},
): Promise<string> {
  const cache = getCache();

  if (cache && cacheTtlSeconds) {
    const cached = await cache.match(url);
    if (cached) return await cached.text();
  }

  const response = await fetchWithRetry(url);

  if (response.status === 404) {
    throw new ScraperError("NOT_FOUND", url, undefined, 404);
  }
  if (!response.ok) {
    throw new ScraperError("UPSTREAM_ERROR", url, undefined, response.status);
  }

  const html = await response.text();

  if (cache && cacheTtlSeconds) {
    const cacheResponse = new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": `max-age=${cacheTtlSeconds}`,
      },
    });
    await cache.put(url, cacheResponse);
  }

  return html;
}
