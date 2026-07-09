import type { EthiopianDate } from "@/types/calendar";
import { ETHIOPIAN_MONTHS } from "@/types/calendar";

/**
 * Fonctions pures pour le calendrier éthiopien (Amete Mihret).
 *
 * EPOCH = Julian Day Number du 1 Meskerem an 1 EC. Constante standard et
 * validée : elle reproduit le Nouvel An éthiopien au 11 septembre grégorien
 * (12 septembre l'année précédant une année bissextile grégorienne).
 * Voir docs/ETHIOPIAN_TO_GREGORIAN_CONVERSION.md.
 */
export const ETHIOPIC_EPOCH_JDN = 1724221;

/**
 * Vrai si l'année éthiopienne `year` est bissextile.
 * Le 13e mois (Pagumē) compte alors 6 jours au lieu de 5.
 * Règle : bissextile ⇔ `year % 4 === 3`.
 */
export function isEthiopianLeapYear(year: number): boolean {
  // En JS, le modulo peut être négatif ; on normalise pour les années < 0.
  return ((year % 4) + 4) % 4 === 3;
}

/** Nombre de jours du mois éthiopien `month` (1..13) pour l'année `year`. */
export function daysInEthiopianMonth(year: number, month: number): number {
  if (month < 1 || month > 13) {
    throw new RangeError(`Mois éthiopien invalide : ${month}`);
  }
  if (month <= 12) return 30;
  return isEthiopianLeapYear(year) ? 6 : 5; // Pagumē
}

/** Nombre de jours de l'année éthiopienne `year` (365 ou 366). */
export function daysInEthiopianYear(year: number): number {
  return isEthiopianLeapYear(year) ? 366 : 365;
}

/** Valide qu'une `EthiopianDate` (avec année) est cohérente. Lève sinon. */
export function assertValidEthiopianDate(date: Required<EthiopianDate>): void {
  const { year, month, day } = date;
  const max = daysInEthiopianMonth(year, month);
  if (day < 1 || day > max) {
    throw new RangeError(
      `Jour invalide ${day} pour ${monthName(month)} ${year} (max ${max}).`,
    );
  }
}

/** Nom translittéré du mois éthiopien `month` (1..13). */
export function monthName(month: number): string {
  const name = ETHIOPIAN_MONTHS[month - 1];
  if (!name) throw new RangeError(`Mois éthiopien invalide : ${month}`);
  return name;
}

/**
 * Convertit une date éthiopienne complète en JDN.
 * Formule : EPOCH + 365*(year-1) + floor(year/4) + 30*(month-1) + (day-1).
 * Le terme floor(year/4) encode les jours bissextiles accumulés.
 */
export function ethiopianToJDN(date: Required<EthiopianDate>): number {
  const { year, month, day } = date;
  return (
    ETHIOPIC_EPOCH_JDN +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    (day - 1)
  );
}

/** Convertit un JDN en date éthiopienne. Inverse exact de `ethiopianToJDN`. */
export function jdnToEthiopian(jdn: number): Required<EthiopianDate> {
  const days = jdn - ETHIOPIC_EPOCH_JDN;
  const year = Math.floor((4 * days + 1463) / 1461);
  const yearStartJdn =
    ETHIOPIC_EPOCH_JDN + 365 * (year - 1) + Math.floor(year / 4);
  const dayOfYear = jdn - yearStartJdn; // 0-indexé
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;
  return { year, month, day };
}
