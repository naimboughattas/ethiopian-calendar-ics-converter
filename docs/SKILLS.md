# Compétences (skills) requises

Compétences mobilisées par le projet et où elles s'appliquent dans le code.

| # | Compétence | Où / comment |
|---|---|---|
| 1 | **TypeScript strict** | `tsconfig` strict + `noUncheckedIndexedAccess` ; types explicites dans `types/`. |
| 2 | **Next.js API Routes** | `app/api/calendar/route.ts`, `app/api/calendar/[feed]/route.ts` (App Router, `Response`). |
| 3 | **Calendrier éthiopien** | 13 mois, Pagumē, bissextilité `E mod 4 = 3` (`ethiopian-date.ts`, CALENDAR_RULES). |
| 4 | **Conversion de dates** | Pivot JDN, inverses exacts (`conversion.ts`, ETHIOPIAN_TO_GREGORIAN_CONVERSION). |
| 5 | **Génération ICS** | RFC 5545, échappement, pliage 75 octets (`ics-generator.ts`, ICS_SPEC). |
| 6 | **Compatibilité Google Calendar** | all-day `VALUE=DATE`, DTEND exclusif, UID stables, fenêtre glissante. |
| 7 | **Tests unitaires** | Vitest, ancrages externes, cas limites (`tests/`, TESTING_STRATEGY). |
| 8 | **Data modeling** | Séparation définition/occurrence, exclusivité des champs (DATA_MODEL). |
| 9 | **Internationalisation** | `LocalizedText` fr/en/am, sélection + repli (`ics-generator`, `event-categories`). |
| 10 | **Documentation-first** | Doc avant code ; toute règle documentée (ce dossier `docs/`). |

## Notes de mise en œuvre

- **TypeScript strict** : préférer des unions littérales (`MovableRule`,
  `FeedType`) aux `string` libres → erreurs détectées à la compilation.
- **Fonctions pures** : la logique calendaire n'appelle pas `Date` (sauf défauts
  d'API) ; `dtstamp` injectable → tests déterministes.
- **i18n** : le français est requis (`title.fr`), les autres langues optionnelles
  avec repli automatique ; ajouter l'amharique = compléter les champs, sans code.
- **Doc-first** : le workflow attendu est
  *recherche → doc → code → test → doc → commit* (voir AGENTS.md).
