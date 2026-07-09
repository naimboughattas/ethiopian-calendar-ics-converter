/**
 * Core types for dates and calendar conversion.
 *
 * The Ethiopian calendar (Ge'ez / Amete Mihret) has 13 months:
 *  - 12 months of 30 days (index 1..12);
 *  - a 13th month, Pagumē (index 13), of 5 days, or 6 days in leap years.
 *
 * Ethiopian leap-year rule: year E is a leap year if `E % 4 === 3`.
 * (See docs/CALENDAR_RULES.md for the full explanation.)
 */

/** A date expressed in the Ethiopian calendar. */
export type EthiopianDate = {
  /** Year of the Ethiopian era (Amete Mihret). Optional for recurring fixed feasts. */
  year?: number;
  /** Month 1..13 (13 = Pagumē). */
  month: number;
  /** Day 1..30 (1..5 or 1..6 for Pagumē). */
  day: number;
};

/** A date expressed in the proleptic Gregorian calendar. */
export type GregorianDate = {
  year: number;
  /** Month 1..12. */
  month: number;
  /** Day 1..31. */
  day: number;
};

/** The 13 Ethiopian months, in order (index 0 = Meskerem). */
export const ETHIOPIAN_MONTHS = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miyazia",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagume",
] as const;

export type EthiopianMonthName = (typeof ETHIOPIAN_MONTHS)[number];
