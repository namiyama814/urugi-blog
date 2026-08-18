import { type NextRequest, NextResponse } from "next/server";
import { scraperErrorResponse } from "@/lib/apiError";
import { searchPosts } from "@/lib/scraper/search";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const page = Math.max(
    1,
    Number(request.nextUrl.searchParams.get("page")) || 1,
  );

  if (!query) {
    return NextResponse.json({ items: [], currentPage: 1, lastPage: 1 });
  }

  try {
    const result = await searchPosts(query, page);
    return NextResponse.json(result);
  } catch (err) {
    return scraperErrorResponse(err);
  }
}
