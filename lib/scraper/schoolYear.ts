/** Japanese school/fiscal year runs April 1 - March 31. Returns the start date of the
 * school year `now` falls in (e.g. any date in Jan-Mar 2027 belongs to school year starting April 2026). */
export function currentSchoolYearStart(now: Date = new Date()): Date {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  return new Date(startYear, 3, 1);
}

/** Source site dates are "YY/MM/DD" (e.g. "26/08/12" -> 2026-08-12). */
export function parseSourceDate(date: string): Date | null {
  const match = date.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;
  const [, yy, mm, dd] = match;
  return new Date(2000 + Number(yy), Number(mm) - 1, Number(dd));
}
