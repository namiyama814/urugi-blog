import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ReadBadge } from "@/components/ReadBadge";
import { formatSourceDate } from "@/lib/formatDate";
import type { PostSummary } from "@/lib/scraper/types";

export function PostListItem({ post }: { post: PostSummary }) {
  const slug = post.slug.join("/");

  return (
    <li className="relative flex items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-foreground/5">
      <div>
        <Link
          href={`/post/${slug}`}
          className="font-medium after:absolute after:inset-0"
        >
          {post.title}
        </Link>
        <p className="mt-1 flex items-center gap-2 text-sm text-foreground/60">
          {formatSourceDate(post.date)}
          <ReadBadge slug={slug} />
        </p>
      </div>
      <BookmarkButton slug={slug} title={post.title} date={post.date} />
    </li>
  );
}
