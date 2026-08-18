import { type NextRequest, NextResponse } from "next/server";
import { scraperErrorResponse } from "@/lib/apiError";
import { getArchivePage } from "@/lib/scraper/archive";

export async function GET(request: NextRequest) {
  const page = Math.max(
    1,
    Number(request.nextUrl.searchParams.get("page")) || 1,
  );

  try {
    const result = await getArchivePage(page);
    return NextResponse.json(result);
  } catch (err) {
    return scraperErrorResponse(err);
  }
}
