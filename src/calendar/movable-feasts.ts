import type { GregorianDate } from "@/types/calendar";
import type { CalendarEventDefinition } from "@/types/event";
import { resolveMovable } from "./orthodox-rules";

/**
 * MOVABLE Orthodox feasts (depending on Fasika). Each feast is defined by a
 * `movableRule` resolved by `orthodox-rules.ts`. This module provides both the
 * definitions and the helper for resolving the start day.
 */
export const MOVABLE_FEASTS: CalendarEventDefinition[] = [
  {
    id: "debre-zeit",
    title: {
      fr: "Debre Zeit (Mi-Carême)",
      en: "Debre Zeit (Mid-Lent)",
      am: "ደብረ ዘይት",
    },
    category: "orthodox_movable",
    isMovable: true,
    isAllDay: true,
    movableRule: "debre_zeit",
  },
  {
    id: "hosanna",
    title: { fr: "Hosanna (Rameaux)", en: "Hosanna (Palm Sunday)", am: "ሆሳዕና" },
    category: "orthodox_movable",
    isMovable: true,
    isAllDay: true,
    movableRule: "hosanna",
  },
  {
    id: "rikbe-kahnat",
    title: {
      fr: "Rikbe Kahnat (Jeudi Saint)",
      en: "Rikbe Kahnat (Maundy Thursday)",
      am: "ጸሎተ ሐሙስ",
    },
    category: "orthodox_movable",
    isMovable: true,
    isAllDay: true,
    movableRule: "rikbe_kahnat",
  },
  {
    id: "siklet",
    title: {
      fr: "Siklet (Vendredi Saint)",
      en: "Siklet (Good Friday)",
      am: "ስቅለት",
    },
    category: "orthodox_movable",
    isMovable: true,
    isAllDay: true,
    movableRule: "siklet",
  },
  {
    id: "fasika",
    title: {
      fr: "Fasika (Pâques orthodoxe)",
      en: "Fasika (Orthodox Easter)",
      am: "ፋሲካ",
    },
    description: {
      fr: "Résurrection du Christ, plus grande fête de l'année liturgique.",
      en: "Resurrection of Christ; the greatest feast of the liturgical year.",
    },
    category: "orthodox_movable",
    isMovable: true,
    isAllDay: true,
    movableRule: "fasika",
  },
  {
    id: "erget",
    title: { fr: "Erget (Ascension)", en: "Erget (Ascension)", am: "ዕርገት" },
    category: "orthodox_movable",
    isMovable: true,
    isAllDay: true,
    movableRule: "erget",
  },
  {
    id: "peraklitos",
    title: {
      fr: "Peraklitos (Pentecôte)",
      en: "Peraklitos (Pentecost)",
      am: "ጰራቅሊጦስ",
    },
    category: "orthodox_movable",
    isMovable: true,
    isAllDay: true,
    movableRule: "peraklitos",
  },
];

/**
 * Resolves the (Gregorian) start day of a movable definition for the year.
 * Throws if the definition has no `movableRule`.
 */
export function resolveMovableStart(
  def: CalendarEventDefinition,
  gregorianYear: number,
): GregorianDate {
  if (!def.movableRule) {
    throw new Error(`Definition ${def.id} has no movableRule.`);
  }
  return resolveMovable(def.movableRule, gregorianYear);
}
