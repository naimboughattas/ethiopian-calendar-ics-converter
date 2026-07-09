import type { GregorianDate } from "@/types/calendar";
import type {
  CalendarEventCategory,
  CalendarEventDefinition,
  ResolvedEvent,
} from "@/types/event";
import { FIXED_CULTURAL_EVENTS } from "@/data/fixed-cultural-events";
import { FIXED_ORTHODOX_EVENTS } from "@/data/fixed-orthodox-events";
import { FASTING_PERIODS } from "@/data/fasting-periods";
import { resolveEthiopianDateInGregorianYear } from "./conversion";
import { resolveEndExclusive } from "./fasting-periods";
import { gregorianToJDN } from "./gregorian-date";
import { generateMonthlyCommemorations } from "./monthly-commemorations";
import { MOVABLE_FEASTS, resolveMovableStart } from "./movable-feasts";
import { generateWeeklyFasts, type DateInterval } from "./weekly-fasts";

/**
 * Resolution engine: turns event definitions (the source of truth) into
 * concrete occurrences (`ResolvedEvent`) for a Gregorian year.
 *
 * This is the single place where the Gregorian date of each event is decided,
 * delegating to the specialized modules (conversion, movable feasts, fasts).
 */

/** All known definitions, across all types. */
export function allDefinitions(): CalendarEventDefinition[] {
  return [
    ...FIXED_CULTURAL_EVENTS,
    ...FIXED_ORTHODOX_EVENTS,
    ...MOVABLE_FEASTS,
    ...FASTING_PERIODS,
  ];
}

/**
 * Computes the (Gregorian) start day of a definition for the year, or `null`
 * if the definition is fixed and does not fall in that Gregorian year.
 */
function resolveStart(
  def: CalendarEventDefinition,
  gregorianYear: number,
): GregorianDate | null {
  if (def.movableRule) return resolveMovableStart(def, gregorianYear);
  if (def.ethiopianDate) {
    return resolveEthiopianDateInGregorianYear(
      def.ethiopianDate.month,
      def.ethiopianDate.day,
      gregorianYear,
    );
  }
  if (def.gregorianFixed) {
    return { year: gregorianYear, ...def.gregorianFixed };
  }
  throw new Error(
    `Definition ${def.id} has no ethiopianDate, movableRule, or gregorianFixed.`,
  );
}

/** Stable, deterministic ICS UID (same value across generations). */
export function buildUid(definitionId: string, gregorianYear: number): string {
  return `${definitionId}-${gregorianYear}@ethiopian-calendar-converter`;
}

/**
 * Resolves a definition into a concrete occurrence for the given year, or
 * `null` if a fixed feast does not fall in that Gregorian year (31 Dec/1 Jan
 * boundary case).
 */
export function resolveEvent(
  def: CalendarEventDefinition,
  gregorianYear: number,
): ResolvedEvent | null {
  const start = resolveStart(def, gregorianYear);
  if (!start) return null;
  const end = resolveEndExclusive(def, start, gregorianYear);
  return {
    definitionId: def.id,
    category: def.category,
    title: def.title,
    description: def.description,
    isAllDay: def.isAllDay,
    start,
    end,
    uid: buildUid(def.id, gregorianYear),
  };
}

/** Resolution options. */
export type ResolveOptions = {
  /**
   * Adds the weekly (Wednesday/Friday) fasts to the `fasting` category.
   * Disabled by default (high event volume).
   */
  includeWeeklyFasts?: boolean;
  /**
   * Adds the monthly saint commemorations to the `commemoration` category.
   * Disabled by default (high event volume).
   */
  includeMonthlyCommemorations?: boolean;
};

/** True if the occurrence is a generated weekly fast. */
export function isWeeklyFast(event: ResolvedEvent): boolean {
  return event.definitionId.startsWith("weekly-fast");
}

/**
 * Intervals [start, end) in JDN to subtract from the weekly-fast computation:
 *  - **major fasts** → anti-duplicate (the day is already a fast day);
 *  - **major feasts** (fixed and movable Orthodox) → the Wednesday/Friday fast
 *    is LIFTED when a major feast falls on that day (e.g. Genna, Timkat). Each
 *    feast is a one-day interval.
 */
const WEEKLY_FAST_LIFTING_CATEGORIES: ReadonlySet<CalendarEventCategory> =
  new Set(["fasting", "orthodox_fixed", "orthodox_movable"]);

function weeklyFastExclusions(gregorianYear: number): DateInterval[] {
  return allDefinitions()
    .filter((def) => WEEKLY_FAST_LIFTING_CATEGORIES.has(def.category))
    .map((def) => resolveEvent(def, gregorianYear))
    .filter((ev): ev is ResolvedEvent => ev !== null)
    .map((ev) => ({
      startJdn: gregorianToJDN(ev.start),
      endExclusiveJdn: gregorianToJDN(ev.end),
    }));
}

/**
 * Resolves all events of a set of categories for a Gregorian year, sorted by
 * start date. This is the main entry point used by the ICS generator and the
 * API.
 */
export function resolveEventsForYear(
  gregorianYear: number,
  categories?: CalendarEventCategory[],
  options: ResolveOptions = {},
): ResolvedEvent[] {
  const wanted = categories ? new Set(categories) : null;
  const events = allDefinitions()
    .filter((def) => !wanted || wanted.has(def.category))
    .map((def) => resolveEvent(def, gregorianYear))
    .filter((ev): ev is ResolvedEvent => ev !== null);

  if (options.includeWeeklyFasts && (!wanted || wanted.has("fasting"))) {
    events.push(
      ...generateWeeklyFasts(gregorianYear, weeklyFastExclusions(gregorianYear)),
    );
  }

  if (
    options.includeMonthlyCommemorations &&
    (!wanted || wanted.has("commemoration"))
  ) {
    events.push(...generateMonthlyCommemorations(gregorianYear));
  }

  return events.sort((a, b) => compareDates(a.start, b.start));
}

/**
 * Resolves events over a range of Gregorian years [from, to] (inclusive). Used
 * by the subscribable `.ics` feeds so that the calendar stays populated without
 * having to change the URL each year.
 */
export function resolveEventsForYearRange(
  fromYear: number,
  toYear: number,
  categories?: CalendarEventCategory[],
  options: ResolveOptions = {},
): ResolvedEvent[] {
  const all: ResolvedEvent[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    all.push(...resolveEventsForYear(y, categories, options));
  }
  return all.sort((a, b) => compareDates(a.start, b.start));
}

function compareDates(a: GregorianDate, b: GregorianDate): number {
  return (
    a.year - b.year || a.month - b.month || a.day - b.day
  );
}
