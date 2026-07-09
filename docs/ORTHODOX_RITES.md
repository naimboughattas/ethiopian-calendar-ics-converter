# Rites orthodoxes éthiopiens (Tewahedo)

Catalogue des rites modélisés, par catégorie. La **source de vérité** est la
date éthiopienne (fêtes fixes) ou la règle liturgique (fêtes mobiles).

Implémentation : `data/fixed-orthodox-events.ts`, `calendar/movable-feasts.ts`,
`data/fasting-periods.ts`.

---

## 1. Fêtes fixes

Date exprimée en calendrier éthiopien ; date grégorienne recalculée par année.

| id | Fête | Date éthiopienne | Note |
|---|---|---|---|
| `demera` | Demera (veille de Meskel) | Meskerem 16 | Bûcher |
| `meskel` | **Meskel** (Invention de la Croix) | Meskerem 17 | Majeure |
| `gabriel-kulubi` | Saint Gabriel (Kulubi) | Tahsas 19 | Pèlerinage |
| `genna` | **Genna** (Nativité) | Tahsas 29 | = 25 déc. julien |
| `ketera` | Ketera (veille de Timkat) | Tir 10 | |
| `timkat` | **Timkat** (Épiphanie) | Tir 11 | Majeure |
| `cana-mikael` | Cana de Galilée / Saint Michel | Tir 12 | |
| `hidar-tsion` | Sainte Marie de Sion | Hidar 21 | Axoum |
| `buhe` | **Buhe** (Transfiguration) | Nehase 13 | Debre Tabor |
| `filseta` | **Filseta** (Assomption) | Nehase 16 | Fin du jeûne de Filseta |

## 2. Fêtes mobiles

Dérivées de **Fasika** (Pâques), comput pascal julien. Décalage en jours :

| id | Fête | Décalage / Fasika |
|---|---|---|
| `nineveh` (jeûne) | Ninive | −69 |
| `abiy_tsom_start` (jeûne) | Début du Grand Carême | −55 |
| `debre-zeit` | Debre Zeit (mi-Carême) | −28 |
| `hosanna` | **Hosanna** (Rameaux) | −7 |
| `rikbe-kahnat` | Rikbe Kahnat (Jeudi Saint) | −3 |
| `siklet` | **Siklet** (Vendredi Saint) | −2 |
| `fasika` | **Fasika** (Pâques) | 0 |
| `erget` | Erget (Ascension) | +39 |
| `peraklitos` | Peraklitos (Pentecôte) | +49 |

Dates de référence de Fasika (validées) : 2023-04-16, 2024-05-05, 2025-04-20,
2026-04-12, 2027-05-02.

## 3. Jeûnes

Sept périodes majeures ; multi-jours. Voir `data/fasting-periods.ts`.

| id | Jeûne | Début | Fin |
|---|---|---|---|
| `tsome-nnewe` | Ninive | Fasika − 69 | +3 jours |
| `abiy-tsom` | Grand Carême (Hudadi) | Fasika − 55 | 55 jours (→ Fasika) |
| `tsome-hawaryat` | Apôtres | Fasika + 50 | Hamle 4 (variable) |
| `tsome-filseta` | Filseta (Dormition) | Nehase 1 | 16 jours |
| `tsome-gena` | Avent (Sibket) | Hidar 15 | Tahsas 28 |

### Jeûnes hebdomadaires

Le **mercredi** et le **vendredi** sont jeûnés toute l'année, sauf : la fenêtre
pascale (50 jours Fasika→Pentecôte), les jours de grande fête (jeûne levé) et
les jours déjà dans un grand jeûne (anti-doublon). Générés via `?weekly=true`
(désactivés par défaut). Implémentation : `calendar/weekly-fasts.ts`.

Non modélisé en v1 : **Tsome Dihnet** et exemptions coutumières mineures. Voir
ROADMAP.

## 4. Commémorations mensuelles

De nombreux saints/mystères sont commémorés le **même quantième chaque mois
éthiopien**. Générées à la demande (`?monthly=true` ou flux dédié
`ethiopian-commemorations.ics`) — 12 occurrences/an par commémoration (mois
1..12, Pagumē exclu). Source : `data/monthly-commemorations.ts`.

| Jour du mois | Commémoration(s) |
|---|---|
| 1 | Lideta (Nativité de Marie) ; Saint Raguel |
| 3 | Be'ata (Présentation de Marie au Temple) |
| 5 | Gebre Menfes Kidus (Abbo) ; Pierre-et-Paul |
| 6 | Qusquam (Notre-Dame de Qusquam) |
| 7 | Sainte Trinité (Selassie) |
| 8 | Arba'etu Ensesa (Quatre Vivants) |
| 10 | Meskel (Croix, commémoration mensuelle) |
| 12 | Saint Michel (Mikael) |
| 14 | Abune Aregawi |
| 15 | Saint Cyriaque (Kirkos) |
| 16 | Kidane Mihret (Alliance de Miséricorde) |
| 17 | Saint Étienne (Estifanos) |
| 19 | Saint Gabriel |
| 21 | Sainte Marie (Mariam) |
| 22 | Saint Uriel (Uraël) |
| 23 | Saint Georges (Giyorgis) |
| 24 | Abune Tekle Haymanot |
| 25 | Saint Mercure (Merkorios) |
| 27 | Medhane Alem (Sauveur du Monde) |
| 28 | Amanuel (Emmanuel) |
| 29 | Lidet (commémoration mensuelle de la Nativité) |
| 30 | Saint Marc l'Évangéliste (Marqos) |

**24 commémorations** sur **22 quantièmes** (les jours 1 et 5 en portent deux),
soit 288 occurrences/an. Plusieurs commémorations peuvent partager un jour.

> Jours encore non couverts (2, 4, 9, 11, 13, 18, 20, 26) : laissés à une
> extension **vérifiée** contre le Synaxaire (Senkessar), les usages variant
> selon les paroisses. Chaque ajout = une ligne dans
> `data/monthly-commemorations.ts`.

> Sous-ensemble **bien établi et extensible** ; les usages varient selon les
> paroisses. À confirmer auprès d'une source ecclésiale. Quand une commémoration
> mensuelle coïncide avec sa grande fête annuelle (ex. Mikael le 12 Tir), les
> deux peuvent apparaître si les deux catégories sont demandées — comportement
> attendu.

## 5. Événements majeurs — récapitulatif

| Événement | Type | Quand |
|---|---|---|
| **Genna** | fixe | Tahsas 29 (≈ 7 janv.) |
| **Timkat** | fixe | Tir 11 (≈ 19 janv.) |
| **Meskel** | fixe | Meskerem 17 (≈ 27 sept.) |
| **Fasika** | mobile | comput julien (avr./mai) |
| **Hosanna** | mobile | Fasika − 7 |
| **Siklet** | mobile | Fasika − 2 |
| **Filseta** | fixe | Nehase 16 (≈ 22 août) |
| **Tsome Nebiyat** (= Tsome Gena / Avent) | jeûne | Hidar 15 → Tahsas 28 |
| **Hudadi** (= Abiy Tsom / Grand Carême) | jeûne | Fasika − 55 |

> **Terminologie** : « Tsome Nebiyat » (jeûne des Prophètes) désigne le jeûne de
> l'Avent, modélisé ici sous `tsome-gena`. « Hudadi » est un autre nom du Grand
> Carême (`abiy-tsom`).

## Sources et vérification

Confirmer les dates auprès du **bâhre hasab** annuel et des annonces du
patriarcat Tewahedo avant tout usage liturgique (voir `calendar-research-agent`
dans AGENTS.md).
