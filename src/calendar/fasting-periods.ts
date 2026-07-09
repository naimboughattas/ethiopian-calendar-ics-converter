import type { GregorianDate } from "@/types/calendar";
import type { CalendarEventDefinition } from "@/types/event";
import { resolveEthiopianDateInGregorianYear } from "./conversion";
import { addDays, gregorianToJDN } from "./gregorian-date";

/**
 * Computes the EXCLUSIVE end date (iCalendar DTEND convention) of an event,
 * from its Gregorian start date and its definition.
 *
 * - `durationDays`: the event spans N days → end = start + N.
 * - `endEthiopianDate`: last INCLUSIVE day expressed as an Ethiopian date →
 *   exclusive end = (resolved Ethiopian day) + 1.
 * - otherwise: single-day event → end = start + 1.
 */
export function resolveEndExclusive(
  def: CalendarEventDefinition,
  start: GregorianDate,
  gregorianYear: number,
): GregorianDate {
  if (def.durationDays !== undefined) {
    return addDays(start, def.durationDays);
  }

  if (def.endEthiopianDate) {
    const { month, day } = def.endEthiopianDate;
    // The end date can fall in the start's Gregorian year or the next one
    // (fast straddling the Gregorian New Year). We pick the first resolution
    // on or after the start. `null` (a date that skips a Gregorian year) is
    // ignored.
    const candidates = [gregorianYear, gregorianYear + 1]
      .map((y) => resolveEthiopianDateInGregorianYear(month, day, y))
      .filter((d): d is GregorianDate => d !== null);
    const startJdn = gregorianToJDN(start);
    for (const c of candidates) {
      if (gregorianToJDN(c) >= startJdn) return addDays(c, 1); // +1 → exclusive
    }
    throw new Error(
      `End date ${month}/${day} not found after the start for ${def.id}.`,
    );
  }

  return addDays(start, 1);
}
