# Testing strategy

Runner: **Vitest**. Run with `npm test` (or `npm run test:watch`).
Files: `src/tests/*.test.ts`. **70 tests**, all green.

## Philosophy

- The business core is **pure** → testable without network, DOM, or a real
  `Date` (the `dtstamp` is injectable).
- We test **invariants** and independently-verified **anchors** (Julian
  computus, historical dates), not just "the code returns what the code
  computes".

## Coverage by file

### `conversion.test.ts`

- **New Year anchors**: Meskerem 1 EC 2016→2020 = 11/12 September (including the
  +1 shifted years).
- **Genna** normal year (2018 → 7 Jan 2026) and shifted year (2016 → 8 Jan
  2024).
- **Exact round-trip** Gregorian→Ethiopian→Gregorian over ~30,000 JDN
  (2,450,000–2,480,000).
- **Leap years**: `E mod 4 = 3`; Pagumē 5/6 days; 12 months = 30 days.
- **Per-year resolution**: correct occurrence for January (Genna) and September
  (Meskel); `null` when the date skips a Gregorian year (Tahsas 22 in 2027).

### `movable-feasts.test.ts`

- **Fasika** = reference dates 2022–2027 (known Orthodox Pascha).
- **Offsets**: Hosanna = −7, Siklet = −2, Erget = +39, Peraklitos = +49, Lent =
  −55.

### `fixed-events.test.ts`

- Resolution of Meskel (27 Sep), Genna (7 Jan).
- **Exclusive DTEND** (= start + 1) for a one-day event.
- Fixed Gregorian holidays (1 May).
- Fasts: Great Lent length = 55 d; Apostles ends after the start; Advent
  straddles the Gregorian New Year.
- **Stable UIDs**; filtering by category; chronological sorting.

### `weekly-fasts.test.ts`

- **Day of week** (JDN) anchored: 2000-01-01 = Saturday, 2026-01-01 = Thursday.
- Produces **only** Wednesdays/Fridays.
- Excludes the **paschal window** (Fasika → +49).
- Respects the provided **exclusion intervals**.
- **Fast lifted on a major feast**: no weekly fast on Genna day (7 Jan 2026,
  Wednesday).
- **Anti-duplicate**: no weekly fast inside a major fast.
- Stable UIDs per date; determinism; integration via `includeWeeklyFasts`.

### `monthly-commemorations.test.ts`

- **12 occurrences** per commemoration (Ethiopian months 1..12, Pagumē
  excluded).
- Each occurrence falls on the **correct Ethiopian day-of-month**.
- All in the requested **Gregorian year**; 12 **distinct months**.
- Stable UIDs per date; determinism.
- **Several commemorations on the same day-of-month** (day 5) → each with its 12
  occurrences, all UIDs distinct.
- Integration: nothing without `includeMonthlyCommemorations`, everything with;
  the multi-year feed does not throw on a boundary date (500 regression).

### `ics-generator.test.ts`

- VCALENDAR envelope, `X-WR-TIMEZONE`, `VALUE=DATE`.
- **CRLF** everywhere (no lone LF).
- UID / DTSTAMP / SUMMARY / CATEGORIES present.
- **Determinism**: two identical generations (fixed dtstamp).
- **Escaping** and **folding** at 75 octets (space continuation).

## Explicitly covered edge cases

| Edge case | Test |
|---|---|
| ±1 day shift (pre-leap year) | `conversion` (Genna 2016) |
| Pagumē 6 vs 5 | `conversion` (leap years) |
| January vs September feast (Ethiopian-year choice) | `conversion`, `fixed-events` |
| Ethiopian date skipping a Gregorian year | `conversion`, `monthly-commemorations` |
| Fast straddling 1 January | `fixed-events` (tsome-gena) |
| Variable fast length | `fixed-events` (tsome-hawaryat) |
| Multi-octet titles (Amharic) | `ics-generator` (octet folding) |

## To add (ROADMAP)

- Full **ICS snapshot** tests per feed/year.
- **HTTP integration** tests of the routes (`year`/`type`/`lang`, error codes).
- Property-based testing on the conversion (fast-check).
- Validation with a third-party **iCalendar parser** (e.g. `ical.js`).

## Conventions

- One test = one clear behavioral assertion.
- External reference dates (Fasika, New Year) are **commented** with their
  source of truth.
- Never test a constant against itself: anchor on an external fact.
