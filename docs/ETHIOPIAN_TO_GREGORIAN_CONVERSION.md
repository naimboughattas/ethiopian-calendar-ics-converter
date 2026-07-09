# Ethiopian ↔ Gregorian conversion

## Principle: the Julian Day Number (JDN)

The **JDN** is a continuous integer count of days, independent of any calendar.
We use it as the **pivot representation**: each calendar can convert to and from
the JDN, so any cross-calendar conversion is done in two trivial and exact
steps.

```
Ethiopian ──► JDN ──► Gregorian
Gregorian ──► JDN ──► Ethiopian
```

Implementation: `src/calendar/ethiopian-date.ts`, `src/calendar/gregorian-date.ts`,
`src/calendar/conversion.ts`.

## Epoch constant

```
ETHIOPIC_EPOCH_JDN = 1_724_221
```

This is the JDN of **1 Meskerem, year 1** of the Amete Mihret era. This value is
**validated**: it reproduces the Ethiopian New Year on 11 September Gregorian
(12 September in the year preceding a Gregorian leap year), Meskel on 27/28
September, Genna on 7/8 January, etc.

## Ethiopian → JDN

```
JDN = 1_724_221 + 365·(year−1) + ⌊year/4⌋ + 30·(month−1) + (day−1)
```

- `365·(year−1)`: days of the preceding complete years.
- `⌊year/4⌋`: accumulated leap days (one every 4 years).
- `30·(month−1)`: every month has 30 days (Pagumē being the 13th).
- `(day−1)`: offset within the month.

## JDN → Ethiopian

```
e         = JDN − 1_724_221
year      = ⌊(4·e + 1463) / 1461⌋
yearStart = 1_724_221 + 365·(year−1) + ⌊year/4⌋
dayOfYear = JDN − yearStart              (0-indexed, 0..365)
month     = ⌊dayOfYear / 30⌋ + 1         (1..13)
day       = (dayOfYear mod 30) + 1       (1..30; 1..6 for Pagumē)
```

`1461 = 4·365 + 1` is the length of a 4-year cycle in days; `1463` phases the
integer division so it returns the correct year.

## Gregorian ↔ JDN

Classic Fliegel & Van Flandern algorithms (see `gregorian-date.ts`). Valid for
the **proleptic Gregorian calendar**.

## Resolving an Ethiopian date within a Gregorian year

A fixed feast is an Ethiopian **(month, day)** pair without a year. For the
target Gregorian year `G`, the Ethiopian year to use is either `G−8` or `G−7`,
depending on whether the feast falls before or after the Ethiopian New Year
(mid-September). We test both and keep the conversion that falls **in `G`**:

```ts
resolveEthiopianDateInGregorianYear(month, day, G):
  for ey ∈ [G−8, G−7]:
    g = ethiopianToGregorian(ey, month, day)
    if g.year == G: return g
  return null   // the date skips this Gregorian year (see edge cases)
```

Example:
- **Genna** (Tahsas 29) for `G = 2026` → Ethiopian year **2018** → 7 Jan 2026.
- **Meskel** (Meskerem 17) for `G = 2026` → Ethiopian year **2019** → 27 Sep 2026.

## Edge cases

| Case | Handling |
|---|---|
| **Pagumē 6** (leap year) | `daysInEthiopianMonth(year,13)` returns 6 if `year mod 4 = 3`. |
| **±1 day shift** around Gregorian leap years | Emerges naturally from the JDN; **no special case**. |
| **Date near 31 Dec / 1 Jan skipping a year** | A recurring Ethiopian date falls 0 or 1 times per Gregorian year. When leap-year drift pushes it from 31 Dec of one year to 1 Jan of the next, it skips the intermediate year: the resolver returns `null` and callers skip it (it appears in the adjacent year). |
| **Fast straddling the Gregorian New Year** (Tsome Gena) | The end (`endEthiopianDate`) is searched in `G` then `G+1`. |
| **Negative modulo** (years < 1) | `isEthiopianLeapYear` normalizes the modulo. |

## Expected tests

See `src/tests/conversion.test.ts`. Coverage:

1. **New Year anchors**: Meskerem 1 EC 2016→2020 = correct 11/12 September.
2. **Genna** in a normal year (2018→7 Jan) and a shifted year (2016→8 Jan).
3. **Exact round-trip** Gregorian→Ethiopian→Gregorian over ~30,000 days.
4. **Leap years**: `E mod 4 = 3`; Pagumē 5/6 days; 12 months of 30 days.
5. **Per-year resolution**: correct occurrence for January and September feasts,
   and `null` when the date skips a Gregorian year.

All these assertions are **verified and passing** (`npm test`).

## Validity window

Reliable for **1900–2099** (constant 13-day Julian↔Gregorian offset, used by the
paschal computus). Outside that range, revisit `orthodox-rules.ts`.
