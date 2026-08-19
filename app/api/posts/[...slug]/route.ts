import { NextResponse } from "next/server";
import { requireApiToken } from "@/lib/apiAuth";
import { scraperErrorResponse } from "@/lib/apiError";
import { getPost } from "@/lib/scraper/post";

interface RouteContext {
  params: Promise<{ slug: string[] }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const unauthorized = await requireApiToken(request);
  if (unauthorized) return unauthorized;

  const { slug } = await params;

  try {
    const post = await getPost(slug);
    return NextResponse.json(post);
  } catch (err) {
    return scraperErrorResponse(err);
  }
}
