import type { GregorianDate } from "@/types/calendar";
import type { MovableRule } from "@/types/event";
import { addDays, jdnToGregorian } from "./gregorian-date";

/**
 * Règles du calendrier liturgique orthodoxe éthiopien (Tewahedo).
 *
 * L'Église orthodoxe éthiopienne calcule Fasika (Pâques) selon le comput
 * pascal orthodoxe (base julienne), comme l'ensemble des Églises orthodoxes.
 * Toutes les autres fêtes mobiles se déduisent de Fasika par un simple décalage
 * en jours. Voir docs/ORTHODOX_RITES.md et docs/CALENDAR_RULES.md.
 */

/** Convertit une date du calendrier julien en JDN. */
function julianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    32083
  );
}

/**
 * Date grégorienne de Fasika (Pâques orthodoxe) pour une année grégorienne.
 * Algorithme de Meeus (comput julien), puis conversion julien → grégorien.
 */
export function fasikaGregorian(gregorianYear: number): GregorianDate {
  const year = gregorianYear;
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const f = d + e + 114;
  const month = Math.floor(f / 31); // 3 = mars, 4 = avril (julien)
  const day = (f % 31) + 1;
  // Date julienne de Pâques → JDN → grégorien.
  return jdnToGregorian(julianToJDN(year, month, day));
}

/**
 * Décalage (en jours) de chaque fête mobile par rapport à Fasika.
 * Négatif = avant Fasika, positif = après.
 */
export const MOVABLE_OFFSETS_FROM_FASIKA: Record<MovableRule, number> = {
  nineveh: -69, // Jeûne de Ninive (lundi)
  abiy_tsom_start: -55, // Grand Carême / Hudadi (lundi)
  debre_zeit: -28, // Mi-Carême (dimanche des Rameaux du Mont des Oliviers)
  hosanna: -7, // Rameaux (dimanche)
  rikbe_kahnat: -3, // Jeudi saint (Rikbe Kahnat)
  siklet: -2, // Vendredi Saint (Crucifixion)
  trinity_saturday: -1, // Samedi Saint (veille de Fasika)
  fasika: 0, // Pâques (dimanche)
  erget: 39, // Ascension (jeudi)
  peraklitos: 49, // Pentecôte (Paraclet, dimanche)
  tsome_hawaryat_start: 50, // Jeûne des Apôtres (lundi après Pentecôte)
};

/** Résout une fête mobile en date grégorienne pour l'année donnée. */
export function resolveMovable(
  rule: MovableRule,
  gregorianYear: number,
): GregorianDate {
  const fasika = fasikaGregorian(gregorianYear);
  return addDays(fasika, MOVABLE_OFFSETS_FROM_FASIKA[rule]);
}
