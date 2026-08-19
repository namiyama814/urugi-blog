interface BarChartProps {
  data: { label: string; value: number }[];
  ariaLabel: string;
}

/** Minimal hand-rolled bar chart — no charting library, matching the project's
 * dependency-free approach. Bar heights are computed at render time as a percentage
 * of the max value, so they use inline `style` rather than Tailwind classes (which
 * must be statically known at build time). */
export function BarChart({ data, ariaLabel }: BarChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-foreground/50">データがありません</p>;
  }

  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <div role="img" aria-label={ariaLabel} className="flex h-32 items-end gap-1">
      {data.map((point) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-1" title={`${point.label}: ${point.value}`}>
          <div
            className="w-full rounded-t bg-foreground/70"
            style={{ height: `${(point.value / max) * 100}%` }}
          />
          <span className="w-full truncate text-center text-[10px] text-foreground/40">
            {point.label.slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
}
