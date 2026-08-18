import { PostListItem } from "@/components/PostListItem";
import type { PostSummary } from "@/lib/scraper/types";

export function PostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return (
      <p className="py-8 text-gray-500 dark:text-gray-400">
        記事が見つかりませんでした。
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
      {posts.map((post) => (
        <PostListItem key={post.slug.join("/")} post={post} />
      ))}
    </ul>
  );
}
