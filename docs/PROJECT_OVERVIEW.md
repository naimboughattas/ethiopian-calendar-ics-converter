# Project Overview

## Goal

Provide a **subscribable calendar generator (ICS)** for Google Calendar,
covering:

- Ethiopian **cultural and national events**;
- **Orthodox Tewahedo rites** (fixed feasts, movable feasts, fasts,
  commemorations);

with **correct conversion from the Ethiopian to the Gregorian calendar**,
recomputed for each year.

## Problem solved

The Ethiopian calendar differs from the Gregorian one (13 months, a 7–8 year
offset, its own leap-year rule). Ethiopian feasts are defined in **their**
calendar; their Gregorian date **changes every year** and depends on the leap
years of both calendars. Hard-coding Gregorian dates produces errors (typically
±1 day around leap years). This project stores the **source of truth** as an
Ethiopian date (or a liturgical rule) and **computes** the Gregorian date.

## Target users

- Members of the Ethiopian diaspora who want to follow feasts and fasts.
- Orthodox Tewahedo parishes and communities.
- Anyone interested in Ethiopian culture.

## Scope (v1)

Included:

- Ethiopian ↔ Gregorian conversion (pure, tested functions).
- Fixed cultural/national/Orthodox feasts.
- Movable feasts derived from Fasika.
- Major fasting periods.
- Multiple ICS feeds + by-year API.
- French and English.

Excluded (v1, see ROADMAP):

- Weekly Wednesday/Friday fasts.
- Regional feasts with variable customary dates (e.g. Irreecha).
- Advanced customization UI.
- Complete Amharic (structure ready, partial content).

## Guiding principles

1. **Documentation first**: no undocumented calendar rule.
2. **Source of truth = Ethiopian date / liturgical rule.**
3. **Pure functions** for every conversion (deterministic, testable).
4. **Separation** of fixed / movable / cultural / national / fasting.
5. **Stable ICS UIDs.**
6. **i18n planned** from the data model onward.
7. **Strict tests** covering edge cases (leap years, overlaps).

## Success criteria

- A user can subscribe to a URL and see the feasts on the **correct Gregorian
  dates**, year after year, with no intervention.
- The conversion passes the anchor tests (New Year, Genna, Timkat, Meskel,
  Fasika) across several years, including the shifted years.
