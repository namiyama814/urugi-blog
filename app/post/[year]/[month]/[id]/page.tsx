import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { AiSummaryButton } from "@/components/AiSummaryButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PostContent } from "@/components/PostContent";
import { ReadMarker } from "@/components/ReadMarker";
import { ShareButtons } from "@/components/ShareButtons";
import { recordPostView } from "@/lib/analytics/record";
import { formatSourceDate } from "@/lib/formatDate";
import { ScraperError } from "@/lib/scraper/errors";
import { extractPostImages } from "@/lib/scraper/extractPostImages";
import { getPost } from "@/lib/scraper/post";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ year: string; month: string; id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
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

  const imageCount = extractPostImages(post.contentHtml).length;
  recordPostView(post.slug.join("/"), post.title, (await headers()).get("user-agent"));

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-8">
      <ReadMarker slug={post.slug.join("/")} />
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
          <p className="text-sm text-foreground/60">
            {formatSourceDate(post.date)}
          </p>
        </div>
        <BookmarkButton
          slug={post.slug.join("/")}
          title={post.title}
          date={post.date}
        />
      </div>
      <PostContent
        html={post.contentHtml}
        postSlug={post.slug.join("/")}
        postTitle={post.title}
      />
      <ShareButtons title={post.title} />
      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-1 rounded-full border border-foreground/15 px-5 py-2 text-sm hover:bg-foreground/5"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
          一覧へ戻る
        </Link>
      </div>
      <AiSummaryButton postSlug={post.slug.join("/")} />
      {imageCount > 0 && (
        <Link
          href={`/post/${year}/${month}/${id}/feed`}
          aria-label="写真をフィードで見る"
          title="写真をフィードで見る"
          className="fixed bottom-6 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:opacity-90"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="13" height="13" rx="2" />
            <path d="M7 21h11a2 2 0 0 0 2-2V8" />
          </svg>
        </Link>
      )}
    </article>
  );
}
