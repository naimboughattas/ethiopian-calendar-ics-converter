import type { EthiopianDate } from "@/types/calendar";
import { ETHIOPIAN_MONTHS } from "@/types/calendar";

/**
 * Pure functions for the Ethiopian calendar (Amete Mihret).
 *
 * EPOCH = Julian Day Number of 1 Meskerem, year 1 EC. Standard, validated
 * constant: it reproduces the Ethiopian New Year on 11 September Gregorian
 * (12 September in the year preceding a Gregorian leap year).
 * See docs/ETHIOPIAN_TO_GREGORIAN_CONVERSION.md.
 */
export const ETHIOPIC_EPOCH_JDN = 1724221;

/**
 * True if the Ethiopian year `year` is a leap year.
 * The 13th month (Pagumē) then has 6 days instead of 5.
 * Rule: leap year ⇔ `year % 4 === 3`.
 */
export function isEthiopianLeapYear(year: number): boolean {
  // In JS the modulo can be negative; normalize it for years < 0.
  return ((year % 4) + 4) % 4 === 3;
}

/** Number of days in Ethiopian month `month` (1..13) for year `year`. */
export function daysInEthiopianMonth(year: number, month: number): number {
  if (month < 1 || month > 13) {
    throw new RangeError(`Invalid Ethiopian month: ${month}`);
  }
  if (month <= 12) return 30;
  return isEthiopianLeapYear(year) ? 6 : 5; // Pagumē
}

/** Number of days in Ethiopian year `year` (365 or 366). */
export function daysInEthiopianYear(year: number): number {
  return isEthiopianLeapYear(year) ? 366 : 365;
}

/** Asserts that an `EthiopianDate` (with a year) is consistent. Throws otherwise. */
export function assertValidEthiopianDate(date: Required<EthiopianDate>): void {
  const { year, month, day } = date;
  const max = daysInEthiopianMonth(year, month);
  if (day < 1 || day > max) {
    throw new RangeError(
      `Invalid day ${day} for ${monthName(month)} ${year} (max ${max}).`,
    );
  }
}

/** Transliterated name of Ethiopian month `month` (1..13). */
export function monthName(month: number): string {
  const name = ETHIOPIAN_MONTHS[month - 1];
  if (!name) throw new RangeError(`Invalid Ethiopian month: ${month}`);
  return name;
}

/**
 * Converts a complete Ethiopian date to a JDN.
 * Formula: EPOCH + 365*(year-1) + floor(year/4) + 30*(month-1) + (day-1).
 * The floor(year/4) term encodes the accumulated leap days.
 */
export function ethiopianToJDN(date: Required<EthiopianDate>): number {
  const { year, month, day } = date;
  return (
    ETHIOPIC_EPOCH_JDN +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    (day - 1)
  );
}

/** Converts a JDN to an Ethiopian date. Exact inverse of `ethiopianToJDN`. */
export function jdnToEthiopian(jdn: number): Required<EthiopianDate> {
  const days = jdn - ETHIOPIC_EPOCH_JDN;
  const year = Math.floor((4 * days + 1463) / 1461);
  const yearStartJdn =
    ETHIOPIC_EPOCH_JDN + 365 * (year - 1) + Math.floor(year / 4);
  const dayOfYear = jdn - yearStartJdn; // 0-indexed
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;
  return { year, month, day };
}
