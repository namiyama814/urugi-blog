import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

const encoder = new TextEncoder();

// crypto.subtle.timingSafeEqual is workerd-only (absent under local `next dev`),
// so tokens are hashed to fixed-size digests first and compared byte-by-byte
// without short-circuiting — portable across both runtimes, and the digest
// step means even the comparison length reveals nothing about the input.
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const [aHash, bHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const aBytes = new Uint8Array(aHash);
  const bBytes = new Uint8Array(bHash);
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

/**
 * Gates the public /api/* scraper-proxy routes behind a bearer token, since
 * nothing in this app calls them itself (pages fetch lib/scraper directly) —
 * without this, they're an open, unauthenticated proxy onto the source site.
 *
 * Configure the token with `wrangler secret put API_TOKEN` in production, or
 * an API_TOKEN line in .dev.vars for local `next dev`. Fails closed: if the
 * secret isn't configured at all, every request is rejected rather than left
 * open.
 *
 * Returns a 401 NextResponse to return immediately, or null if the request
 * is authorized and the route handler should proceed.
 */
export async function requireApiToken(
  request: Request,
): Promise<NextResponse | null> {
  const { env } = await getCloudflareContext({ async: true });
  const expected = env.API_TOKEN;

  const auth = request.headers.get("authorization") ?? "";
  const [scheme, token] = auth.split(" ");

  if (
    !expected ||
    scheme?.toLowerCase() !== "bearer" ||
    !token ||
    !(await timingSafeEqual(token, expected))
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
