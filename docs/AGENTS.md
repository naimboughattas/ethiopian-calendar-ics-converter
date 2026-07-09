# Agents spécialisés

Six agents se répartissent le travail. Chacun a un **périmètre**, des
**entrées/sorties** et des **garde-fous**. Des définitions exécutables (Claude
Code) sont fournies dans `.claude/agents/*.md`.

> Règle transverse : **documentation d'abord**. Aucun agent ne modifie une règle
> calendaire sans que `docs/CALENDAR_RULES.md` soit mis à jour dans le même lot.

| Agent | Périmètre | Sorties principales |
|---|---|---|
| `calendar-research-agent` | Recherche/vérif. des règles éthiopiennes & orthodoxes | Notes sourcées, mises à jour de CALENDAR_RULES/ORTHODOX_RITES |
| `date-conversion-agent` | Algorithme de conversion éthiopien ↔ grégorien | `calendar/*-date.ts`, `conversion.ts`, tests conversion |
| `orthodox-rites-agent` | Modélisation fêtes/jeûnes/rites | `data/*`, `movable-feasts.ts`, `fasting-periods.ts` |
| `ics-generation-agent` | Génération ICS Google-compatible | `ics-generator.ts`, tests ICS |
| `qa-test-agent` | Tests, cas limites, validations | `src/tests/*`, rapports |
| `docs-agent` | Maintien de la documentation | `docs/*`, `README.md` |

## Détails

### `calendar-research-agent`
- **But** : établir/vérifier les règles (mois, bissextilité, comput pascal,
  dates de fêtes, jeûnes) à partir de **sources fiables**.
- **Garde-fous** : citer les sources ; distinguer fait établi vs hypothèse ;
  signaler les divergences régionales ; **ne pas coder**, seulement documenter.

### `date-conversion-agent`
- **But** : implémenter/maintenir des conversions **pures** via JDN.
- **Invariants** : époque = 1 724 221 ; round-trip exact ; aucun cas spécial pour
  le décalage ±1 jour (émergent). Toute modif accompagnée de tests.

### `orthodox-rites-agent`
- **But** : traduire les règles (docs) en **définitions déclaratives** ; jamais
  de date grégorienne codée en dur dépendant de l'éthiopien.
- **Sorties** : entrées typées dans `data/`, décalages mobiles dans
  `orthodox-rules.ts`.

### `ics-generation-agent`
- **But** : produire un ICS **RFC 5545** valide et Google-compatible (all-day,
  DTEND exclusif, UID stables, CRLF, pliage 75 octets UTF-8).

### `qa-test-agent`
- **But** : couvrir les **cas limites** (bissextiles, chevauchements, multi-
  octets), ancrer sur des faits externes, garder la suite verte.

### `docs-agent`
- **But** : garantir que la doc **précède et suit** chaque changement ; cohérence
  README ↔ docs ↔ code.

## Chaîne de collaboration type

```
research ──► docs ──► (conversion | rites | ics) ──► qa-test ──► docs (mise à jour) ──► commit (git)
```
