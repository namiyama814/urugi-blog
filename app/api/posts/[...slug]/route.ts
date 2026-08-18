import { NextResponse } from "next/server";
import { scraperErrorResponse } from "@/lib/apiError";
import { getPost } from "@/lib/scraper/post";

interface RouteContext {
  params: Promise<{ slug: string[] }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
    return NextResponse.json(post);
  } catch (err) {
    return scraperErrorResponse(err);
  }
}
