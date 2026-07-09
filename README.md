# Ethiopian Calendar Converter

An **ICS** (iCalendar) feed generator, subscribable in **Google Calendar**, for
**Ethiopian cultural events** and **Orthodox Tewahedo rites**, with **reliable
conversion from the Ethiopian to the Gregorian calendar** recomputed for each
year.

> **Founding principle**: the source of truth for an event is its **Ethiopian
> date** (or its liturgical rule). No Gregorian date is hard-coded when it
> depends on the Ethiopian calendar — it is **computed**.

## Features

- Pure Ethiopian ↔ Gregorian conversion (via Julian Day Number).
- Fixed feasts (cultural, national, Orthodox) expressed as Ethiopian dates.
- Movable Orthodox feasts computed from **Fasika** (Easter, Julian computus).
- Multi-day **fasting** periods (Lent, Nineveh, Filseta, Apostles, Advent).
- RFC 5545-compliant ICS generation, Google Calendar compatible (all-day events).
- Multilingual: **French** and **English** implemented, **Amharic** planned.
- Multiple feeds: full, Orthodox, cultural, fasting.

## Installation

```bash
npm install
```

## Running

```bash
npm run dev        # development server (http://localhost:3000)
npm run build      # production build
npm start          # production server
npm test           # unit tests (Vitest)
npm run typecheck  # strict TypeScript check
```

## Usage

### Subscribable `.ics` feeds (rolling window of years)

| Feed                        | URL                                          |
| --------------------------- | -------------------------------------------- |
| All                         | `/api/calendar/all.ics`                      |
| Orthodox rites              | `/api/calendar/ethiopian-orthodox.ics`       |
| Cultural events             | `/api/calendar/ethiopian-cultural.ics`       |
| Fasts (major)               | `/api/calendar/ethiopian-fasting.ics`        |
| Weekly fasts (Wed/Fri)      | `/api/calendar/ethiopian-weekly-fasts.ics`   |
| Monthly commemorations      | `/api/calendar/ethiopian-commemorations.ics` |

Add `?lang=fr|en|am` for the language (fr by default) and `?weekly=true` to
include the **weekly** Wednesday/Friday fasts (disabled by default).

### By-year API

```
GET /api/calendar?year=2026&type=all&lang=fr
```

- `year`: Gregorian year (1900–2200).
- `type`: `all` | `ethiopian-orthodox` | `ethiopian-cultural` | `ethiopian-fasting` | `ethiopian-weekly-fasts` | `ethiopian-commemorations`.
- `lang`: `fr` | `en` | `am`.
- `weekly`: `true` to add the weekly Wednesday/Friday fasts.
- `monthly`: `true` to add the monthly saint commemorations.

## Deployment

**Zero-configuration** deployment on Vercel (Next.js). See
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). In short:

```bash
# CLI option
npx vercel login && npx vercel --prod

# GitHub option (continuous deployment)
git push -u origin main   # then "Import Project" on vercel.com
```

The repository is already initialized and committed, ready to push.

## Add the calendar to Google Calendar

1. Deploy the app (or expose `localhost` via a public URL).
2. Copy a feed URL, e.g. `https://your-domain/api/calendar/ethiopian-orthodox.ics`.
3. Google Calendar → **Other calendars** → **From URL** → paste the URL.
4. Google refreshes the subscription periodically (see limitations below).

## Architecture (summary)

```
src/
  app/api/calendar/          ICS routes (Next.js App Router)
  calendar/                  Pure functions: conversion, computus, ICS
  data/                      Event definitions (source of truth)
  types/                     TypeScript types
  tests/                     Unit tests (Vitest)
docs/                        Full documentation
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for details.

## Documentation

| Document | Contents |
| --- | --- |
| [PROJECT_OVERVIEW](docs/PROJECT_OVERVIEW.md) | Vision, goals, scope |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Technical structure, data flow |
| [CALENDAR_RULES](docs/CALENDAR_RULES.md) | Calendar rules (central reference) |
| [ETHIOPIAN_TO_GREGORIAN_CONVERSION](docs/ETHIOPIAN_TO_GREGORIAN_CONVERSION.md) | Conversion algorithm |
| [ORTHODOX_RITES](docs/ORTHODOX_RITES.md) | Feasts, fasts, commemorations |
| [ICS_SPEC](docs/ICS_SPEC.md) | iCalendar / Google Calendar choices |
| [DEPLOYMENT](docs/DEPLOYMENT.md) | Vercel deployment + public URLs |
| [DATA_MODEL](docs/DATA_MODEL.md) | Typed data model |
| [TESTING_STRATEGY](docs/TESTING_STRATEGY.md) | Strategy and edge cases |
| [MCP_SETUP](docs/MCP_SETUP.md) | Recommended MCP servers |
| [AGENTS](docs/AGENTS.md) | Specialized agents |
| [SKILLS](docs/SKILLS.md) | Required skills |
| [ROADMAP](docs/ROADMAP.md) | Phases and future work |

## Known limitations

- **Feasts pinned to the Julian calendar** (Genna, Timkat): they follow the
  Ethiopian date (Tahsas 29 / Tir 11), which shifts them by +1 Gregorian day in
  the years preceding a Gregorian leap year (the **correct** behavior of the
  arithmetic calendar; see CALENDAR_RULES).
- **Movable feasts**: the computus assumes Fasika = Orthodox Pascha (Julian
  based), valid over the modern period.
- **Weekly fasts** (Wednesday/Friday) available via `?weekly=true` (disabled by
  default, volume). Only the 50-day paschal window is treated as a continuous
  fast-free period.
- **Irreecha** and some regional feasts with variable dates are not modeled yet
  (see ROADMAP).
- Conversion validated and reliable for the Gregorian window **1900–2099**.

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md).

## License

Educational/community project. Verify liturgical dates against official
ecclesiastical sources before any liturgical use.
