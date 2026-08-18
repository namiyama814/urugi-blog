import { NextResponse } from "next/server";
import { ScraperError } from "@/lib/scraper/errors";

/** Maps a caught scraper error to a JSON error response; rethrows anything else. */
export function scraperErrorResponse(err: unknown): NextResponse {
  if (err instanceof ScraperError) {
    if (err.kind === "NOT_FOUND") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (err.kind === "TIMEOUT") {
      return NextResponse.json({ error: "timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }
  throw err;
}
