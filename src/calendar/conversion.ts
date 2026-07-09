import type { EthiopianDate, GregorianDate } from "@/types/calendar";
import {
  assertValidEthiopianDate,
  ethiopianToJDN,
  jdnToEthiopian,
} from "./ethiopian-date";
import { gregorianToJDN, jdnToGregorian } from "./gregorian-date";

/**
 * Ethiopian ↔ Gregorian calendar conversions.
 *
 * All functions are pure and go through the Julian Day Number (JDN) as the
 * pivot representation. See docs/ETHIOPIAN_TO_GREGORIAN_CONVERSION.md.
 */

/** Ethiopian → Gregorian. */
export function ethiopianToGregorian(
  date: Required<EthiopianDate>,
): GregorianDate {
  assertValidEthiopianDate(date);
  return jdnToGregorian(ethiopianToJDN(date));
}

/** Gregorian → Ethiopian. */
export function gregorianToEthiopian(
  date: GregorianDate,
): Required<EthiopianDate> {
  return jdnToEthiopian(gregorianToJDN(date));
}

/**
 * Resolves a fixed feast (Ethiopian month/day) to its Gregorian date within a
 * target Gregorian year, or `null` if it does not fall in that year.
 *
 * A recurring Ethiopian date falls **0 or 1** times per Gregorian year (never
 * 2: the gap between two occurrences equals the Ethiopian year length,
 * ≥ 365 days). The **0** case is real: a date near 31 December / 1 January can,
 * depending on the leap-year drift, fall on 31 Dec of one year then 1 Jan of
 * the next, skipping the intermediate Gregorian year. We then return `null`
 * (the caller skips the occurrence; it appears in the adjacent Gregorian year).
 *
 * We test the two candidate Ethiopian years (the one starting in
 * `gregorianYear - 8` or `- 7`) and keep the one whose conversion falls in
 * `gregorianYear`.
 *
 * Example: Genna (Tahsas 29) falls in January; for Gregorian year 2026 the
 * Ethiopian year 2018 must be used, not 2019.
 */
export function resolveEthiopianDateInGregorianYear(
  ethMonth: number,
  ethDay: number,
  gregorianYear: number,
): GregorianDate | null {
  // The Ethiopian year current on 1 January of `gregorianYear` is about
  // gregorianYear - 8; the one starting in September is about - 7.
  const candidates = [gregorianYear - 8, gregorianYear - 7];
  for (const ethYear of candidates) {
    const greg = ethiopianToGregorian({
      year: ethYear,
      month: ethMonth,
      day: ethDay,
    });
    if (greg.year === gregorianYear) return greg;
  }
  return null; // the Ethiopian date does not fall in this Gregorian year
}
