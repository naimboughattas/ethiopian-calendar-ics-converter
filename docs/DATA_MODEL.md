# Modèle de données

Types dans `src/types/`. Le modèle sépare la **définition** (intemporelle,
source de vérité) de l'**occurrence résolue** (datée pour une année grégorienne).

## Types calendaires (`types/calendar.ts`)

```ts
type EthiopianDate = { year?: number; month: number; day: number };
type GregorianDate = { year: number; month: number; day: number };
```

`ETHIOPIAN_MONTHS` : les 13 noms translittérés (Meskerem … Pagume).

## Catégories et i18n (`types/event.ts`)

```ts
type CalendarEventCategory =
  | "cultural" | "orthodox_fixed" | "orthodox_movable"
  | "fasting" | "national" | "commemoration";

type Locale = "fr" | "en" | "am";
type LocalizedText = { fr: string; en: string; am?: string }; // fr requis
```

## Définition d'événement — source de vérité

```ts
type CalendarEventDefinition = {
  id: string;                       // stable → base de l'UID
  title: LocalizedText;
  description?: Partial<LocalizedText>;
  category: CalendarEventCategory;
  isMovable: boolean;
  isAllDay: boolean;

  // Un seul mode de départ parmi :
  ethiopianDate?: { month; day };   // fête fixe (recalculée par année)
  movableRule?: MovableRule;        // fête mobile (dépend de Fasika)
  gregorianFixed?: { month; day };  // jour férié civil grégorien

  // Durée (jeûnes) : l'un ou l'autre
  durationDays?: number;            // longueur fixe
  endEthiopianDate?: { month; day };// fin variable sur date éthiopienne fixe

  note?: string;                    // hypothèses/sources (non exporté ICS)
};
```

**Règle d'exclusivité** : `ethiopianDate`, `movableRule`, `gregorianFixed` sont
mutuellement exclusifs (un seul mode de départ). De même `durationDays` vs
`endEthiopianDate`.

## Occurrence résolue

```ts
type ResolvedEvent = {
  definitionId: string;
  category: CalendarEventCategory;
  title: LocalizedText;
  description?: Partial<LocalizedText>;
  isAllDay: boolean;
  start: GregorianDate;   // inclusive
  end: GregorianDate;     // EXCLUSIVE (convention DTEND)
  uid: string;            // `<id>-<année>@ethiopian-calendar-converter`
};
```

## Règles de calcul de dépendances

| Champ | Résolu par |
|---|---|
| `ethiopianDate` | `conversion.resolveEthiopianDateInGregorianYear` |
| `movableRule` | `orthodox-rules.resolveMovable` (base Fasika) |
| `gregorianFixed` | direct (année + mois/jour) |
| `durationDays` / `endEthiopianDate` | `fasting-periods.resolveEndExclusive` |

## Flux (`data/event-categories.ts`)

```ts
type FeedType = "all" | "ethiopian-orthodox" | "ethiopian-cultural"
              | "ethiopian-fasting" | "ethiopian-weekly-fasts"
              | "ethiopian-commemorations";

type FeedConfig = {
  name: LocalizedText;
  categories: CalendarEventCategory[];
  includeWeeklyFasts?: boolean;          // force les jeûnes hebdo
  weeklyFastsOnly?: boolean;             // ne garde QUE les jeûnes hebdo
  includeMonthlyCommemorations?: boolean;// force les commémorations mensuelles
};
```

Chaque flux mappe un ensemble de catégories + des drapeaux pour le contenu
**dérivé**. Ajouter un flux = une entrée dans `FEEDS`, sans toucher au reste.

## Contenu dérivé (non déclaratif)

Deux familles d'événements ne sont pas des définitions statiques mais des
occurrences **générées** à la demande :

- **Jeûnes hebdomadaires** (`calendar/weekly-fasts.ts`) — mercredi/vendredi,
  catégorie `fasting`, via `includeWeeklyFasts` / `?weekly=true`.
- **Commémorations mensuelles** (`data/monthly-commemorations.ts` +
  `calendar/monthly-commemorations.ts`) — catégorie `commemoration`, via
  `includeMonthlyCommemorations` / `?monthly=true` :

```ts
type MonthlyCommemoration = {
  id: string;                  // slug stable → base d'UID
  day: number;                 // quantième du mois éthiopien (1..30)
  title: LocalizedText;
  description?: Partial<LocalizedText>;
};
```

## Invariants

1. Aucune `CalendarEventDefinition` ne contient de date grégorienne **calculée**
   depuis l'éthiopien (seulement `gregorianFixed` pour les jours civils légaux).
2. `title.fr` toujours présent (repli garanti).
3. `id` unique dans tout le catalogue (base d'UID stable).
4. `end` toujours strictement postérieure à `start` (au moins +1 jour).
