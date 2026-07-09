import type { LocalizedText, ResolvedEvent } from "@/types/event";
import {
  dayOfWeek,
  gregorianToJDN,
  jdnToGregorian,
  toIcsDate,
} from "./gregorian-date";
import { fasikaGregorian } from "./orthodox-rules";

/**
 * Jeûnes hebdomadaires du mercredi et du vendredi (Tsome Reboue / Tsome Arb).
 *
 * Dans la tradition orthodoxe Tewahedo, mercredi et vendredi sont jours de
 * jeûne toute l'année, SAUF :
 *   1. les 50 jours pascals, de Fasika à la Pentecôte inclus (période de joie
 *      sans jeûne) ;
 *   2. les jours déjà couverts par un grand jeûne (Carême, Avent, etc.) — on
 *      les exclut pour ne pas générer de doublons ; ces jours restent jeûnés au
 *      titre de la période majeure correspondante.
 *
 * Ces événements sont DÉRIVÉS (non déclaratifs) : ils dépendent du jour de la
 * semaine et du comput pascal. Ils ne sont produits que sur demande explicite
 * (`?weekly=true`) pour ne pas saturer les abonnements.
 *
 * Hypothèse (voir docs/CALENDAR_RULES.md §7) : seule la période pascale des 50
 * jours est traitée comme fenêtre sans jeûne. D'autres brèves exemptions
 * régionales ne sont pas modélisées.
 */

const WEDNESDAY = 2;
const FRIDAY = 4;
const PASCHAL_FREE_DAYS = 49; // Fasika (J0) → Pentecôte (J+49) inclus

/** Intervalle de jours en JDN, `endExclusiveJdn` non inclus. */
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
 * Génère les jeûnes hebdomadaires (mercredi/vendredi) d'une année grégorienne,
 * en excluant la fenêtre pascale et les intervalles fournis (grands jeûnes).
 * `excluded` doit contenir les grands jeûnes déjà résolus pour l'année.
 */
export function generateWeeklyFasts(
  gregorianYear: number,
  excluded: DateInterval[],
): ResolvedEvent[] {
  const events: ResolvedEvent[] = [];

  const fasikaJdn = gregorianToJDN(fasikaGregorian(gregorianYear));
  const paschalFreeStart = fasikaJdn;
  const paschalFreeEnd = fasikaJdn + PASCHAL_FREE_DAYS; // inclus

  const yearStart = gregorianToJDN({ year: gregorianYear, month: 1, day: 1 });
  const yearEnd = gregorianToJDN({ year: gregorianYear, month: 12, day: 31 });

  for (let jdn = yearStart; jdn <= yearEnd; jdn++) {
    const dow = dayOfWeek(jdn);
    if (dow !== WEDNESDAY && dow !== FRIDAY) continue;

    // 1. Fenêtre pascale sans jeûne.
    if (jdn >= paschalFreeStart && jdn <= paschalFreeEnd) continue;

    // 2. Jour déjà dans un grand jeûne → pas de doublon.
    if (excluded.some((iv) => jdn >= iv.startJdn && jdn < iv.endExclusiveJdn)) {
      continue;
    }

    const isWednesday = dow === WEDNESDAY;
    const start = jdnToGregorian(jdn);
    const end = jdnToGregorian(jdn + 1); // DTEND exclusif
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
