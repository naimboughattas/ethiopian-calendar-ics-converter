# Required skills

Skills used by the project and where they apply in the code.

| # | Skill | Where / how |
|---|---|---|
| 1 | **Strict TypeScript** | strict `tsconfig` + `noUncheckedIndexedAccess`; explicit types in `types/`. |
| 2 | **Next.js API Routes** | `app/api/calendar/route.ts`, `app/api/calendar/[feed]/route.ts` (App Router, `Response`). |
| 3 | **Ethiopian calendar** | 13 months, Pagumē, leap rule `E mod 4 = 3` (`ethiopian-date.ts`, CALENDAR_RULES). |
| 4 | **Date conversion** | JDN pivot, exact inverses (`conversion.ts`, ETHIOPIAN_TO_GREGORIAN_CONVERSION). |
| 5 | **ICS generation** | RFC 5545, escaping, 75-octet folding (`ics-generator.ts`, ICS_SPEC). |
| 6 | **Google Calendar compatibility** | all-day `VALUE=DATE`, exclusive DTEND, stable UIDs, rolling window. |
| 7 | **Unit testing** | Vitest, external anchors, edge cases (`tests/`, TESTING_STRATEGY). |
| 8 | **Data modeling** | definition/occurrence separation, field exclusivity (DATA_MODEL). |
| 9 | **Internationalization** | `LocalizedText` fr/en/am, selection + fallback (`ics-generator`, `event-categories`). |
| 10 | **Documentation-first** | Docs before code; every rule documented (this `docs/` folder). |

## Implementation notes

- **Strict TypeScript**: prefer literal unions (`MovableRule`, `FeedType`) over
  free `string`s → errors caught at compile time.
- **Pure functions**: the calendar logic does not call `Date` (except API
  defaults); `dtstamp` injectable → deterministic tests.
- **i18n**: French is required (`title.fr`), the other languages optional with
  automatic fallback; adding Amharic = filling in the fields, no code.
- **Doc-first**: the expected workflow is
  *research → docs → code → test → docs → commit* (see AGENTS.md).
