interface RatioBarProps {
  title: string;
  segments: { label: string; value: number }[];
}

const OPACITIES = ["opacity-90", "opacity-60", "opacity-35", "opacity-20"];

/** Proportional composition bar (sort-order / device-type splits). Segment widths
 * are runtime-computed ratios, so they use inline `style` rather than Tailwind
 * classes, same rationale as BarChart. */
export function RatioBar({ title, segments }: RatioBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-foreground/70">{title}</h2>
      {total === 0 ? (
        <p className="text-sm text-foreground/50">データがありません</p>
      ) : (
        <>
          <div className="flex h-3 overflow-hidden rounded-full bg-foreground/10">
            {segments.map((segment, index) => (
              <div
                key={segment.label}
                className={`h-full bg-foreground ${OPACITIES[index % OPACITIES.length]}`}
                style={{ width: `${(segment.value / total) * 100}%` }}
              />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/60">
            {segments.map((segment) => (
              <li key={segment.label}>
                {segment.label}: {segment.value.toLocaleString("ja-JP")}(
                {total > 0 ? Math.round((segment.value / total) * 100) : 0}%)
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
