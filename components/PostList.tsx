import { PostListItem } from "@/components/PostListItem";
import type { PostSummary } from "@/lib/scraper/types";

export function PostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return <p className="py-8 text-foreground/60">記事が見つかりませんでした。</p>;
  }

  return (
    <ul className="divide-y divide-foreground/10 overflow-hidden rounded-2xl border border-foreground/10">
      {posts.map((post) => (
        <PostListItem key={post.slug.join("/")} post={post} />
      ))}
    </ul>
  );
}
