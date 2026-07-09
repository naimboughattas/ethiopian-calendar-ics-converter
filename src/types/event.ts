import type { EthiopianDate, GregorianDate } from "./calendar";

/** Catégories d'événements du calendrier. */
export type CalendarEventCategory =
  | "cultural"
  | "orthodox_fixed"
  | "orthodox_movable"
  | "fasting"
  | "national"
  | "commemoration";

/** Langues supportées (fr/en implémentées, am prévue). */
export type Locale = "fr" | "en" | "am";

/** Chaîne localisée. Le français est requis, les autres langues optionnelles. */
export type LocalizedText = {
  fr: string;
  en: string;
  am?: string;
};

export type LocalizedTextOptional = Partial<LocalizedText>;

/**
 * Manière dont un événement mobile est calculé.
 * Chaque règle est résolue par une fonction pure côté `movable-feasts.ts`.
 */
export type MovableRule =
  | "fasika" // Pâques orthodoxe (comput julien)
  | "hosanna" // Rameaux = Fasika - 7
  | "siklet" // Vendredi Saint = Fasika - 2
  | "trinity_saturday" // Samedi de Lazare/veille — Fasika - 1
  | "nineveh" // Jeûne de Ninive (début) = Fasika - 69
  | "abiy_tsom_start" // Grand Carême (début) = Fasika - 55
  | "debre_zeit" // Mi-Carême = Fasika - 28
  | "rikbe_kahnat" // Fasika - 3
  | "erget" // Ascension = Fasika + 39
  | "peraklitos" // Pentecôte = Fasika + 49
  | "tsome_hawaryat_start"; // Jeûne des Apôtres (début) = Fasika + 50

/**
 * Définition d'un événement — la « source de vérité ».
 *
 * Règle d'or : pour tout événement dont la date dépend du calendrier
 * éthiopien, on stocke `ethiopianDate` (source de vérité) et JAMAIS une date
 * grégorienne codée en dur. La date grégorienne est recalculée pour chaque
 * année via `conversion.ts`.
 */
export type CalendarEventDefinition = {
  /** Identifiant stable et unique (sert de base à l'UID ICS). */
  id: string;
  title: LocalizedText;
  description?: LocalizedTextOptional;
  category: CalendarEventCategory;

  /** Vrai si la date grégorienne change chaque année (fêtes mobiles). */
  isMovable: boolean;
  /** Vrai pour un événement « journée entière » (cas par défaut). */
  isAllDay: boolean;

  /**
   * Date éthiopienne fixe (mois/jour), sans année : la fête se répète chaque
   * année éthiopienne. Utilisée pour les fêtes fixes et culturelles.
   */
  ethiopianDate?: Omit<EthiopianDate, "year">;

  /**
   * Règle de calcul pour une fête mobile (dépend de Fasika).
   * Mutuellement exclusive avec `ethiopianDate`.
   */
  movableRule?: MovableRule;

  /**
   * Date grégorienne fixe (mois/jour) pour les rares jours fériés civils
   * légalement ancrés dans le grégorien (ex. 1er mai). Documenté dans
   * docs/CALENDAR_RULES.md.
   */
  gregorianFixed?: Omit<GregorianDate, "year">;

  /**
   * Durée en jours pour les périodes (jeûnes). 1 = journée unique.
   * L'événement s'étend de la date de début sur `durationDays` jours.
   */
  durationDays?: number;

  /**
   * Date éthiopienne de fin (INCLUSIVE) pour les jeûnes de longueur variable
   * qui se terminent sur une date éthiopienne fixe (ex. jeûne des Apôtres qui
   * s'achève la veille de Pierre-et-Paul). Mutuellement exclusive avec
   * `durationDays`.
   */
  endEthiopianDate?: Omit<EthiopianDate, "year">;

  /** Note libre (hypothèses, limites, sources) — non exportée dans l'ICS. */
  note?: string;
};

/**
 * Occurrence concrète d'un événement pour une année grégorienne donnée :
 * le résultat de la résolution d'une `CalendarEventDefinition`.
 */
export type ResolvedEvent = {
  definitionId: string;
  category: CalendarEventCategory;
  title: LocalizedText;
  description?: LocalizedTextOptional;
  isAllDay: boolean;
  /** Date de début (inclusive). */
  start: GregorianDate;
  /** Date de fin (EXCLUSIVE pour les all-day, convention iCalendar DTEND). */
  end: GregorianDate;
  /** UID ICS stable et déterministe. */
  uid: string;
};
