# Architecture

## Vue d'ensemble

Application **Next.js (App Router) + TypeScript strict**. Le cœur métier est un
ensemble de **fonctions pures** (aucun effet de bord, aucune dépendance à
`Date` pour la logique calendaire) ; les routes API ne font qu'assembler et
sérialiser.

```
Définitions d'événements (data/)  ──►  Moteur de résolution (calendar/fixed-events.ts)
        source de vérité                        │
                                                ▼
                          Occurrences résolues (ResolvedEvent[])
                                                │
                                                ▼
                          Générateur ICS (calendar/ics-generator.ts)
                                                │
                                                ▼
                          Routes API (app/api/calendar/*)  ──►  Réponse text/calendar
```

## Arborescence

```
src/
  app/
    layout.tsx                     Layout racine
    page.tsx                       Page d'accueil (liste des flux)
    api/
      calendar/
        route.ts                   GET /api/calendar?year&type&lang
        [feed]/route.ts            GET /api/calendar/<feed>.ics (fenêtre glissante)
  calendar/
    gregorian-date.ts              JDN ↔ grégorien, addDays, format ICS
    ethiopian-date.ts              JDN ↔ éthiopien, bissextilité, mois
    conversion.ts                  éthiopien ↔ grégorien + résolution par année
    orthodox-rules.ts              comput de Fasika + décalages mobiles
    movable-feasts.ts              définitions mobiles + résolution du début
    fasting-periods.ts             calcul de la fin (durée / date éthiopienne)
    weekly-fasts.ts                jeûnes hebdo mercredi/vendredi (dérivés)
    monthly-commemorations.ts      commémorations mensuelles de saints (dérivées)
    fixed-events.ts                MOTEUR : résout tout → ResolvedEvent[]
    ics-generator.ts               sérialisation RFC 5545
  data/
    fixed-cultural-events.ts       fêtes culturelles + jours fériés civils
    fixed-orthodox-events.ts       fêtes orthodoxes fixes
    fasting-periods.ts             périodes de jeûne
    monthly-commemorations.ts      liste des commémorations mensuelles
    event-categories.ts            libellés + configuration des flux
  types/
    calendar.ts                    EthiopianDate, GregorianDate, mois
    event.ts                       CalendarEventDefinition, ResolvedEvent, etc.
  tests/                           conversion, fixed-events, movable, ics
docs/
```

## Couches

1. **Types** (`types/`) — vocabulaire partagé, sans logique.
2. **Primitives calendaires** (`gregorian-date.ts`, `ethiopian-date.ts`) —
   conversions vers/depuis le **Julian Day Number** (pivot).
3. **Conversion & règles** (`conversion.ts`, `orthodox-rules.ts`) — éthiopien ↔
   grégorien, comput pascal, décalages liturgiques.
4. **Données** (`data/`) — définitions déclaratives = **source de vérité**.
5. **Résolution** (`fixed-events.ts`, `movable-feasts.ts`, `fasting-periods.ts`)
   — transforme définitions + année → occurrences concrètes.
6. **Sérialisation** (`ics-generator.ts`) — occurrences → iCalendar.
7. **Transport** (`app/api/`) — HTTP, validation des paramètres, en-têtes.

## Décisions clés

- **Julian Day Number comme pivot** : toute conversion passe par un entier de
  jours continu, ce qui rend les calculs inter-calendaires triviaux et exacts.
- **Séparation définition / occurrence** : une `CalendarEventDefinition` est
  intemporelle (mois/jour éthiopien ou règle) ; un `ResolvedEvent` est daté pour
  une année grégorienne précise. On ne stocke jamais l'occurrence.
- **Flux `.ics` sur fenêtre glissante** (année-1 → année+3) pour que
  l'abonnement Google reste alimenté sans changer d'URL.
- **DTEND exclusif** pour les événements all-day (convention iCalendar).
- **Fonctions pures + injection de `dtstamp`** pour des tests déterministes.

## Extensibilité

- **Nouvelle fête** : ajouter une entrée déclarative dans `data/` — aucun code.
- **Nouvelle langue** : compléter les champs `LocalizedText` ; la sélection est
  déjà gérée.
- **Nouveau flux** : ajouter une entrée dans `FEEDS` (`event-categories.ts`).
- **Nouvelle règle mobile** : ajouter un `MovableRule` + un décalage dans
  `MOVABLE_OFFSETS_FROM_FASIKA`.
