"use client";

import { useReadHistory } from "@/contexts/ReadHistoryContext";

export function ReadBadge({ slug }: { slug: string }) {
  const { isRead } = useReadHistory();
  if (!isRead(slug)) return null;

  return (
    <span className="inline-flex items-center rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground/60">
      既読
    </span>
  );
}
