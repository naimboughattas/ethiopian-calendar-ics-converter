import type { GregorianDate } from "@/types/calendar";

/**
 * Fonctions pures pour le calendrier grégorien proleptique, basées sur le
 * Julian Day Number (JDN). Le JDN est un entier qui compte les jours de façon
 * continue : il sert de « langage commun » entre les calendriers.
 *
 * Algorithmes classiques (Fliegel & Van Flandern). Toutes les fonctions sont
 * pures et sans effet de bord.
 */

/** Vrai si `year` est bissextile dans le calendrier grégorien. */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Convertit une date grégorienne (année, mois 1-12, jour) en JDN. */
export function gregorianToJDN(date: GregorianDate): number {
  const { year, month, day } = date;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Convertit un JDN en date grégorienne. */
export function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

/** Ajoute `days` (peut être négatif) à une date grégorienne. */
export function addDays(date: GregorianDate, days: number): GregorianDate {
  return jdnToGregorian(gregorianToJDN(date) + days);
}

/**
 * Jour de la semaine d'un JDN : 0 = lundi … 6 = dimanche.
 * (JDN 2451545 = samedi 1er janvier 2000 → reste 5.)
 */
export function dayOfWeek(jdn: number): number {
  return ((jdn % 7) + 7) % 7;
}

/** Formate en `YYYYMMDD` (format DATE iCalendar pour les événements all-day). */
export function toIcsDate(date: GregorianDate): string {
  const y = String(date.year).padStart(4, "0");
  const m = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  return `${y}${m}${d}`;
}
