import type { EthiopianDate, GregorianDate } from "./calendar";

/** Calendar event categories. */
export type CalendarEventCategory =
  | "cultural"
  | "orthodox_fixed"
  | "orthodox_movable"
  | "fasting"
  | "national"
  | "commemoration";

/** Supported locales (fr/en implemented, am planned). */
export type Locale = "fr" | "en" | "am";

/** Localized string. French is required, the other languages optional. */
export type LocalizedText = {
  fr: string;
  en: string;
  am?: string;
};

export type LocalizedTextOptional = Partial<LocalizedText>;

/**
 * How a movable event is computed.
 * Each rule is resolved by a pure function in `movable-feasts.ts`.
 */
export type MovableRule =
  | "fasika" // Orthodox Easter (Julian computus)
  | "hosanna" // Palm Sunday = Fasika - 7
  | "siklet" // Good Friday = Fasika - 2
  | "trinity_saturday" // Holy Saturday / eve — Fasika - 1
  | "nineveh" // Fast of Nineveh (start) = Fasika - 69
  | "abiy_tsom_start" // Great Lent (start) = Fasika - 55
  | "debre_zeit" // Mid-Lent = Fasika - 28
  | "rikbe_kahnat" // Fasika - 3
  | "erget" // Ascension = Fasika + 39
  | "peraklitos" // Pentecost = Fasika + 49
  | "tsome_hawaryat_start"; // Apostles' Fast (start) = Fasika + 50

/**
 * An event definition — the "source of truth".
 *
 * Golden rule: for any event whose date depends on the Ethiopian calendar we
 * store `ethiopianDate` (the source of truth) and NEVER a hard-coded Gregorian
 * date. The Gregorian date is recomputed for each year via `conversion.ts`.
 */
export type CalendarEventDefinition = {
  /** Stable, unique identifier (used as the base of the ICS UID). */
  id: string;
  title: LocalizedText;
  description?: LocalizedTextOptional;
  category: CalendarEventCategory;

  /** True if the Gregorian date changes every year (movable feasts). */
  isMovable: boolean;
  /** True for an all-day event (the default case). */
  isAllDay: boolean;

  /**
   * Fixed Ethiopian date (month/day), without a year: the feast recurs every
   * Ethiopian year. Used for fixed and cultural feasts.
   */
  ethiopianDate?: Omit<EthiopianDate, "year">;

  /**
   * Computation rule for a movable feast (depends on Fasika).
   * Mutually exclusive with `ethiopianDate`.
   */
  movableRule?: MovableRule;

  /**
   * Fixed Gregorian date (month/day) for the rare civil holidays that are
   * legally anchored in the Gregorian calendar (e.g. 1 May). Documented in
   * docs/CALENDAR_RULES.md.
   */
  gregorianFixed?: Omit<GregorianDate, "year">;

  /**
   * Length in days for periods (fasts). 1 = single day.
   * The event spans `durationDays` days from its start date.
   */
  durationDays?: number;

  /**
   * Ethiopian end date (INCLUSIVE) for variable-length fasts that end on a
   * fixed Ethiopian date (e.g. the Apostles' Fast, which ends the eve of Peter
   * and Paul). Mutually exclusive with `durationDays`.
   */
  endEthiopianDate?: Omit<EthiopianDate, "year">;

  /** Free-form note (assumptions, limits, sources) — not exported to ICS. */
  note?: string;
};

/**
 * A concrete occurrence of an event for a given Gregorian year:
 * the result of resolving a `CalendarEventDefinition`.
 */
export type ResolvedEvent = {
  definitionId: string;
  category: CalendarEventCategory;
  title: LocalizedText;
  description?: LocalizedTextOptional;
  isAllDay: boolean;
  /** Start date (inclusive). */
  start: GregorianDate;
  /** End date (EXCLUSIVE for all-day events, iCalendar DTEND convention). */
  end: GregorianDate;
  /** Stable, deterministic ICS UID. */
  uid: string;
};
