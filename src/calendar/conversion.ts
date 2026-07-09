import type { EthiopianDate, GregorianDate } from "@/types/calendar";
import {
  assertValidEthiopianDate,
  ethiopianToJDN,
  jdnToEthiopian,
} from "./ethiopian-date";
import { gregorianToJDN, jdnToGregorian } from "./gregorian-date";

/**
 * Conversions calendaires éthiopien ↔ grégorien.
 *
 * Toutes les fonctions sont pures et passent par le Julian Day Number (JDN)
 * comme représentation pivot. Voir docs/ETHIOPIAN_TO_GREGORIAN_CONVERSION.md.
 */

/** Éthiopien → grégorien. */
export function ethiopianToGregorian(
  date: Required<EthiopianDate>,
): GregorianDate {
  assertValidEthiopianDate(date);
  return jdnToGregorian(ethiopianToJDN(date));
}

/** Grégorien → éthiopien. */
export function gregorianToEthiopian(
  date: GregorianDate,
): Required<EthiopianDate> {
  return jdnToEthiopian(gregorianToJDN(date));
}

/**
 * Résout une fête fixe (mois/jour éthiopiens) vers sa date grégorienne dans
 * une année grégorienne cible, ou `null` si elle n'y tombe pas.
 *
 * Une date éthiopienne récurrente tombe **0 ou 1** fois par année grégorienne
 * (jamais 2 : l'écart entre deux occurrences vaut la longueur de l'année
 * éthiopienne, ≥ 365 jours). Le cas **0** est réel : une date proche du
 * 31 décembre / 1er janvier peut, selon la dérive des années bissextiles,
 * tomber le 31 déc. d'une année puis le 1er jan. de l'année suivante, sautant
 * ainsi l'année grégorienne intermédiaire. On renvoie alors `null` (l'appelant
 * ignore l'occurrence ; elle apparaît dans l'année grégorienne adjacente).
 *
 * On teste les deux années éthiopiennes candidates (celle débutant en
 * `gregorianYear - 8` ou `- 7`) et on retient celle dont la conversion tombe
 * dans `gregorianYear`.
 *
 * Exemple : Genna (Tahsas 29) tombe en janvier ; pour l'année grégorienne
 * 2026 il faut utiliser l'année éthiopienne 2018, pas 2019.
 */
export function resolveEthiopianDateInGregorianYear(
  ethMonth: number,
  ethDay: number,
  gregorianYear: number,
): GregorianDate | null {
  // L'année éthiopienne courante au 1er janvier de `gregorianYear` vaut
  // environ gregorianYear - 8 ; celle qui débute en septembre vaut ~ -7.
  const candidates = [gregorianYear - 8, gregorianYear - 7];
  for (const ethYear of candidates) {
    const greg = ethiopianToGregorian({
      year: ethYear,
      month: ethMonth,
      day: ethDay,
    });
    if (greg.year === gregorianYear) return greg;
  }
  return null; // la date éthiopienne ne tombe pas dans cette année grégorienne
}
