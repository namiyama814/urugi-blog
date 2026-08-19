import type { SortOrder } from "./types";

export function parseSortOrder(value: string | undefined): SortOrder {
  return value === "oldest" || value === "schoolyear" ? value : "newest";
}
