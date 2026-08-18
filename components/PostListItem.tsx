import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";
import { formatSourceDate } from "@/lib/formatDate";
import type { PostSummary } from "@/lib/scraper/types";

export function PostListItem({ post }: { post: PostSummary }) {
  const slug = post.slug.join("/");

  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div>
        <Link
          href={`/post/${slug}`}
          className="text-lg font-medium text-gray-900 hover:underline dark:text-gray-100"
        >
          {post.title}
        </Link>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {formatSourceDate(post.date)}
        </p>
      </div>
      <BookmarkButton slug={slug} title={post.title} date={post.date} />
    </li>
  );
}
