import type { ResolvedEvent } from "@/types/event";
import { MONTHLY_COMMEMORATIONS } from "@/data/monthly-commemorations";
import { resolveEthiopianDateInGregorianYear } from "./conversion";
import { addDays, toIcsDate } from "./gregorian-date";

/**
 * Generates the monthly commemorations for a Gregorian year.
 *
 * Each recurring commemoration (fixed day-of-month in the Ethiopian calendar)
 * produces **12 occurrences** — one per Ethiopian month 1..12 (Pagumē
 * excluded). The Gregorian date of each occurrence is resolved individually.
 *
 * DERIVED content (not declarative), produced only on request (`?monthly=true`
 * or a dedicated feed) so as not to flood subscriptions.
 */
export function generateMonthlyCommemorations(
  gregorianYear: number,
): ResolvedEvent[] {
  const events: ResolvedEvent[] = [];

  for (const commemoration of MONTHLY_COMMEMORATIONS) {
    for (let month = 1; month <= 12; month++) {
      const start = resolveEthiopianDateInGregorianYear(
        month,
        commemoration.day,
        gregorianYear,
      );
      // The Ethiopian date may skip this Gregorian year (31 Dec/1 Jan boundary
      // case): we skip it here, it appears in the adjacent year.
      if (!start) continue;
      const end = addDays(start, 1); // exclusive DTEND
      const definitionId = `monthly-${commemoration.id}`;

      events.push({
        definitionId,
        category: "commemoration",
        title: commemoration.title,
        description: commemoration.description,
        isAllDay: true,
        start,
        end,
        uid: `${definitionId}-${toIcsDate(start)}@ethiopian-calendar-converter`,
      });
    }
  }

  return events;
}
