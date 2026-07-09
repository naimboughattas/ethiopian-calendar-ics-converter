import type { CalendarEventDefinition } from "@/types/event";

/**
 * CULTURAL and NATIONAL events.
 *
 * - Feasts anchored in the Ethiopian calendar use `ethiopianDate` (recomputed
 *   each year).
 * - Some civil holidays are legally fixed in the Gregorian calendar by the
 *   Ethiopian state (1 May, 5 May, 28 May): they use `gregorianFixed`. See
 *   docs/CALENDAR_RULES.md § "Civil holidays".
 */
export const FIXED_CULTURAL_EVENTS: CalendarEventDefinition[] = [
  {
    id: "enkutatash",
    title: {
      fr: "Enkutatash (Nouvel An éthiopien)",
      en: "Enkutatash (Ethiopian New Year)",
      am: "እንቁጣጣሽ",
    },
    description: {
      fr: "Premier jour de l'an éthiopien (1 Meskerem). Fête de Saint Jean-Baptiste (Kidus Yohannes).",
      en: "First day of the Ethiopian year (1 Meskerem). Feast of St John the Baptist.",
    },
    category: "cultural",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 1, day: 1 }, // Meskerem 1
  },
  {
    id: "adwa-victory",
    title: {
      fr: "Victoire d'Adwa",
      en: "Victory of Adwa",
      am: "የዐድዋ ድል በዓል",
    },
    description: {
      fr: "Commémoration de la victoire d'Adwa (1896). Tombe autour du 1er-2 mars grégorien.",
      en: "Commemorates the 1896 Battle of Adwa. Falls around 1–2 March.",
    },
    category: "national",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 6, day: 23 }, // Yekatit 23
    note: "National holiday expressed as an Ethiopian date; the civil observance is 2 March Gregorian.",
  },
  {
    id: "ashenda",
    title: {
      fr: "Ashenda / Ashendye",
      en: "Ashenda / Ashendye",
      am: "አሸንዳ",
    },
    description: {
      fr: "Festival féminin du nord de l'Éthiopie, après le jeûne de Filseta.",
      en: "Women's festival of northern Ethiopia, following the Filseta fast.",
    },
    category: "cultural",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 12, day: 16 }, // Nehase 16
  },
  {
    id: "labour-day",
    title: {
      fr: "Fête internationale du Travail",
      en: "International Labour Day",
      am: "የላብ ቀን",
    },
    category: "national",
    isMovable: false,
    isAllDay: true,
    gregorianFixed: { month: 5, day: 1 },
    note: "Civil holiday legally fixed to 1 May Gregorian.",
  },
  {
    id: "patriots-victory-day",
    title: {
      fr: "Journée des Patriotes",
      en: "Patriots' Victory Day",
      am: "የአርበኞች ቀን",
    },
    category: "national",
    isMovable: false,
    isAllDay: true,
    gregorianFixed: { month: 5, day: 5 },
    note: "Civil holiday legally fixed to 5 May Gregorian.",
  },
  {
    id: "derg-downfall-day",
    title: {
      fr: "Chute du Derg",
      en: "Downfall of the Derg",
      am: "ደርግ የወደቀበት ቀን",
    },
    category: "national",
    isMovable: false,
    isAllDay: true,
    gregorianFixed: { month: 5, day: 28 },
    note: "Civil holiday legally fixed to 28 May Gregorian.",
  },
];
