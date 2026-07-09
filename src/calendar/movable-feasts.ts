import type { GregorianDate } from "@/types/calendar";
import type { CalendarEventDefinition } from "@/types/event";
import { resolveMovable } from "./orthodox-rules";

/**
 * Fêtes orthodoxes MOBILES (dépendant de Fasika). Chaque fête est définie par
 * une `movableRule` résolue par `orthodox-rules.ts`. Ce module fournit à la
 * fois les définitions et l'aide à la résolution du jour de début.
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
 * Résout le jour de début (grégorien) d'une définition mobile pour l'année.
 * Lève si la définition n'a pas de `movableRule`.
 */
export function resolveMovableStart(
  def: CalendarEventDefinition,
  gregorianYear: number,
): GregorianDate {
  if (!def.movableRule) {
    throw new Error(`La définition ${def.id} n'a pas de movableRule.`);
  }
  return resolveMovable(def.movableRule, gregorianYear);
}
