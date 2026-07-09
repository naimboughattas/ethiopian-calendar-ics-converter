# Stratégie de test

Runner : **Vitest**. Lancer avec `npm test` (ou `npm run test:watch`).
Fichiers : `src/tests/*.test.ts`. **68 tests**, tous verts.

## Philosophie

- Le cœur métier est **pur** → testable sans réseau, sans DOM, sans `Date`
  réelle (le `dtstamp` est injectable).
- On teste des **invariants** et des **ancrages** vérifiés indépendamment
  (comput julien, dates historiques), pas seulement « le code renvoie ce que le
  code calcule ».

## Couverture par fichier

### `conversion.test.ts`

- **Ancrages du Nouvel An** : Meskerem 1 EC 2016→2020 = 11/12 septembre (dont
  les années à décalage +1).
- **Genna** année normale (2018 → 7 janv. 2026) et année décalée (2016 → 8 janv.
  2024).
- **Round-trip exact** grégorien→éthiopien→grégorien sur ~30 000 JDN
  (2 450 000–2 480 000).
- **Bissextilité** : `E mod 4 = 3` ; Pagumē 5/6 jours ; 12 mois = 30 jours.
- **Résolution par année** : bonne occurrence pour janvier (Genna) et septembre
  (Meskel).

### `movable-feasts.test.ts`

- **Fasika** = dates de référence 2022–2027 (Pâque orthodoxe connue).
- **Décalages** : Hosanna = −7, Siklet = −2, Erget = +39, Peraklitos = +49,
  Carême = −55.

### `fixed-events.test.ts`

- Résolution Meskel (27 sept.), Genna (7 janv.).
- **DTEND exclusif** (= début + 1) pour un événement d'un jour.
- Jours fériés grégoriens fixes (1er mai).
- Jeûnes : durée du Grand Carême = 55 j ; Apôtres se termine après le début ;
  Avent chevauche le Nouvel An grégorien.
- **UID stables** ; filtrage par catégorie ; tri chronologique.

### `weekly-fasts.test.ts`

- **Jour de la semaine** (JDN) ancré : 2000-01-01 = samedi, 2026-01-01 = jeudi.
- Ne produit **que** des mercredis/vendredis.
- Exclut la **fenêtre pascale** (Fasika → +49).
- Respecte les **intervalles d'exclusion** fournis.
- **Jeûne levé sur grande fête** : aucun jeûne hebdo le jour de Genna (7 janv.
  2026, mercredi).
- **Anti-doublon** : aucun jeûne hebdo à l'intérieur d'un grand jeûne.
- UID stables par date ; déterminisme ; intégration via `includeWeeklyFasts`.

### `monthly-commemorations.test.ts`

- **12 occurrences** par commémoration (mois éthiopiens 1..12, Pagumē exclu).
- Chaque occurrence tombe sur le **bon quantième** éthiopien.
- Toutes dans l'**année grégorienne** demandée ; 12 **mois distincts**.
- UID stables par date ; déterminisme.
- **Plusieurs commémorations le même quantième** (jour 5) → chacune ses 12
  occurrences, UID tous distincts.
- Intégration : rien sans `includeMonthlyCommemorations`, tout avec.

### `ics-generator.test.ts`

- Enveloppe VCALENDAR, `X-WR-TIMEZONE`, `VALUE=DATE`.
- **CRLF** partout (aucun LF isolé).
- UID / DTSTAMP / SUMMARY / CATEGORIES présents.
- **Déterminisme** : deux générations identiques (dtstamp fixé).
- **Échappement** et **pliage** à 75 octets (continuation par espace).

## Cas limites explicitement couverts

| Cas limite | Test |
|---|---|
| Décalage ±1 jour (année pré-bissextile) | `conversion` (Genna 2016) |
| Pagumē 6 vs 5 | `conversion` (bissextilité) |
| Fête de janvier vs septembre (choix d'année éthiopienne) | `conversion`, `fixed-events` |
| Jeûne à cheval sur le 1er janvier | `fixed-events` (tsome-gena) |
| Longueur de jeûne variable | `fixed-events` (tsome-hawaryat) |
| Titres multi-octets (amharique) | `ics-generator` (pliage en octets) |

## À ajouter (ROADMAP)

- Tests de **snapshot ICS** complets par flux/année.
- Tests d'**intégration HTTP** des routes (`year`/`type`/`lang`, codes d'erreur).
- Property-based testing sur la conversion (fast-check).
- Validation par un **parseur iCalendar** tiers (ex. `ical.js`).

## Conventions

- Un test = une assertion de comportement claire.
- Les dates de référence externes (Fasika, Nouvel An) sont **commentées** avec
  leur source de vérité.
- Ne jamais tester une constante contre elle-même : ancrer sur un fait externe.
