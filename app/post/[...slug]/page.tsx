import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PostContent } from "@/components/PostContent";
import { formatSourceDate } from "@/lib/formatDate";
import { ScraperError } from "@/lib/scraper/errors";
import { getPost } from "@/lib/scraper/post";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch (err) {
    if (err instanceof ScraperError && err.kind === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-8">
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
      <PostContent html={post.contentHtml} />
    </article>
  );
}
