import { SOURCE_BASE_URL } from "@/lib/scraper/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-foreground/10 py-6 text-sm text-foreground/60">
      <div className="mx-auto w-full max-w-2xl px-4">
        <p>
          本サイトは山村留学売木学園の非公式ファンサイトです。運営とは関係ありません。公式情報は必ず
          <a
            href={`${SOURCE_BASE_URL}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            公式サイト
          </a>
          でご確認ください。
        </p>
      </div>
    </footer>
  );
}
