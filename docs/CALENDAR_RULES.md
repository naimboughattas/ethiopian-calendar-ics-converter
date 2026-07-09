# Calendar rules (central reference)

This document is the **source of truth** for the calendar rules. Every rule
implemented in the code must appear here.

---

## 1. The Ethiopian months

The Ethiopian calendar (Ge'ez, **Amete Mihret** era) has **13 months**:

| # | Name (transliterated) | Ge'ez | Days | Approx. Gregorian start |
|---|--------------------|-------|-------|--------------------------|
| 1 | Meskerem | መስከረም | 30 | 11 Sep |
| 2 | Tikimt | ጥቅምት | 30 | 11 Oct |
| 3 | Hidar | ኅዳር | 30 | 10 Nov |
| 4 | Tahsas | ታኅሣሥ | 30 | 10 Dec |
| 5 | Tir | ጥር | 30 | 9 Jan |
| 6 | Yekatit | የካቲት | 30 | 8 Feb |
| 7 | Megabit | መጋቢት | 30 | 10 Mar |
| 8 | Miyazia | ሚያዝያ | 30 | 9 Apr |
| 9 | Ginbot | ግንቦት | 30 | 9 May |
| 10 | Sene | ሰኔ | 30 | 8 Jun |
| 11 | Hamle | ሐምሌ | 30 | 8 Jul |
| 12 | Nehase | ነሐሴ | 30 | 7 Aug |
| 13 | **Pagumē** | ጳጐሜን | **5 or 6** | 6 Sep |

- The **first 12 months** have **exactly 30 days**.
- The **13th month, Pagumē**, has **5 days**, or **6 days** in leap years.
- A year therefore has **365** days (**366** in a leap year).

The Gregorian start dates are **approximate**: they vary by ±1 day depending on
leap years (see §2).

---

## 2. Leap years

### Ethiopian calendar

> An Ethiopian year **E is a leap year if `E mod 4 = 3`.**

The extra day is **Pagumē 6**. The Ethiopian leap year immediately precedes the
corresponding Gregorian leap year. Examples of Ethiopian leap years: **2011,
2015, 2019, 2023, 2027**.

### Gregorian calendar

Leap year if divisible by 4, **except** multiples of 100 that are not multiples
of 400. (2000 leap, 1900 not, 2024 leap.)

### Interaction — the ±1 day shift

The Ethiopian leap day falls in **September** (end of Pagumē), the Gregorian one
in **February**. Between the Ethiopian New Year (Sept) and 29 February
Gregorian, fixed Ethiopian dates end up shifted by **+1 day** in Gregorian in
the years preceding a Gregorian leap year.

**Observable consequence (all correct)**:

| Following Gregorian year a leap year? | New Year | Meskel | Genna | Timkat |
|---|---|---|---|---|
| No | 11 Sep | 27 Sep | 7 Jan | 19 Jan |
| **Yes (previous year)** | **12 Sep** | **28 Sep** | **8 Jan** | **20 Jan** |

E.g.: New Year 2016 EC fell on **12 September 2023** (2024 is a leap year),
Meskel on **28 September 2023**, and therefore Genna on **8 January 2024**. This
is the **arithmetically correct** behavior; see §11 (limitations) for the
popular "Christmas = 7 January" nuance.

---

## 3. Ethiopian → Gregorian conversion

See [ETHIOPIAN_TO_GREGORIAN_CONVERSION.md](ETHIOPIAN_TO_GREGORIAN_CONVERSION.md)
for details. Summary:

1. Convert the Ethiopian date to a **Julian Day Number (JDN)**:

   ```
   JDN = 1_724_221 + 365·(year−1) + ⌊year/4⌋ + 30·(month−1) + (day−1)
   ```

   `1_724_221` = JDN of **1 Meskerem, year 1** (Amete Mihret).

2. Convert the JDN to a Gregorian date (Fliegel–Van Flandern algorithm).

## 4. Gregorian → Ethiopian conversion

1. Gregorian → JDN.
2. JDN → Ethiopian:

   ```
   e         = JDN − 1_724_221
   year      = ⌊(4·e + 1463) / 1461⌋
   yearStart = 1_724_221 + 365·(year−1) + ⌊year/4⌋
   dayOfYear = JDN − yearStart              (0-indexed)
   month     = ⌊dayOfYear / 30⌋ + 1
   day       = (dayOfYear mod 30) + 1
   ```

The two conversions are **exact inverses** of each other (round-trip test over
30,000 days).

---

## 5. Fixed feasts

Expressed as an **Ethiopian date (month/day)**, without a year → recurring every
Ethiopian year. The Gregorian date is recomputed per year.

**Fixed Orthodox** (`data/fixed-orthodox-events.ts`):

| Feast | Ethiopian date |
|---|---|
| Demera (Meskel eve) | Meskerem 16 |
| **Meskel** (Finding of the Cross) | Meskerem 17 |
| St Gabriel (Kulubi) | Tahsas 19 |
| **Genna** (Nativity) | Tahsas 29 |
| Ketera (Timkat eve) | Tir 10 |
| **Timkat** (Epiphany) | Tir 11 |
| Cana / St Michael | Tir 12 |
| St Mary of Zion | Hidar 21 |
| **Buhe** (Transfiguration) | Nehase 13 |
| **Filseta** (Assumption) | Nehase 16 |

**Cultural**: Enkutatash (Meskerem 1), Ashenda (Nehase 16).

## 6. Movable feasts

All derived from **Fasika** (Orthodox Easter), computed by the **Julian paschal
computus** (Meeus algorithm), then converted to Gregorian.
Offsets in days relative to Fasika:

| Feast | Offset |
|---|---|
| Fast of Nineveh (start) | −69 |
| Great Lent (start) | −55 |
| Debre Zeit (mid-Lent) | −28 |
| Hosanna (Palm Sunday) | −7 |
| Rikbe Kahnat (Maundy Thursday) | −3 |
| Siklet (Good Friday) | −2 |
| **Fasika (Easter)** | 0 |
| Erget (Ascension) | +39 |
| Peraklitos (Pentecost) | +49 |
| Apostles' Fast (start) | +50 |

## 7. Orthodox fasting periods

| Fast | Start | End / length |
|---|---|---|
| **Tsome Nnewe** (Nineveh) | Fasika − 69 (movable) | 3 days |
| **Abiy Tsom / Hudadi** (Great Lent) | Fasika − 55 (movable) | 55 days (until Fasika) |
| **Tsome Hawaryat** (Apostles) | Fasika + 50 (movable) | until Hamle 4 (variable) |
| **Tsome Filseta** (Dormition) | Nehase 1 (fixed) | 16 days (→ Filseta) |
| **Tsome Gena / Sibket** (Advent) | Hidar 15 (fixed) | until Tahsas 28 (~43 d) |

### Weekly fasts (Wednesday & Friday)

**Wednesday** (Tsome Reboue) and **Friday** (Tsome Arb) are fasting days **all
year**, with **exceptions** where the fast is lifted. They are generated **on
demand** via `?weekly=true` (disabled by default so as not to flood
subscriptions — about 90 days/year).

Applied exclusion rules (`calendar/weekly-fasts.ts`):

1. **Paschal window**: the **50 days** from Fasika to Pentecost (inclusive) are
   fast-free.
2. **Major feasts**: if a major Orthodox feast (fixed or movable — Genna,
   Timkat, Meskel…) falls on a Wednesday/Friday, the fast is **lifted** that
   day.
3. **Anti-duplicate**: days already covered by a **major fast** (Lent, Advent,
   Filseta, Apostles, Nineveh) do not get a separate weekly event (they remain
   fasting days under the major period).

> Assumption (v1): only the paschal window is treated as a continuous fast-free
> period. Other brief customary/regional exemptions are not modeled.

## 8. Cultural and national events

- **Enkutatash** (New Year, Meskerem 1) — cultural/religious.
- **Victory of Adwa** (Yekatit 23) — national; civil observance ≈ 2 March.
- **Ashenda** (Nehase 16) — cultural, northern Ethiopia.

**Civil holidays fixed in the Gregorian calendar** (modern Ethiopian law) — use
`gregorianFixed`:

| Day | Gregorian date |
|---|---|
| Labour Day | 1 May |
| Patriots' Victory Day | 5 May |
| Downfall of the Derg | 28 May |

## 9. ICS date convention

- **All-day** events: `DTSTART;VALUE=DATE` and `DTEND;VALUE=DATE`.
- **DTEND is exclusive**: a one-day event on 7 January has `DTSTART=20260107`,
  `DTEND=20260108`. An N-day period has `DTEND = start + N`.

## 10. Religious assumptions

- **Fasika = Orthodox Pascha** (Julian computus): the Tewahedo Church follows
  the common Orthodox paschal calendar. Valid over the modern period.
- Fixed feasts follow the **Ethiopian civil-calendar date** (not a fixed Julian
  anchor), which explains the ±1 day shift of §2.
- The liturgical offsets (§6) follow mainstream Tewahedo practice; some minor
  commemorations may vary by diocese.

## 11. Known limitations

- **Genna / Timkat**: "always 7 / 19 January" is a **popular approximation**.
  The arithmetic calendar gives 8 / 20 January in the years preceding a
  Gregorian leap year (§2). The code follows the arithmetic.
- **Validity window**: conversion reliable for **1900–2099** (constant 13-day
  Julian ↔ Gregorian offset; outside that range, the paschal computus must be
  revised).
- **Regional feasts with customary dates** (e.g. Irreecha) not modeled.
- **Weekly fasts** available via `?weekly=true` (disabled by default).
- The **Amharic names** of some categories/feasts are partial.

## Sources to verify (liturgical use)

Dates must be **confirmed against official ecclesiastical sources** (the
patriarchate of the Ethiopian Orthodox Tewahedo Church, the annual bāhre hasab)
before any liturgical use. See MCP_SETUP.md (§ research) and AGENTS.md
(`calendar-research-agent`).
