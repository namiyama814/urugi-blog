import { notFound } from "next/navigation";
import Link from "next/link";
import { FeedScroller } from "@/components/FeedScroller";
import { recordFeedView } from "@/lib/analytics/record";
import { ScraperError } from "@/lib/scraper/errors";
import { extractPostImages } from "@/lib/scraper/extractPostImages";
import { getPost } from "@/lib/scraper/post";

export const dynamic = "force-dynamic";

interface FeedPageProps {
  params: Promise<{ year: string; month: string; id: string }>;
}

export default async function FeedPage({ params }: FeedPageProps) {
  const { year, month, id } = await params;
  const slug = [year, month, id];

  let post;
  try {
    post = await getPost(slug);
  } catch (err) {
    if (err instanceof ScraperError && err.kind === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  const postImages = extractPostImages(post.contentHtml);
  if (postImages.length === 0) notFound();

  recordFeedView(post.slug.join("/"));

  const articleHref = `/post/${year}/${month}/${id}`;
  const postSlug = post.slug.join("/");
  const images = postImages.map((image) => ({
    ...image,
    postSlug,
    postTitle: post.title,
  }));

  return (
    <div className="feed-backdrop fixed inset-0 z-50">
      <Link
        href={articleHref}
        aria-label="記事に戻る"
        className="absolute left-3 top-10 z-30 rounded-full p-2 text-white hover:bg-white/10"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </Link>
      <FeedScroller images={images} endHref={articleHref} endLabel="記事に戻る" />
    </div>
  );
}
