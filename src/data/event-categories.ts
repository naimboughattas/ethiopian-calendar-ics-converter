import type { CalendarEventCategory, LocalizedText } from "@/types/event";

/** Libellés localisés de chaque catégorie. */
export const CATEGORY_LABELS: Record<CalendarEventCategory, LocalizedText> = {
  cultural: { fr: "Culturel", en: "Cultural", am: "ባህላዊ" },
  orthodox_fixed: { fr: "Orthodoxe (fixe)", en: "Orthodox (fixed)", am: "ኦርቶዶክስ" },
  orthodox_movable: { fr: "Orthodoxe (mobile)", en: "Orthodox (movable)", am: "ኦርቶዶክስ" },
  fasting: { fr: "Jeûne", en: "Fasting", am: "ጾም" },
  national: { fr: "National", en: "National", am: "ብሔራዊ" },
  commemoration: { fr: "Commémoration", en: "Commemoration", am: "መታሰቢያ" },
};

/**
 * Flux ICS publics et catégories qu'ils regroupent.
 * `type` est le paramètre accepté par l'API (`?type=`) et le nom de fichier
 * `.ics`. Voir docs/ICS_SPEC.md et docs/ARCHITECTURE.md.
 */
export type FeedType =
  | "all"
  | "ethiopian-orthodox"
  | "ethiopian-cultural"
  | "ethiopian-fasting"
  | "ethiopian-weekly-fasts"
  | "ethiopian-commemorations";

/**
 * Configuration d'un flux : catégories retenues + drapeaux pour le contenu
 * DÉRIVÉ (jeûnes hebdomadaires, commémorations mensuelles), qui n'existe pas
 * sous forme de définitions statiques et n'est produit qu'à la demande.
 */
export type FeedConfig = {
  name: LocalizedText;
  categories: CalendarEventCategory[];
  /** Force la génération des jeûnes hebdomadaires mercredi/vendredi. */
  includeWeeklyFasts?: boolean;
  /** Ne conserve QUE les jeûnes hebdomadaires (flux dédié). */
  weeklyFastsOnly?: boolean;
  /** Force la génération des commémorations mensuelles de saints. */
  includeMonthlyCommemorations?: boolean;
};

export const FEEDS: Record<FeedType, FeedConfig> = {
  all: {
    name: { fr: "Calendrier éthiopien complet", en: "Full Ethiopian calendar" },
    categories: [
      "cultural",
      "national",
      "orthodox_fixed",
      "orthodox_movable",
      "fasting",
      "commemoration",
    ],
  },
  "ethiopian-orthodox": {
    name: { fr: "Rites orthodoxes éthiopiens", en: "Ethiopian Orthodox rites" },
    categories: ["orthodox_fixed", "orthodox_movable", "commemoration"],
  },
  "ethiopian-cultural": {
    name: { fr: "Événements culturels éthiopiens", en: "Ethiopian cultural events" },
    categories: ["cultural", "national"],
  },
  "ethiopian-fasting": {
    name: { fr: "Jeûnes orthodoxes éthiopiens", en: "Ethiopian Orthodox fasts" },
    categories: ["fasting"],
  },
  "ethiopian-weekly-fasts": {
    name: {
      fr: "Jeûnes hebdomadaires (mercredi & vendredi)",
      en: "Weekly fasts (Wednesday & Friday)",
    },
    categories: ["fasting"],
    includeWeeklyFasts: true,
    weeklyFastsOnly: true,
  },
  "ethiopian-commemorations": {
    name: {
      fr: "Commémorations mensuelles des saints",
      en: "Monthly saint commemorations",
    },
    categories: ["commemoration"],
    includeMonthlyCommemorations: true,
  },
};

/** Valide et normalise un `type` de flux venant de la requête. */
export function isFeedType(value: string): value is FeedType {
  return value in FEEDS;
}
