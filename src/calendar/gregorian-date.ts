import type { GregorianDate } from "@/types/calendar";

/**
 * Pure functions for the proleptic Gregorian calendar, based on the Julian Day
 * Number (JDN). The JDN is an integer that counts days continuously: it serves
 * as a "common language" between calendars.
 *
 * Classic algorithms (Fliegel & Van Flandern). All functions are pure and
 * side-effect free.
 */

/** True if `year` is a leap year in the Gregorian calendar. */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Converts a Gregorian date (year, month 1-12, day) to a JDN. */
export function gregorianToJDN(date: GregorianDate): number {
  const { year, month, day } = date;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Converts a JDN to a Gregorian date. */
export function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

/** Adds `days` (may be negative) to a Gregorian date. */
export function addDays(date: GregorianDate, days: number): GregorianDate {
  return jdnToGregorian(gregorianToJDN(date) + days);
}

/**
 * Day of week of a JDN: 0 = Monday … 6 = Sunday.
 * (JDN 2451545 = Saturday 1 January 2000 → remainder 5.)
 */
export function dayOfWeek(jdn: number): number {
  return ((jdn % 7) + 7) % 7;
}

/** Formats as `YYYYMMDD` (iCalendar DATE format for all-day events). */
export function toIcsDate(date: GregorianDate): string {
  const y = String(date.year).padStart(4, "0");
  const m = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  return `${y}${m}${d}`;
}
