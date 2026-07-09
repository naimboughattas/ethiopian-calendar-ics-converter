# Architecture

## Overview

A **Next.js (App Router) + strict TypeScript** application. The business core is
a set of **pure functions** (no side effects, no dependency on `Date` for the
calendar logic); the API routes only assemble and serialize.

```
Event definitions (data/)  ──►  Resolution engine (calendar/fixed-events.ts)
       source of truth                        │
                                              ▼
                        Resolved occurrences (ResolvedEvent[])
                                              │
                                              ▼
                        ICS generator (calendar/ics-generator.ts)
                                              │
                                              ▼
                        API routes (app/api/calendar/*)  ──►  text/calendar response
```

## Tree

```
src/
  app/
    layout.tsx                     Root layout
    page.tsx                       Home page (feed list)
    api/
      calendar/
        route.ts                   GET /api/calendar?year&type&lang
        [feed]/route.ts            GET /api/calendar/<feed>.ics (rolling window)
  calendar/
    gregorian-date.ts              JDN ↔ Gregorian, addDays, ICS format
    ethiopian-date.ts              JDN ↔ Ethiopian, leap years, months
    conversion.ts                  Ethiopian ↔ Gregorian + per-year resolution
    orthodox-rules.ts              Fasika computus + movable offsets
    movable-feasts.ts              movable definitions + start resolution
    fasting-periods.ts             end computation (duration / Ethiopian date)
    weekly-fasts.ts                weekly Wed/Fri fasts (derived)
    monthly-commemorations.ts      monthly saint commemorations (derived)
    fixed-events.ts                ENGINE: resolves everything → ResolvedEvent[]
    ics-generator.ts               RFC 5545 serialization
  data/
    fixed-cultural-events.ts       cultural feasts + civil holidays
    fixed-orthodox-events.ts       fixed Orthodox feasts
    fasting-periods.ts             fasting periods
    monthly-commemorations.ts      list of monthly commemorations
    event-categories.ts            labels + feed configuration
  types/
    calendar.ts                    EthiopianDate, GregorianDate, months
    event.ts                       CalendarEventDefinition, ResolvedEvent, etc.
  tests/                           conversion, fixed-events, movable, ics
docs/
```

## Layers

1. **Types** (`types/`) — shared vocabulary, no logic.
2. **Calendar primitives** (`gregorian-date.ts`, `ethiopian-date.ts`) —
   conversions to/from the **Julian Day Number** (pivot).
3. **Conversion & rules** (`conversion.ts`, `orthodox-rules.ts`) — Ethiopian ↔
   Gregorian, paschal computus, liturgical offsets.
4. **Data** (`data/`) — declarative definitions = **source of truth**.
5. **Resolution** (`fixed-events.ts`, `movable-feasts.ts`, `fasting-periods.ts`)
   — turns definitions + year → concrete occurrences.
6. **Serialization** (`ics-generator.ts`) — occurrences → iCalendar.
7. **Transport** (`app/api/`) — HTTP, parameter validation, headers.

## Key decisions

- **Julian Day Number as pivot**: every conversion goes through a continuous
  integer count of days, which makes cross-calendar computations trivial and
  exact.
- **Definition / occurrence separation**: a `CalendarEventDefinition` is
  timeless (Ethiopian month/day or rule); a `ResolvedEvent` is dated for a
  specific Gregorian year. The occurrence is never stored.
- **`.ics` feeds over a rolling window** (year-1 → year+3) so the Google
  subscription stays populated without changing the URL.
- **Exclusive DTEND** for all-day events (iCalendar convention).
- **Pure functions + injectable `dtstamp`** for deterministic tests.

## Extensibility

- **New feast**: add a declarative entry in `data/` — no code.
- **New language**: fill in the `LocalizedText` fields; selection is already
  handled.
- **New feed**: add an entry to `FEEDS` (`event-categories.ts`).
- **New movable rule**: add a `MovableRule` + an offset in
  `MOVABLE_OFFSETS_FROM_FASIKA`.
