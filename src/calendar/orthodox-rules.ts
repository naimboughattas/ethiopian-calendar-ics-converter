import type { GregorianDate } from "@/types/calendar";
import type { MovableRule } from "@/types/event";
import { addDays, jdnToGregorian } from "./gregorian-date";

/**
 * Rules of the Ethiopian Orthodox (Tewahedo) liturgical calendar.
 *
 * The Ethiopian Orthodox Church computes Fasika (Easter) using the Orthodox
 * paschal computus (Julian-based), like all Orthodox Churches. Every other
 * movable feast is derived from Fasika by a simple offset in days.
 * See docs/ORTHODOX_RITES.md and docs/CALENDAR_RULES.md.
 */

/** Converts a Julian-calendar date to a JDN. */
function julianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    32083
  );
}

/**
 * Gregorian date of Fasika (Orthodox Easter) for a Gregorian year.
 * Meeus algorithm (Julian computus), then Julian → Gregorian conversion.
 */
export function fasikaGregorian(gregorianYear: number): GregorianDate {
  const year = gregorianYear;
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const f = d + e + 114;
  const month = Math.floor(f / 31); // 3 = March, 4 = April (Julian)
  const day = (f % 31) + 1;
  // Julian Easter date → JDN → Gregorian.
  return jdnToGregorian(julianToJDN(year, month, day));
}

/**
 * Offset (in days) of each movable feast relative to Fasika.
 * Negative = before Fasika, positive = after.
 */
export const MOVABLE_OFFSETS_FROM_FASIKA: Record<MovableRule, number> = {
  nineveh: -69, // Fast of Nineveh (Monday)
  abiy_tsom_start: -55, // Great Lent / Hudadi (Monday)
  debre_zeit: -28, // Mid-Lent (Mount of Olives Palm Sunday)
  hosanna: -7, // Palm Sunday
  rikbe_kahnat: -3, // Maundy Thursday (Rikbe Kahnat)
  siklet: -2, // Good Friday (Crucifixion)
  trinity_saturday: -1, // Holy Saturday (eve of Fasika)
  fasika: 0, // Easter (Sunday)
  erget: 39, // Ascension (Thursday)
  peraklitos: 49, // Pentecost (Paraclete, Sunday)
  tsome_hawaryat_start: 50, // Apostles' Fast (Monday after Pentecost)
};

/** Resolves a movable feast to a Gregorian date for the given year. */
export function resolveMovable(
  rule: MovableRule,
  gregorianYear: number,
): GregorianDate {
  const fasika = fasikaGregorian(gregorianYear);
  return addDays(fasika, MOVABLE_OFFSETS_FROM_FASIKA[rule]);
}
