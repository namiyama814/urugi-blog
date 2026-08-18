export function SearchForm({ initialQuery }: { initialQuery: string }) {
  return (
    <form method="get" action="/search" className="mb-6 flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={initialQuery}
        placeholder="キーワードを入力"
        className="flex-1 rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2 text-sm text-background"
      >
        検索
      </button>
    </form>
  );
}
