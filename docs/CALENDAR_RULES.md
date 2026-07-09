# Règles calendaires (référence centrale)

Ce document est la **référence de vérité** des règles du calendrier. Toute règle
implémentée dans le code doit y figurer.

---

## 1. Les mois éthiopiens

Le calendrier éthiopien (Ge'ez, ère **Amete Mihret**) compte **13 mois** :

| # | Nom (translittéré) | Ge'ez | Jours | Début grégorien approx. |
|---|--------------------|-------|-------|--------------------------|
| 1 | Meskerem | መስከረም | 30 | 11 sept. |
| 2 | Tikimt | ጥቅምት | 30 | 11 oct. |
| 3 | Hidar | ኅዳር | 30 | 10 nov. |
| 4 | Tahsas | ታኅሣሥ | 30 | 10 déc. |
| 5 | Tir | ጥር | 30 | 9 janv. |
| 6 | Yekatit | የካቲት | 30 | 8 févr. |
| 7 | Megabit | መጋቢት | 30 | 10 mars |
| 8 | Miyazia | ሚያዝያ | 30 | 9 avr. |
| 9 | Ginbot | ግንቦት | 30 | 9 mai |
| 10 | Sene | ሰኔ | 30 | 8 juin |
| 11 | Hamle | ሐምሌ | 30 | 8 juil. |
| 12 | Nehase | ነሐሴ | 30 | 7 août |
| 13 | **Pagumē** | ጳጐሜን | **5 ou 6** | 6 sept. |

- Les **12 premiers mois** ont **exactement 30 jours**.
- Le **13e mois, Pagumē**, a **5 jours**, ou **6 jours** les années bissextiles.
- Une année compte donc **365** jours (**366** en année bissextile).

Les dates grégoriennes de début sont **approximatives** : elles varient de ±1
jour selon les années bissextiles (voir §2).

---

## 2. Années bissextiles

### Calendrier éthiopien

> Une année éthiopienne **E est bissextile si `E mod 4 = 3`.**

Le jour supplémentaire est **Pagumē 6**. L'année bissextile éthiopienne précède
immédiatement l'année bissextile grégorienne correspondante. Exemples d'années
éthiopiennes bissextiles : **2011, 2015, 2019, 2023, 2027**.

### Calendrier grégorien

Bissextile si divisible par 4, **sauf** les multiples de 100 non multiples de
400. (2000 bissextile, 1900 non, 2024 bissextile.)

### Interaction — le décalage de ±1 jour

Le jour bissextile éthiopien tombe en **septembre** (fin Pagumē), le grégorien
en **février**. Entre le Nouvel An éthiopien (sept.) et le 29 février grégorien,
les dates éthiopiennes fixes se retrouvent décalées de **+1 jour** en grégorien
les années précédant une année bissextile grégorienne.

**Conséquence observable (toutes correctes)** :

| Année grégorienne suivante bissextile ? | Nouvel An | Meskel | Genna | Timkat |
|---|---|---|---|---|
| Non | 11 sept. | 27 sept. | 7 janv. | 19 janv. |
| **Oui (année précédente)** | **12 sept.** | **28 sept.** | **8 janv.** | **20 janv.** |

Ex. : le Nouvel An 2016 EC est tombé le **12 septembre 2023** (2024 bissextile),
Meskel le **28 septembre 2023**, et donc Genna le **8 janvier 2024**. C'est le
comportement **arithmétique correct** ; voir §11 (limites) pour la nuance
médiatique « Noël = 7 janvier ».

---

## 3. Conversion éthiopien → grégorien

Voir [ETHIOPIAN_TO_GREGORIAN_CONVERSION.md](ETHIOPIAN_TO_GREGORIAN_CONVERSION.md)
pour le détail. Résumé :

1. Convertir la date éthiopienne en **Julian Day Number (JDN)** :

   ```
   JDN = 1_724_221 + 365·(année−1) + ⌊année/4⌋ + 30·(mois−1) + (jour−1)
   ```

   `1_724_221` = JDN du **1 Meskerem an 1** (Amete Mihret).

2. Convertir le JDN en date grégorienne (algorithme de Fliegel–Van Flandern).

## 4. Conversion grégorien → éthiopien

1. Grégorien → JDN.
2. JDN → éthiopien :

   ```
   e      = JDN − 1_724_221
   année  = ⌊(4·e + 1463) / 1461⌋
   débutAnnée = 1_724_221 + 365·(année−1) + ⌊année/4⌋
   jourDeAnnée = JDN − débutAnnée            (0-indexé)
   mois   = ⌊jourDeAnnée / 30⌋ + 1
   jour   = (jourDeAnnée mod 30) + 1
   ```

Les deux conversions sont **inverses exactes** l'une de l'autre (test de
round-trip sur 30 000 jours).

---

## 5. Fêtes fixes

Exprimées en **date éthiopienne (mois/jour)**, sans année → récurrentes chaque
année éthiopienne. La date grégorienne est recalculée par année.

**Orthodoxes fixes** (`data/fixed-orthodox-events.ts`) :

| Fête | Date éthiopienne |
|---|---|
| Demera (veille de Meskel) | Meskerem 16 |
| **Meskel** (Invention de la Croix) | Meskerem 17 |
| Saint Gabriel (Kulubi) | Tahsas 19 |
| **Genna** (Nativité) | Tahsas 29 |
| Ketera (veille de Timkat) | Tir 10 |
| **Timkat** (Épiphanie) | Tir 11 |
| Cana / Saint Michel | Tir 12 |
| Sainte Marie de Sion | Hidar 21 |
| **Buhe** (Transfiguration) | Nehase 13 |
| **Filseta** (Assomption) | Nehase 16 |

**Culturelles** : Enkutatash (Meskerem 1), Ashenda (Nehase 16).

## 6. Fêtes mobiles

Toutes dérivées de **Fasika** (Pâques orthodoxe), calculée par le **comput
pascal julien** (algorithme de Meeus), puis convertie en grégorien.
Décalages en jours par rapport à Fasika :

| Fête | Décalage |
|---|---|
| Jeûne de Ninive (début) | −69 |
| Grand Carême (début) | −55 |
| Debre Zeit (mi-Carême) | −28 |
| Hosanna (Rameaux) | −7 |
| Rikbe Kahnat (Jeudi Saint) | −3 |
| Siklet (Vendredi Saint) | −2 |
| **Fasika (Pâques)** | 0 |
| Erget (Ascension) | +39 |
| Peraklitos (Pentecôte) | +49 |
| Jeûne des Apôtres (début) | +50 |

## 7. Périodes de jeûne orthodoxes

| Jeûne | Début | Fin / durée |
|---|---|---|
| **Tsome Nnewe** (Ninive) | Fasika − 69 (mobile) | 3 jours |
| **Abiy Tsom / Hudadi** (Grand Carême) | Fasika − 55 (mobile) | 55 jours (jusqu'à Fasika) |
| **Tsome Hawaryat** (Apôtres) | Fasika + 50 (mobile) | jusqu'à Hamle 4 (variable) |
| **Tsome Filseta** (Dormition) | Nehase 1 (fixe) | 16 jours (→ Filseta) |
| **Tsome Gena / Sibket** (Avent) | Hidar 15 (fixe) | jusqu'à Tahsas 28 (~43 j) |

### Jeûnes hebdomadaires (mercredi & vendredi)

Le **mercredi** (Tsome Reboue) et le **vendredi** (Tsome Arb) sont jours de
jeûne **toute l'année**, avec des **exceptions** où le jeûne est levé. Ils sont
générés **à la demande** via `?weekly=true` (désactivés par défaut pour ne pas
saturer les abonnements — env. 90 jours/an).

Règles d'exclusion appliquées (`calendar/weekly-fasts.ts`) :

1. **Fenêtre pascale** : les **50 jours** de Fasika à la Pentecôte (inclus) sont
   sans jeûne.
2. **Grandes fêtes** : si une grande fête orthodoxe (fixe ou mobile — Genna,
   Timkat, Meskel…) tombe un mercredi/vendredi, le jeûne est **levé** ce jour-là.
3. **Anti-doublon** : les jours déjà couverts par un **grand jeûne** (Carême,
   Avent, Filseta, Apôtres, Ninive) ne reçoivent pas d'événement hebdomadaire
   séparé (ils restent jeûnés au titre de la période majeure).

> Hypothèse (v1) : seule la fenêtre pascale est traitée comme période continue
> sans jeûne. D'autres brèves exemptions coutumières/régionales ne sont pas
> modélisées.

## 8. Événements culturels et nationaux

- **Enkutatash** (Nouvel An, Meskerem 1) — culturel/religieux.
- **Victoire d'Adwa** (Yekatit 23) — national ; observance civile ≈ 2 mars.
- **Ashenda** (Nehase 16) — culturel, nord de l'Éthiopie.

**Jours fériés civils fixés dans le grégorien** (loi éthiopienne moderne) —
utilisent `gregorianFixed` :

| Jour | Date grégorienne |
|---|---|
| Fête du Travail | 1er mai |
| Journée des Patriotes | 5 mai |
| Chute du Derg | 28 mai |

## 9. Convention de dates ICS

- Événements **all-day** : `DTSTART;VALUE=DATE` et `DTEND;VALUE=DATE`.
- **DTEND est exclusif** : un événement d'un jour au 7 janvier a
  `DTSTART=20260107`, `DTEND=20260108`. Une période de N jours a
  `DTEND = début + N`.

## 10. Hypothèses religieuses

- **Fasika = Pâque orthodoxe** (comput julien) : l'Église Tewahedo suit le
  calendrier pascal orthodoxe commun. Valide sur la période moderne.
- Les fêtes fixes suivent la **date éthiopienne du calendrier civil** (et non un
  ancrage julien fixe), ce qui explique le décalage ±1 jour du §2.
- Les décalages liturgiques (§6) suivent l'usage majoritaire Tewahedo ;
  certaines commémorations mineures peuvent varier selon les diocèses.

## 11. Limites connues

- **Genna / Timkat** : « toujours le 7 / 19 janvier » est une **approximation
  médiatique**. Le calendrier arithmétique donne 8 / 20 janvier les années
  précédant une bissextile grégorienne (§2). Le code suit l'arithmétique.
- **Fenêtre de validité** : conversion fiable **1900–2099** (offset julien
  ↔ grégorien constant de 13 jours ; hors de cette plage, le comput pascal doit
  être révisé).
- **Fêtes régionales à date coutumière** (ex. Irreecha) non modélisées.
- **Jeûnes hebdomadaires** non générés (v1).
- Les **noms amhariques** de certaines catégories/fêtes sont partiels.

## Sources à vérifier (usage cultuel)

Les dates doivent être **confirmées auprès de sources ecclésiales officielles**
(patriarcat de l'Église orthodoxe éthiopienne Tewahedo, bâhre hasab annuel)
avant tout usage liturgique. Voir MCP_SETUP.md (§ recherche) et AGENTS.md
(`calendar-research-agent`).
