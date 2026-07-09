import type { CalendarEventDefinition } from "@/types/event";

/**
 * FIXED Orthodox feasts, expressed as Ethiopian dates (month/day).
 * Source of truth = the Ethiopian date. The Gregorian date is recomputed each
 * year by the resolution engine. See docs/ORTHODOX_RITES.md.
 */
export const FIXED_ORTHODOX_EVENTS: CalendarEventDefinition[] = [
  {
    id: "meskel",
    title: {
      fr: "Meskel (Invention de la Sainte Croix)",
      en: "Meskel (Finding of the True Cross)",
      am: "መስቀል",
    },
    description: {
      fr: "Célébration de la découverte de la Vraie Croix. Veille : Demera (bûcher).",
      en: "Commemorates the finding of the True Cross. Eve: Demera bonfire.",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 1, day: 17 }, // Meskerem 17
  },
  {
    id: "demera",
    title: {
      fr: "Demera (veille de Meskel)",
      en: "Demera (Meskel Eve)",
      am: "ደመራ",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 1, day: 16 }, // Meskerem 16
  },
  {
    id: "gabriel-kulubi",
    title: {
      fr: "Saint Gabriel (Kulubi Gabriel)",
      en: "Archangel Gabriel (Kulubi Gabriel)",
      am: "ቅዱስ ገብርኤል",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 4, day: 19 }, // Tahsas 19
  },
  {
    id: "genna",
    title: {
      fr: "Genna (Nativité / Noël éthiopien)",
      en: "Genna (Ethiopian Christmas / Nativity)",
      am: "ገና",
    },
    description: {
      fr: "Nativité du Christ (Lidet). Correspond au 25 décembre julien.",
      en: "Nativity of Christ (Lidet). Corresponds to 25 December (Julian).",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 4, day: 29 }, // Tahsas 29
  },
  {
    id: "ketera",
    title: {
      fr: "Ketera (veille de Timkat)",
      en: "Ketera (Timkat Eve)",
      am: "ከተራ",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 5, day: 10 }, // Tir 10
  },
  {
    id: "timkat",
    title: {
      fr: "Timkat (Épiphanie / Baptême du Christ)",
      en: "Timkat (Epiphany / Baptism of Christ)",
      am: "ጥምቀት",
    },
    description: {
      fr: "Baptême du Christ dans le Jourdain, l'une des plus grandes fêtes.",
      en: "Baptism of Christ in the Jordan; one of the greatest feasts.",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 5, day: 11 }, // Tir 11
  },
  {
    id: "cana-mikael",
    title: {
      fr: "Cana de Galilée / Saint Michel",
      en: "Cana of Galilee / Archangel Michael",
      am: "ቃና ዘገሊላ",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 5, day: 12 }, // Tir 12
  },
  {
    id: "hidar-tsion",
    title: {
      fr: "Sainte Marie de Sion (Hidar Tsion)",
      en: "St Mary of Zion (Hidar Tsion)",
      am: "ኅዳር ጽዮን",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 3, day: 21 }, // Hidar 21
  },
  {
    id: "buhe",
    title: {
      fr: "Buhe (Transfiguration / Debre Tabor)",
      en: "Buhe (Transfiguration / Debre Tabor)",
      am: "ቡሄ",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 12, day: 13 }, // Nehase 13
  },
  {
    id: "filseta",
    title: {
      fr: "Filseta (Assomption de la Vierge Marie)",
      en: "Filseta (Assumption of the Virgin Mary)",
      am: "ፍልሰታ",
    },
    category: "orthodox_fixed",
    isMovable: false,
    isAllDay: true,
    ethiopianDate: { month: 12, day: 16 }, // Nehase 16
  },
];
