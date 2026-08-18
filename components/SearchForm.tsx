export function SearchForm({ initialQuery }: { initialQuery: string }) {
  return (
    <form method="get" action="/search" className="mb-6 flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={initialQuery}
        placeholder="キーワードを入力"
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
      />
      <button
        type="submit"
        className="rounded bg-gray-900 px-4 py-2 text-sm text-white dark:bg-gray-100 dark:text-gray-900"
      >
        検索
      </button>
    </form>
  );
}
