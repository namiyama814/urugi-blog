/** Source site dates are "YY/MM/DD" (e.g. "26/08/12" -> "2026/08/12"). */
export function formatSourceDate(date: string): string {
  const match = date.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!match) return date;
  const [, yy, mm, dd] = match;
  return `20${yy}/${mm}/${dd}`;
}
