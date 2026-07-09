# Ethiopian Calendar Converter

Générateur de flux **ICS** (iCalendar) abonnable dans **Google Calendar** pour
les **événements culturels éthiopiens** et les **rites orthodoxes Tewahedo**,
avec une **conversion fiable du calendrier éthiopien vers le calendrier
grégorien** recalculée pour chaque année.

> **Principe fondateur** : la source de vérité d'un événement est sa **date
> éthiopienne** (ou sa règle liturgique). Aucune date grégorienne n'est codée en
> dur lorsqu'elle dépend du calendrier éthiopien — elle est **calculée**.

## Fonctionnalités

- Conversion pure éthiopien ↔ grégorien (via Julian Day Number).
- Fêtes fixes (culturelles, nationales, orthodoxes) exprimées en dates éthiopiennes.
- Fêtes mobiles orthodoxes calculées à partir de **Fasika** (Pâques, comput julien).
- Périodes de **jeûne** multi-jours (Carême, Ninive, Filseta, Apôtres, Avent).
- Génération ICS conforme RFC 5545, compatible Google Calendar (événements all-day).
- Multilingue : **français** et **anglais** implémentés, **amharique** prévu.
- Plusieurs flux : complet, orthodoxe, culturel, jeûnes.

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev        # serveur de développement (http://localhost:3000)
npm run build      # build de production
npm start          # serveur de production
npm test           # tests unitaires (Vitest)
npm run typecheck  # vérification TypeScript stricte
```

## Usage

### Flux `.ics` abonnables (fenêtre glissante d'années)

| Flux                        | URL                                          |
| --------------------------- | -------------------------------------------- |
| Tout                        | `/api/calendar/all.ics`                      |
| Rites orthodoxes            | `/api/calendar/ethiopian-orthodox.ics`       |
| Événements culturels        | `/api/calendar/ethiopian-cultural.ics`       |
| Jeûnes (majeurs)            | `/api/calendar/ethiopian-fasting.ics`        |
| Jeûnes hebdo (mer./ven.)    | `/api/calendar/ethiopian-weekly-fasts.ics`   |
| Commémorations mensuelles   | `/api/calendar/ethiopian-commemorations.ics` |

Ajoutez `?lang=fr|en|am` pour la langue (fr par défaut) et `?weekly=true` pour
inclure les **jeûnes hebdomadaires** mercredi/vendredi (désactivés par défaut).

### API par année

```
GET /api/calendar?year=2026&type=all&lang=fr
```

- `year` : année grégorienne (1900–2200).
- `type` : `all` | `ethiopian-orthodox` | `ethiopian-cultural` | `ethiopian-fasting` | `ethiopian-weekly-fasts` | `ethiopian-commemorations`.
- `lang` : `fr` | `en` | `am`.
- `weekly` : `true` pour ajouter les jeûnes hebdomadaires mercredi/vendredi.
- `monthly` : `true` pour ajouter les commémorations mensuelles de saints.

## Déploiement

Déploiement **zéro configuration** sur Vercel (Next.js). Voir
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). En résumé :

```bash
# Option CLI
npx vercel login && npx vercel --prod

# Option GitHub (déploiement continu)
git push -u origin main   # puis « Import Project » sur vercel.com
```

Le dépôt est déjà initialisé et committé, prêt à être poussé.

## Ajouter le calendrier dans Google Calendar

1. Déployez l'application (ou exposez `localhost` via une URL publique).
2. Copiez l'URL d'un flux, par ex. `https://votre-domaine/api/calendar/ethiopian-orthodox.ics`.
3. Google Agenda → **Autres agendas** → **À partir de l'URL** → collez l'URL.
4. Google actualise l'abonnement périodiquement (voir limites ci-dessous).

## Architecture (résumé)

```
src/
  app/api/calendar/          Routes ICS (Next.js App Router)
  calendar/                  Fonctions pures : conversion, comput, ICS
  data/                      Définitions d'événements (source de vérité)
  types/                     Types TypeScript
  tests/                     Tests unitaires (Vitest)
docs/                        Documentation complète
```

Voir [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) pour le détail.

## Documentation

| Document | Contenu |
| --- | --- |
| [PROJECT_OVERVIEW](docs/PROJECT_OVERVIEW.md) | Vision, objectifs, périmètre |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Structure technique, flux de données |
| [CALENDAR_RULES](docs/CALENDAR_RULES.md) | Règles calendaires (référence centrale) |
| [ETHIOPIAN_TO_GREGORIAN_CONVERSION](docs/ETHIOPIAN_TO_GREGORIAN_CONVERSION.md) | Algorithme de conversion |
| [ORTHODOX_RITES](docs/ORTHODOX_RITES.md) | Fêtes, jeûnes, commémorations |
| [ICS_SPEC](docs/ICS_SPEC.md) | Choix iCalendar / Google Calendar |
| [DEPLOYMENT](docs/DEPLOYMENT.md) | Déploiement Vercel + URLs publiques |
| [DATA_MODEL](docs/DATA_MODEL.md) | Modèle de données typé |
| [TESTING_STRATEGY](docs/TESTING_STRATEGY.md) | Stratégie et cas limites |
| [MCP_SETUP](docs/MCP_SETUP.md) | Serveurs MCP recommandés |
| [AGENTS](docs/AGENTS.md) | Agents spécialisés |
| [SKILLS](docs/SKILLS.md) | Compétences requises |
| [ROADMAP](docs/ROADMAP.md) | Phases et évolutions |

## Limites connues

- **Fêtes pinées au calendrier julien** (Genna, Timkat) : elles suivent la date
  éthiopienne (Tahsas 29 / Tir 11), ce qui les décale de +1 jour grégorien les
  années précédant une année bissextile grégorienne (comportement **correct**
  du calendrier arithmétique ; voir CALENDAR_RULES).
- **Fêtes mobiles** : le comput suppose la coïncidence Fasika = Pâque orthodoxe
  (base julienne), valable sur la période moderne.
- **Jeûnes hebdomadaires** (mercredi/vendredi) disponibles via `?weekly=true`
  (désactivés par défaut, volume). Seule la fenêtre pascale des 50 jours est
  traitée comme période continue sans jeûne.
- **Irreecha** et certaines fêtes régionales à date variable ne sont pas encore
  modélisées (voir ROADMAP).
- Conversion validée et fiable pour la fenêtre grégorienne **1900–2099**.

## Roadmap

Voir [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Licence

Projet éducatif/communautaire. Vérifiez les dates liturgiques auprès de sources
ecclésiales officielles avant tout usage cultuel.
