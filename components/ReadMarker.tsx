"use client";

import { useEffect } from "react";
import { useReadHistory } from "@/contexts/ReadHistoryContext";

/** Invisible: records `slug` as read once this post page mounts. */
export function ReadMarker({ slug }: { slug: string }) {
  const { markRead } = useReadHistory();

  useEffect(() => {
    markRead(slug);
  }, [slug, markRead]);

  return null;
}
