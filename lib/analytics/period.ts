export type Period = "7d" | "30d" | "90d" | "all";

export function parsePeriod(value: string | undefined): Period {
  return value === "7d" || value === "90d" || value === "all" ? value : "30d";
}

const PERIOD_DAYS: Record<Exclude<Period, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/** null means "no lower bound" (all-time). */
export function periodToSinceIso(period: Period, now: Date = new Date()): string | null {
  if (period === "all") return null;
  return new Date(now.getTime() - PERIOD_DAYS[period] * 86_400_000).toISOString();
}
