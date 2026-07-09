# Conversion éthiopien ↔ grégorien

## Principe : le Julian Day Number (JDN)

Le **JDN** est un compteur entier de jours, continu, indépendant de tout
calendrier. On l'utilise comme **représentation pivot** : chaque calendrier
sait convertir vers et depuis le JDN, donc toute conversion inter-calendaire se
fait en deux étapes triviales et exactes.

```
Éthiopien ──► JDN ──► Grégorien
Grégorien ──► JDN ──► Éthiopien
```

Implémentation : `src/calendar/ethiopian-date.ts`, `src/calendar/gregorian-date.ts`,
`src/calendar/conversion.ts`.

## Constante d'époque

```
ETHIOPIC_EPOCH_JDN = 1_724_221
```

C'est le JDN du **1 Meskerem an 1** de l'ère Amete Mihret. Cette valeur est
**validée** : elle reproduit le Nouvel An éthiopien au 11 septembre grégorien
(12 septembre l'année précédant une bissextile grégorienne), Meskel au 27/28
septembre, Genna au 7/8 janvier, etc.

## Éthiopien → JDN

```
JDN = 1_724_221 + 365·(année−1) + ⌊année/4⌋ + 30·(mois−1) + (jour−1)
```

- `365·(année−1)` : jours des années complètes précédentes.
- `⌊année/4⌋` : jours bissextiles accumulés (un tous les 4 ans).
- `30·(mois−1)` : les mois font tous 30 jours (Pagumē étant le 13e).
- `(jour−1)` : décalage dans le mois.

## JDN → Éthiopien

```
e           = JDN − 1_724_221
année       = ⌊(4·e + 1463) / 1461⌋
débutAnnée  = 1_724_221 + 365·(année−1) + ⌊année/4⌋
jourDeAnnée = JDN − débutAnnée              (0-indexé, 0..365)
mois        = ⌊jourDeAnnée / 30⌋ + 1        (1..13)
jour        = (jourDeAnnée mod 30) + 1      (1..30 ; 1..6 pour Pagumē)
```

`1461 = 4·365 + 1` est la longueur d'un cycle de 4 ans en jours ; `1463` cale la
phase pour que la division entière retourne la bonne année.

## Grégorien ↔ JDN

Algorithmes classiques de Fliegel & Van Flandern (voir `gregorian-date.ts`).
Valables pour le **calendrier grégorien proleptique**.

## Résoudre une date éthiopienne dans une année grégorienne

Une fête fixe est un couple **(mois, jour)** éthiopien sans année. Pour l'année
grégorienne cible `G`, l'année éthiopienne à utiliser est soit `G−8`, soit
`G−7`, selon que la fête tombe avant ou après le Nouvel An éthiopien
(mi-septembre). On teste les deux et on garde la conversion qui tombe **dans
`G`** :

```ts
resolveEthiopianDateInGregorianYear(mois, jour, G):
  pour ey ∈ [G−8, G−7]:
    g = ethiopienToGregorien(ey, mois, jour)
    si g.année == G: retourner g
```

Exemple :
- **Genna** (Tahsas 29) pour `G = 2026` → année éthiopienne **2018** → 7 janv. 2026.
- **Meskel** (Meskerem 17) pour `G = 2026` → année éthiopienne **2019** → 27 sept. 2026.

## Cas limites

| Cas | Traitement |
|---|---|
| **Pagumē 6** (année bissextile) | `daysInEthiopianMonth(year,13)` renvoie 6 si `year mod 4 = 3`. |
| **Décalage ±1 jour** autour des bissextiles grégoriennes | Émergent naturellement du JDN ; **aucun cas spécial**. |
| **Fête à cheval sur le 31 déc.** | La résolution par année teste `G−8` et `G−7`. |
| **Jeûne à cheval sur le Nouvel An grégorien** (Tsome Gena) | La fin (`endEthiopianDate`) est cherchée dans `G` puis `G+1`. |
| **Modulo négatif** (années < 1) | `isEthiopianLeapYear` normalise le modulo. |

## Tests attendus

Voir `src/tests/conversion.test.ts`. Couverture :

1. **Ancrages du Nouvel An** : Meskerem 1 EC 2016→2020 = 11/12 septembre correct.
2. **Genna** en année normale (2018→7 janv.) et en année décalée (2016→8 janv.).
3. **Round-trip exact** grégorien→éthiopien→grégorien sur ~30 000 jours.
4. **Bissextilité** : `E mod 4 = 3` ; Pagumē 5/6 jours ; 12 mois à 30 jours.
5. **Résolution par année** : bonne occurrence pour fêtes de janvier et de sept.

Toutes ces assertions sont **vérifiées et passent** (`npm test`).

## Fenêtre de validité

Fiable pour **1900–2099** (offset julien↔grégorien constant de 13 jours, utilisé
par le comput pascal). Hors de cette plage, revoir `orthodox-rules.ts`.
