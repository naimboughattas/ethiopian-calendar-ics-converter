# Data model

Types in `src/types/`. The model separates the **definition** (timeless, source
of truth) from the **resolved occurrence** (dated for a Gregorian year).

## Calendar types (`types/calendar.ts`)

```ts
type EthiopianDate = { year?: number; month: number; day: number };
type GregorianDate = { year: number; month: number; day: number };
```

`ETHIOPIAN_MONTHS`: the 13 transliterated names (Meskerem … Pagume).

## Categories and i18n (`types/event.ts`)

```ts
type CalendarEventCategory =
  | "cultural" | "orthodox_fixed" | "orthodox_movable"
  | "fasting" | "national" | "commemoration";

type Locale = "fr" | "en" | "am";
type LocalizedText = { fr: string; en: string; am?: string }; // fr required
```

## Event definition — source of truth

```ts
type CalendarEventDefinition = {
  id: string;                       // stable → UID base
  title: LocalizedText;
  description?: Partial<LocalizedText>;
  category: CalendarEventCategory;
  isMovable: boolean;
  isAllDay: boolean;

  // Exactly one start mode among:
  ethiopianDate?: { month; day };   // fixed feast (recomputed per year)
  movableRule?: MovableRule;        // movable feast (depends on Fasika)
  gregorianFixed?: { month; day };  // Gregorian civil holiday

  // Duration (fasts): one or the other
  durationDays?: number;            // fixed length
  endEthiopianDate?: { month; day };// variable end on a fixed Ethiopian date

  note?: string;                    // assumptions/sources (not exported to ICS)
};
```

**Exclusivity rule**: `ethiopianDate`, `movableRule`, `gregorianFixed` are
mutually exclusive (a single start mode). Likewise `durationDays` vs
`endEthiopianDate`.

## Resolved occurrence

```ts
type ResolvedEvent = {
  definitionId: string;
  category: CalendarEventCategory;
  title: LocalizedText;
  description?: Partial<LocalizedText>;
  isAllDay: boolean;
  start: GregorianDate;   // inclusive
  end: GregorianDate;     // EXCLUSIVE (DTEND convention)
  uid: string;            // `<id>-<year>@ethiopian-calendar-converter`
};
```

## Dependency computation rules

| Field | Resolved by |
|---|---|
| `ethiopianDate` | `conversion.resolveEthiopianDateInGregorianYear` |
| `movableRule` | `orthodox-rules.resolveMovable` (Fasika based) |
| `gregorianFixed` | direct (year + month/day) |
| `durationDays` / `endEthiopianDate` | `fasting-periods.resolveEndExclusive` |

## Feeds (`data/event-categories.ts`)

```ts
type FeedType = "all" | "ethiopian-orthodox" | "ethiopian-cultural"
              | "ethiopian-fasting" | "ethiopian-weekly-fasts"
              | "ethiopian-commemorations";

type FeedConfig = {
  name: LocalizedText;
  categories: CalendarEventCategory[];
  includeWeeklyFasts?: boolean;          // force the weekly fasts
  weeklyFastsOnly?: boolean;             // keep ONLY the weekly fasts
  includeMonthlyCommemorations?: boolean;// force the monthly commemorations
};
```

Each feed maps a set of categories + flags for the **derived** content. Adding a
feed = one entry in `FEEDS`, without touching anything else.

## Derived content (non-declarative)

Two families of events are not static definitions but occurrences **generated**
on demand:

- **Weekly fasts** (`calendar/weekly-fasts.ts`) — Wednesday/Friday, `fasting`
  category, via `includeWeeklyFasts` / `?weekly=true`.
- **Monthly commemorations** (`data/monthly-commemorations.ts` +
  `calendar/monthly-commemorations.ts`) — `commemoration` category, via
  `includeMonthlyCommemorations` / `?monthly=true`:

```ts
type MonthlyCommemoration = {
  id: string;                  // stable slug → UID base
  day: number;                 // Ethiopian day-of-month (1..30)
  title: LocalizedText;
  description?: Partial<LocalizedText>;
};
```

## Invariants

1. No `CalendarEventDefinition` contains a Gregorian date **computed** from the
   Ethiopian one (only `gregorianFixed` for legal civil days).
2. `title.fr` always present (guaranteed fallback).
3. `id` unique across the whole catalog (stable UID base).
4. `end` always strictly after `start` (at least +1 day).
