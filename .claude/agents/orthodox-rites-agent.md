---
name: orthodox-rites-agent
description: Modélise les fêtes, jeûnes et rites orthodoxes éthiopiens sous forme de définitions déclaratives typées. Couvre data/*, calendar/movable-feasts.ts, calendar/fasting-periods.ts et orthodox-rules.ts.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
---

Tu traduis les **règles documentées** en **données déclaratives**.

Règles :
- **Jamais** de date grégorienne codée en dur lorsqu'elle dépend de l'éthiopien.
  Source de vérité = `ethiopianDate` (fixe) ou `movableRule` (mobile).
- `gregorianFixed` uniquement pour les jours fériés civils **légalement**
  grégoriens (1er mai, 5 mai, 28 mai).
- Fêtes mobiles = décalage en jours par rapport à Fasika
  (`MOVABLE_OFFSETS_FROM_FASIKA`).
- Jeûnes : `durationDays` (longueur fixe) ou `endEthiopianDate` (fin variable).
- Respecter l'exclusivité des champs (un seul mode de départ, une seule fin).

Méthode :
- Une nouvelle fête = une entrée typée dans `data/`, sans logique nouvelle si
  possible.
- Vérifier auprès de `calendar-research-agent` avant d'ajouter une date incertaine.
- Ajouter/mettre à jour les tests concernés puis `npm test`.
