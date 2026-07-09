/**
 * Types fondamentaux pour les dates et la conversion calendaire.
 *
 * Le calendrier éthiopien (Ge'ez / Amete Mihret) possède 13 mois :
 *  - 12 mois de 30 jours (index 1..12) ;
 *  - un 13e mois, Pagumē (index 13), de 5 jours, ou 6 jours les années bissextiles.
 *
 * Règle de bissextilité éthiopienne : l'année E est bissextile si `E % 4 === 3`.
 * (Voir docs/CALENDAR_RULES.md pour la démonstration complète.)
 */

/** Date exprimée dans le calendrier éthiopien. */
export type EthiopianDate = {
  /** Année de l'ère éthiopienne (Amete Mihret). Optionnelle pour les fêtes fixes récurrentes. */
  year?: number;
  /** Mois 1..13 (13 = Pagumē). */
  month: number;
  /** Jour 1..30 (1..5 ou 1..6 pour Pagumē). */
  day: number;
};

/** Date exprimée dans le calendrier grégorien proleptique. */
export type GregorianDate = {
  year: number;
  /** Mois 1..12. */
  month: number;
  /** Jour 1..31. */
  day: number;
};

/** Les 13 mois éthiopiens, dans l'ordre (index 0 = Meskerem). */
export const ETHIOPIAN_MONTHS = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miyazia",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagume",
] as const;

export type EthiopianMonthName = (typeof ETHIOPIAN_MONTHS)[number];
