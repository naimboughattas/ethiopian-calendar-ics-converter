import type { CalendarEventDefinition } from "@/types/event";

/**
 * Périodes de JEÛNE orthodoxes (Tsome). Ce sont des événements multi-jours.
 *
 * - Longueur fixe → `durationDays`.
 * - Longueur variable se terminant sur une date éthiopienne fixe →
 *   `endEthiopianDate` (inclusive).
 * - Départ mobile (dépend de Fasika) → `movableRule`.
 * - Départ fixe → `ethiopianDate`.
 *
 * Voir docs/ORTHODOX_RITES.md § « Jeûnes ».
 */
export const FASTING_PERIODS: CalendarEventDefinition[] = [
  {
    id: "tsome-nnewe",
    title: {
      fr: "Jeûne de Ninive (Tsome Nnewe)",
      en: "Fast of Nineveh (Tsome Nnewe)",
      am: "ጾመ ነነዌ",
    },
    category: "fasting",
    isMovable: true,
    isAllDay: true,
    movableRule: "nineveh",
    durationDays: 3,
  },
  {
    id: "abiy-tsom",
    title: {
      fr: "Grand Carême (Abiy Tsom / Hudadi)",
      en: "Great Lent (Abiy Tsom / Hudadi)",
      am: "ዓቢይ ጾም",
    },
    description: {
      fr: "Carême de 55 jours incluant la Semaine Sainte, s'achevant à Fasika.",
      en: "55-day Lent including Holy Week, ending at Fasika.",
    },
    category: "fasting",
    isMovable: true,
    isAllDay: true,
    movableRule: "abiy_tsom_start",
    durationDays: 55,
  },
  {
    id: "tsome-hawaryat",
    title: {
      fr: "Jeûne des Apôtres (Tsome Hawaryat)",
      en: "Apostles' Fast (Tsome Hawaryat)",
      am: "ጾመ ሐዋርያት",
    },
    description: {
      fr: "Débute le lundi après la Pentecôte, s'achève la veille de Pierre-et-Paul (Hamle 5). Longueur variable.",
      en: "Begins the Monday after Pentecost, ends the eve of Peter & Paul (Hamle 5). Variable length.",
    },
    category: "fasting",
    isMovable: true,
    isAllDay: true,
    movableRule: "tsome_hawaryat_start",
    endEthiopianDate: { month: 11, day: 4 }, // Hamle 4 (inclusif)
  },
  {
    id: "tsome-filseta",
    title: {
      fr: "Jeûne de Filseta (Dormition de Marie)",
      en: "Filseta Fast (Dormition of Mary)",
      am: "ጾመ ፍልሰታ",
    },
    category: "fasting",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 12, day: 1 }, // Nehase 1
    durationDays: 16, // Nehase 1 → 16 (Filseta)
  },
  {
    id: "tsome-gena",
    title: {
      fr: "Jeûne de l'Avent (Tsome Gena / Sibket)",
      en: "Nativity Fast (Tsome Gena / Advent)",
      am: "ጾመ ገና",
    },
    description: {
      fr: "Jeûne préparatoire à la Nativité, du 15 Hidar au 28 Tahsas.",
      en: "Preparatory fast for the Nativity, from 15 Hidar to 28 Tahsas.",
    },
    category: "fasting",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 3, day: 15 }, // Hidar 15
    endEthiopianDate: { month: 4, day: 28 }, // Tahsas 28 (inclusif)
  },
];
