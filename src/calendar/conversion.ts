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
 * une année grégorienne cible.
 *
 * Subtilité importante : une même date éthiopienne peut tomber dans deux
 * années éthiopiennes chevauchant `gregorianYear`. On teste les deux années
 * éthiopiennes candidates (celle qui a commencé en `gregorianYear - 1` ou en
 * `gregorianYear`) et on retient l'occurrence dont la conversion tombe bien
 * dans `gregorianYear`.
 *
 * Exemple : Genna (Tahsas 29) tombe en janvier ; pour l'année grégorienne
 * 2026 il faut utiliser l'année éthiopienne 2018, pas 2019.
 */
export function resolveEthiopianDateInGregorianYear(
  ethMonth: number,
  ethDay: number,
  gregorianYear: number,
): GregorianDate {
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
  // Ne devrait jamais arriver pour des mois/jours valides.
  throw new Error(
    `Impossible de résoudre ${ethMonth}/${ethDay} dans l'année grégorienne ${gregorianYear}.`,
  );
}
