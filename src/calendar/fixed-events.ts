import type { GregorianDate } from "@/types/calendar";
import type {
  CalendarEventCategory,
  CalendarEventDefinition,
  ResolvedEvent,
} from "@/types/event";
import { FIXED_CULTURAL_EVENTS } from "@/data/fixed-cultural-events";
import { FIXED_ORTHODOX_EVENTS } from "@/data/fixed-orthodox-events";
import { FASTING_PERIODS } from "@/data/fasting-periods";
import { resolveEthiopianDateInGregorianYear } from "./conversion";
import { resolveEndExclusive } from "./fasting-periods";
import { gregorianToJDN } from "./gregorian-date";
import { generateMonthlyCommemorations } from "./monthly-commemorations";
import { MOVABLE_FEASTS, resolveMovableStart } from "./movable-feasts";
import { generateWeeklyFasts, type DateInterval } from "./weekly-fasts";

/**
 * Moteur de résolution : transforme les définitions d'événements (source de
 * vérité) en occurrences concrètes (`ResolvedEvent`) pour une année grégorienne.
 *
 * C'est l'unique endroit où l'on décide de la date grégorienne de chaque
 * événement, en déléguant aux modules spécialisés (conversion, mobiles, jeûnes).
 */

/** Toutes les définitions connues, tous types confondus. */
export function allDefinitions(): CalendarEventDefinition[] {
  return [
    ...FIXED_CULTURAL_EVENTS,
    ...FIXED_ORTHODOX_EVENTS,
    ...MOVABLE_FEASTS,
    ...FASTING_PERIODS,
  ];
}

/** Calcule le jour de début (grégorien) d'une définition pour l'année. */
function resolveStart(
  def: CalendarEventDefinition,
  gregorianYear: number,
): GregorianDate {
  if (def.movableRule) return resolveMovableStart(def, gregorianYear);
  if (def.ethiopianDate) {
    return resolveEthiopianDateInGregorianYear(
      def.ethiopianDate.month,
      def.ethiopianDate.day,
      gregorianYear,
    );
  }
  if (def.gregorianFixed) {
    return { year: gregorianYear, ...def.gregorianFixed };
  }
  throw new Error(
    `La définition ${def.id} n'a ni ethiopianDate, ni movableRule, ni gregorianFixed.`,
  );
}

/** UID ICS stable et déterministe (même valeur d'une génération à l'autre). */
export function buildUid(definitionId: string, gregorianYear: number): string {
  return `${definitionId}-${gregorianYear}@ethiopian-calendar-converter`;
}

/** Résout une définition en occurrence concrète pour l'année donnée. */
export function resolveEvent(
  def: CalendarEventDefinition,
  gregorianYear: number,
): ResolvedEvent {
  const start = resolveStart(def, gregorianYear);
  const end = resolveEndExclusive(def, start, gregorianYear);
  return {
    definitionId: def.id,
    category: def.category,
    title: def.title,
    description: def.description,
    isAllDay: def.isAllDay,
    start,
    end,
    uid: buildUid(def.id, gregorianYear),
  };
}

/** Options de résolution. */
export type ResolveOptions = {
  /**
   * Ajoute les jeûnes hebdomadaires (mercredi/vendredi) à la catégorie
   * `fasting`. Désactivé par défaut (volume d'événements élevé).
   */
  includeWeeklyFasts?: boolean;
  /**
   * Ajoute les commémorations mensuelles de saints à la catégorie
   * `commemoration`. Désactivé par défaut (volume d'événements élevé).
   */
  includeMonthlyCommemorations?: boolean;
};

/** Vrai si l'occurrence est un jeûne hebdomadaire généré. */
export function isWeeklyFast(event: ResolvedEvent): boolean {
  return event.definitionId.startsWith("weekly-fast");
}

/**
 * Intervalles [début, fin) en JDN à retrancher du calcul des jeûnes
 * hebdomadaires :
 *  - **grands jeûnes** → anti-doublon (le jour est déjà jeûné) ;
 *  - **fêtes majeures** (orthodoxes fixes et mobiles) → le jeûne du mercredi/
 *    vendredi est LEVÉ lorsqu'une grande fête tombe ce jour-là (ex. Genna,
 *    Timkat). Chaque fête est un intervalle d'un jour.
 */
const WEEKLY_FAST_LIFTING_CATEGORIES: ReadonlySet<CalendarEventCategory> =
  new Set(["fasting", "orthodox_fixed", "orthodox_movable"]);

function weeklyFastExclusions(gregorianYear: number): DateInterval[] {
  return allDefinitions()
    .filter((def) => WEEKLY_FAST_LIFTING_CATEGORIES.has(def.category))
    .map((def) => resolveEvent(def, gregorianYear))
    .map((ev) => ({
      startJdn: gregorianToJDN(ev.start),
      endExclusiveJdn: gregorianToJDN(ev.end),
    }));
}

/**
 * Résout tous les événements d'un ensemble de catégories pour une année
 * grégorienne, triés par date de début. C'est l'entrée principale utilisée
 * par le générateur ICS et l'API.
 */
export function resolveEventsForYear(
  gregorianYear: number,
  categories?: CalendarEventCategory[],
  options: ResolveOptions = {},
): ResolvedEvent[] {
  const wanted = categories ? new Set(categories) : null;
  const events = allDefinitions()
    .filter((def) => !wanted || wanted.has(def.category))
    .map((def) => resolveEvent(def, gregorianYear));

  if (options.includeWeeklyFasts && (!wanted || wanted.has("fasting"))) {
    events.push(
      ...generateWeeklyFasts(gregorianYear, weeklyFastExclusions(gregorianYear)),
    );
  }

  if (
    options.includeMonthlyCommemorations &&
    (!wanted || wanted.has("commemoration"))
  ) {
    events.push(...generateMonthlyCommemorations(gregorianYear));
  }

  return events.sort((a, b) => compareDates(a.start, b.start));
}

/**
 * Résout les événements sur une plage d'années grégoriennes [from, to]
 * (inclusives). Utilisé par les flux `.ics` abonnables, afin que le calendrier
 * reste alimenté sans devoir changer d'URL chaque année.
 */
export function resolveEventsForYearRange(
  fromYear: number,
  toYear: number,
  categories?: CalendarEventCategory[],
  options: ResolveOptions = {},
): ResolvedEvent[] {
  const all: ResolvedEvent[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    all.push(...resolveEventsForYear(y, categories, options));
  }
  return all.sort((a, b) => compareDates(a.start, b.start));
}

function compareDates(a: GregorianDate, b: GregorianDate): number {
  return (
    a.year - b.year || a.month - b.month || a.day - b.day
  );
}
