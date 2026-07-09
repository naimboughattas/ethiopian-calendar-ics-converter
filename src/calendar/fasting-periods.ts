import type { GregorianDate } from "@/types/calendar";
import type { CalendarEventDefinition } from "@/types/event";
import { resolveEthiopianDateInGregorianYear } from "./conversion";
import { addDays, gregorianToJDN } from "./gregorian-date";

/**
 * Calcule la date de fin EXCLUSIVE (convention DTEND iCalendar) d'un événement,
 * à partir de sa date de début grégorienne et de sa définition.
 *
 * - `durationDays` : l'événement couvre N jours → fin = début + N.
 * - `endEthiopianDate` : dernier jour INCLUSIF exprimé en date éthiopienne →
 *   fin exclusive = (jour éthiopien résolu) + 1.
 * - sinon : événement d'une seule journée → fin = début + 1.
 */
export function resolveEndExclusive(
  def: CalendarEventDefinition,
  start: GregorianDate,
  gregorianYear: number,
): GregorianDate {
  if (def.durationDays !== undefined) {
    return addDays(start, def.durationDays);
  }

  if (def.endEthiopianDate) {
    const { month, day } = def.endEthiopianDate;
    // La date de fin peut tomber dans l'année grégorienne du début ou la
    // suivante (jeûne à cheval sur le Nouvel An grégorien). On choisit la
    // première résolution postérieure ou égale au début. `null` (date qui
    // saute une année grégorienne) est ignoré.
    const candidates = [gregorianYear, gregorianYear + 1]
      .map((y) => resolveEthiopianDateInGregorianYear(month, day, y))
      .filter((d): d is GregorianDate => d !== null);
    const startJdn = gregorianToJDN(start);
    for (const c of candidates) {
      if (gregorianToJDN(c) >= startJdn) return addDays(c, 1); // +1 → exclusif
    }
    throw new Error(
      `Date de fin ${month}/${day} introuvable après le début pour ${def.id}.`,
    );
  }

  return addDays(start, 1);
}
