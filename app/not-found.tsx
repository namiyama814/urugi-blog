import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <p className="mb-4 text-foreground/70">
        ページが見つかりませんでした。
      </p>
      <Link href="/" className="text-sm hover:underline">
        トップページに戻る
      </Link>
    </div>
  );
}
