import type { ResolvedEvent } from "@/types/event";
import { MONTHLY_COMMEMORATIONS } from "@/data/monthly-commemorations";
import { resolveEthiopianDateInGregorianYear } from "./conversion";
import { addDays, toIcsDate } from "./gregorian-date";

/**
 * Génère les commémorations mensuelles pour une année grégorienne.
 *
 * Chaque commémoration récurrente (quantième fixe du mois éthiopien) produit
 * **12 occurrences** — une par mois éthiopien 1..12 (Pagumē exclu). La date
 * grégorienne de chaque occurrence est résolue individuellement.
 *
 * Contenu DÉRIVÉ (non déclaratif), produit uniquement à la demande
 * (`?monthly=true` ou flux dédié) pour ne pas saturer les abonnements.
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
      const end = addDays(start, 1); // DTEND exclusif
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
