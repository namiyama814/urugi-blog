import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface AnalyticsRuntime {
  db: D1Database;
  waitUntil: (promise: Promise<unknown>) => void;
}

/**
 * Resolves the D1 binding + waitUntil scheduler for background analytics writes.
 * Returns undefined whenever unavailable (binding missing, e.g. local `next dev`
 * before migrations exist, or any context-resolution error) — callers must treat
 * that as "skip recording," never as something to surface to the user.
 */
export async function getAnalyticsRuntime(): Promise<AnalyticsRuntime | undefined> {
  try {
    const { env, ctx } = await getCloudflareContext({ async: true });
    if (!env.DB) return undefined;
    return { db: env.DB, waitUntil: (promise) => ctx.waitUntil(promise) };
  } catch {
    return undefined;
  }
}

/** Read-path accessor for the admin dashboard — DB absence is handled by the page itself. */
export async function getDb(): Promise<D1Database | undefined> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}
