import type { LocalizedText, ResolvedEvent } from "@/types/event";
import {
  dayOfWeek,
  gregorianToJDN,
  jdnToGregorian,
  toIcsDate,
} from "./gregorian-date";
import { fasikaGregorian } from "./orthodox-rules";

/**
 * Weekly Wednesday and Friday fasts (Tsome Reboue / Tsome Arb).
 *
 * In the Orthodox Tewahedo tradition, Wednesday and Friday are fasting days all
 * year, EXCEPT:
 *   1. the 50 paschal days, from Fasika to Pentecost inclusive (a joyous,
 *      fast-free period);
 *   2. days already covered by a major fast (Lent, Advent, etc.) — we exclude
 *      them to avoid duplicates; those days remain fasting days under the
 *      corresponding major period.
 *
 * These events are DERIVED (not declarative): they depend on the day of week
 * and the paschal computus. They are produced only on explicit request
 * (`?weekly=true`) so as not to flood subscriptions.
 *
 * Assumption (see docs/CALENDAR_RULES.md §7): only the 50-day paschal period is
 * treated as a fast-free window. Other brief regional exemptions are not
 * modeled.
 */

const WEDNESDAY = 2;
const FRIDAY = 4;
const PASCHAL_FREE_DAYS = 49; // Fasika (D0) → Pentecost (D+49) inclusive

/** Interval of days in JDN, `endExclusiveJdn` not included. */
export type DateInterval = { startJdn: number; endExclusiveJdn: number };

const WEDNESDAY_TITLE: LocalizedText = {
  fr: "Jeûne du mercredi",
  en: "Wednesday fast",
  am: "የረቡዕ ጾም",
};

const FRIDAY_TITLE: LocalizedText = {
  fr: "Jeûne du vendredi",
  en: "Friday fast",
  am: "የዓርብ ጾም",
};

/**
 * Generates the weekly (Wednesday/Friday) fasts of a Gregorian year, excluding
 * the paschal window and the provided intervals (major fasts). `excluded` must
 * contain the major fasts already resolved for the year.
 */
export function generateWeeklyFasts(
  gregorianYear: number,
  excluded: DateInterval[],
): ResolvedEvent[] {
  const events: ResolvedEvent[] = [];

  const fasikaJdn = gregorianToJDN(fasikaGregorian(gregorianYear));
  const paschalFreeStart = fasikaJdn;
  const paschalFreeEnd = fasikaJdn + PASCHAL_FREE_DAYS; // inclusive

  const yearStart = gregorianToJDN({ year: gregorianYear, month: 1, day: 1 });
  const yearEnd = gregorianToJDN({ year: gregorianYear, month: 12, day: 31 });

  for (let jdn = yearStart; jdn <= yearEnd; jdn++) {
    const dow = dayOfWeek(jdn);
    if (dow !== WEDNESDAY && dow !== FRIDAY) continue;

    // 1. Fast-free paschal window.
    if (jdn >= paschalFreeStart && jdn <= paschalFreeEnd) continue;

    // 2. Day already within a major fast → no duplicate.
    if (excluded.some((iv) => jdn >= iv.startJdn && jdn < iv.endExclusiveJdn)) {
      continue;
    }

    const isWednesday = dow === WEDNESDAY;
    const start = jdnToGregorian(jdn);
    const end = jdnToGregorian(jdn + 1); // exclusive DTEND
    const definitionId = isWednesday ? "weekly-fast-wed" : "weekly-fast-fri";

    events.push({
      definitionId,
      category: "fasting",
      title: isWednesday ? WEDNESDAY_TITLE : FRIDAY_TITLE,
      isAllDay: true,
      start,
      end,
      uid: `${definitionId}-${toIcsDate(start)}@ethiopian-calendar-converter`,
    });
  }

  return events;
}
