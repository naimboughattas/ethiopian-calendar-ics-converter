import type { CalendarEventCategory, LocalizedText } from "@/types/event";

/** Localized labels for each category. */
export const CATEGORY_LABELS: Record<CalendarEventCategory, LocalizedText> = {
  cultural: { fr: "Culturel", en: "Cultural", am: "ባህላዊ" },
  orthodox_fixed: { fr: "Orthodoxe (fixe)", en: "Orthodox (fixed)", am: "ኦርቶዶክስ" },
  orthodox_movable: { fr: "Orthodoxe (mobile)", en: "Orthodox (movable)", am: "ኦርቶዶክስ" },
  fasting: { fr: "Jeûne", en: "Fasting", am: "ጾም" },
  national: { fr: "National", en: "National", am: "ብሔራዊ" },
  commemoration: { fr: "Commémoration", en: "Commemoration", am: "መታሰቢያ" },
};

/**
 * Public ICS feeds and the categories they group.
 * `type` is the parameter accepted by the API (`?type=`) and the `.ics` file
 * name. See docs/ICS_SPEC.md and docs/ARCHITECTURE.md.
 */
export type FeedType =
  | "all"
  | "ethiopian-orthodox"
  | "ethiopian-cultural"
  | "ethiopian-fasting"
  | "ethiopian-weekly-fasts"
  | "ethiopian-commemorations";

/**
 * Feed configuration: selected categories + flags for the DERIVED content
 * (weekly fasts, monthly commemorations), which does not exist as static
 * definitions and is produced only on request.
 */
export type FeedConfig = {
  name: LocalizedText;
  categories: CalendarEventCategory[];
  /** Forces generation of the weekly Wednesday/Friday fasts. */
  includeWeeklyFasts?: boolean;
  /** Keeps ONLY the weekly fasts (dedicated feed). */
  weeklyFastsOnly?: boolean;
  /** Forces generation of the monthly saint commemorations. */
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

/** Validates and narrows a feed `type` coming from the request. */
export function isFeedType(value: string): value is FeedType {
  return value in FEEDS;
}
