import Link from "next/link";

interface RankingRow {
  label: string;
  value: number;
  href?: string;
}

interface RankingTableProps {
  title: string;
  rows: RankingRow[];
  valueLabel: string;
}

export function RankingTable({ title, rows, valueLabel }: RankingTableProps) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-foreground/70">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-foreground/50">データがありません</p>
      ) : (
        <ol className="divide-y divide-foreground/10 overflow-hidden rounded-xl border border-foreground/10">
          {rows.map((row, index) => (
            <li key={row.label} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
              <span className="flex min-w-0 items-baseline gap-2">
                <span className="shrink-0 text-foreground/40">{index + 1}</span>
                {row.href ? (
                  <Link href={row.href} className="truncate hover:underline">
                    {row.label}
                  </Link>
                ) : (
                  <span className="truncate">{row.label}</span>
                )}
              </span>
              <span className="shrink-0 text-foreground/60">
                {row.value.toLocaleString("ja-JP")} {valueLabel}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
