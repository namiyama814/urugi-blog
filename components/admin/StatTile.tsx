interface StatTileProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatTile({ label, value, sublabel }: StatTileProps) {
  return (
    <div className="rounded-xl border border-foreground/10 px-4 py-3">
      <p className="text-xs text-foreground/50">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sublabel && <p className="text-xs text-foreground/40">{sublabel}</p>}
    </div>
  );
}
