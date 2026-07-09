# Ethiopian Orthodox (Tewahedo) rites

Catalog of the modeled rites, by category. The **source of truth** is the
Ethiopian date (fixed feasts) or the liturgical rule (movable feasts).

Implementation: `data/fixed-orthodox-events.ts`, `calendar/movable-feasts.ts`,
`data/fasting-periods.ts`.

---

## 1. Fixed feasts

Date expressed in the Ethiopian calendar; Gregorian date recomputed per year.

| id | Feast | Ethiopian date | Note |
|---|---|---|---|
| `demera` | Demera (Meskel eve) | Meskerem 16 | Bonfire |
| `meskel` | **Meskel** (Finding of the Cross) | Meskerem 17 | Major |
| `gabriel-kulubi` | St Gabriel (Kulubi) | Tahsas 19 | Pilgrimage |
| `genna` | **Genna** (Nativity) | Tahsas 29 | = 25 Dec Julian |
| `ketera` | Ketera (Timkat eve) | Tir 10 | |
| `timkat` | **Timkat** (Epiphany) | Tir 11 | Major |
| `cana-mikael` | Cana of Galilee / St Michael | Tir 12 | |
| `hidar-tsion` | St Mary of Zion | Hidar 21 | Axum |
| `buhe` | **Buhe** (Transfiguration) | Nehase 13 | Debre Tabor |
| `filseta` | **Filseta** (Assumption) | Nehase 16 | End of the Filseta fast |

## 2. Movable feasts

Derived from **Fasika** (Easter), Julian paschal computus. Offset in days:

| id | Feast | Offset / Fasika |
|---|---|---|
| `nineveh` (fast) | Nineveh | −69 |
| `abiy_tsom_start` (fast) | Start of Great Lent | −55 |
| `debre-zeit` | Debre Zeit (mid-Lent) | −28 |
| `hosanna` | **Hosanna** (Palm Sunday) | −7 |
| `rikbe-kahnat` | Rikbe Kahnat (Maundy Thursday) | −3 |
| `siklet` | **Siklet** (Good Friday) | −2 |
| `fasika` | **Fasika** (Easter) | 0 |
| `erget` | Erget (Ascension) | +39 |
| `peraklitos` | Peraklitos (Pentecost) | +49 |

Reference Fasika dates (validated): 2023-04-16, 2024-05-05, 2025-04-20,
2026-04-12, 2027-05-02.

## 3. Fasts

Five major periods; multi-day. See `data/fasting-periods.ts`.

| id | Fast | Start | End |
|---|---|---|---|
| `tsome-nnewe` | Nineveh | Fasika − 69 | +3 days |
| `abiy-tsom` | Great Lent (Hudadi) | Fasika − 55 | 55 days (→ Fasika) |
| `tsome-hawaryat` | Apostles | Fasika + 50 | Hamle 4 (variable) |
| `tsome-filseta` | Filseta (Dormition) | Nehase 1 | 16 days |
| `tsome-gena` | Advent (Sibket) | Hidar 15 | Tahsas 28 |

### Weekly fasts

**Wednesday** and **Friday** are fasting days all year, except: the paschal
window (50 days Fasika→Pentecost), major-feast days (fast lifted), and days
already within a major fast (anti-duplicate). Generated via `?weekly=true`
(disabled by default). Implementation: `calendar/weekly-fasts.ts`.

Not modeled in v1: **Tsome Dihnet** and minor customary exemptions. See ROADMAP.

## 4. Monthly commemorations

Many saints/mysteries are commemorated on the **same day-of-month each Ethiopian
month**. Generated on demand (`?monthly=true` or the dedicated feed
`ethiopian-commemorations.ics`) — 12 occurrences/year per commemoration
(months 1..12, Pagumē excluded). Source: `data/monthly-commemorations.ts`.

| Day of month | Commemoration(s) |
|---|---|
| 1 | Lideta (Nativity of Mary); St Raguel |
| 3 | Be'ata (Presentation of Mary at the Temple) |
| 5 | Gebre Menfes Kidus (Abbo); Peter and Paul |
| 6 | Qusquam (Our Lady of Qusquam) |
| 7 | Holy Trinity (Selassie) |
| 8 | Arba'etu Ensesa (Four Living Creatures) |
| 10 | Meskel (Cross, monthly commemoration) |
| 12 | St Michael (Mikael) |
| 14 | Abune Aregawi |
| 15 | St Cyriacus (Kirkos) |
| 16 | Kidane Mihret (Covenant of Mercy) |
| 17 | St Stephen (Estifanos) |
| 19 | St Gabriel |
| 21 | St Mary (Mariam) |
| 22 | St Uriel |
| 23 | St George (Giyorgis) |
| 24 | Abune Tekle Haymanot |
| 25 | St Mercurius (Merkorios) |
| 27 | Medhane Alem (Saviour of the World) |
| 28 | Amanuel (Emmanuel) |
| 29 | Lidet (monthly Nativity commemoration) |
| 30 | St Mark the Evangelist (Marqos) |

**24 commemorations** over **22 days-of-month** (days 1 and 5 carry two),
i.e. 288 occurrences/year. Several commemorations may share a day.

> Days not yet covered (2, 4, 9, 11, 13, 18, 20, 26): left for a **verified**
> extension against the Synaxarium (Senkessar), as usage varies by parish. Each
> addition = one line in `data/monthly-commemorations.ts`.

> A **well-established and extensible** subset; usage varies by parish. Confirm
> against an ecclesiastical source. When a monthly commemoration coincides with
> its major annual feast (e.g. Mikael on Tir 12), both may appear if both
> categories are requested — expected behavior.

## 5. Major events — summary

| Event | Type | When |
|---|---|---|
| **Genna** | fixed | Tahsas 29 (≈ 7 Jan) |
| **Timkat** | fixed | Tir 11 (≈ 19 Jan) |
| **Meskel** | fixed | Meskerem 17 (≈ 27 Sep) |
| **Fasika** | movable | Julian computus (Apr/May) |
| **Hosanna** | movable | Fasika − 7 |
| **Siklet** | movable | Fasika − 2 |
| **Filseta** | fixed | Nehase 16 (≈ 22 Aug) |
| **Tsome Nebiyat** (= Tsome Gena / Advent) | fast | Hidar 15 → Tahsas 28 |
| **Hudadi** (= Abiy Tsom / Great Lent) | fast | Fasika − 55 |

> **Terminology**: "Tsome Nebiyat" (Fast of the Prophets) refers to the Advent
> fast, modeled here as `tsome-gena`. "Hudadi" is another name for Great Lent
> (`abiy-tsom`).

## Sources and verification

Confirm dates against the annual **bāhre hasab** and Tewahedo patriarchate
announcements before any liturgical use (see `calendar-research-agent` in
AGENTS.md).
