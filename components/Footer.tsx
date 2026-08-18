import { SOURCE_BASE_URL } from "@/lib/scraper/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 py-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
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
