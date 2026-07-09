# Spécification ICS / compatibilité Google Calendar

Implémentation : `src/calendar/ics-generator.ts`. Conforme **RFC 5545**.

## Enveloppe VCALENDAR

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ethiopian-calendar-converter//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:<nom du flux localisé>
X-WR-TIMEZONE:Africa/Addis_Ababa
X-PUBLISHED-TTL:PT12H
REFRESH-INTERVAL;VALUE=DURATION:PT12H
... VEVENT ...
END:VCALENDAR
```

- `METHOD:PUBLISH` : flux publié (abonnement, non invitation).
- `X-WR-CALNAME` / `X-WR-TIMEZONE` : extensions lues par Google/Apple.
- `X-PUBLISHED-TTL` + `REFRESH-INTERVAL` : suggèrent une actualisation toutes les
  12 h (Google reste maître de sa fréquence réelle — voir limites).

## VEVENT (événement all-day)

```
BEGIN:VEVENT
UID:genna-2026@ethiopian-calendar-converter
DTSTAMP:20260101T000000Z
DTSTART;VALUE=DATE:20260107
DTEND;VALUE=DATE:20260108
SUMMARY:Genna (Nativité / Noël éthiopien)
DESCRIPTION:Nativité du Christ (Lidet). Correspond au 25 décembre julien.
CATEGORIES:orthodox_fixed
TRANSP:TRANSPARENT
END:VEVENT
```

### Propriétés

| Propriété | Règle |
|---|---|
| `UID` | **Stable et déterministe** : `<id>-<annéeGrég>@ethiopian-calendar-converter`. Rejouer la génération ne crée pas de doublon. |
| `DTSTAMP` | Horodatage UTC. Injectable pour des tests déterministes. |
| `DTSTART;VALUE=DATE` | Date de début, format `YYYYMMDD` (all-day). |
| `DTEND;VALUE=DATE` | **Exclusif** : jour suivant la fin. Un jour → `DTEND = DTSTART + 1`. Période de N jours → `+ N`. |
| `SUMMARY` | Titre localisé (`?lang=`), repli fr puis en. |
| `DESCRIPTION` | Optionnelle, localisée. |
| `CATEGORIES` | Catégorie de l'événement (filtrage/couleur). |
| `TRANSP:TRANSPARENT` | N'affecte pas la disponibilité (« libre »). |

## Encodage et sérialisation

- **CRLF** (`\r\n`) en fin de ligne (exigence RFC).
- **Échappement** (`escapeText`) : `\` → `\\`, `;` → `\;`, `,` → `\,`, saut de
  ligne → `\n`.
- **Pliage de lignes** (`foldLine`) à **75 octets**, continuations préfixées
  d'une espace. Le comptage est en **octets UTF-8** (indispensable pour les
  titres en amharique).
- Charset **UTF-8**, déclaré dans `Content-Type: text/calendar; charset=utf-8`.

## Fuseau horaire

Les événements étant **all-day** (`VALUE=DATE`, sans heure), aucun `VTIMEZONE`
n'est nécessaire ; ils s'affichent le bon jour quel que soit le fuseau du
client. `X-WR-TIMEZONE:Africa/Addis_Ababa` documente le fuseau de référence.

## Réponses HTTP

```
Content-Type: text/calendar; charset=utf-8
Content-Disposition: inline; filename="<flux>.ics"
Cache-Control: public, max-age=43200
```

## Compatibilité Google Calendar — points de vigilance

- Google **met en cache** les abonnements par URL et actualise à **sa** cadence
  (souvent 8–24 h, parfois plus). `REFRESH-INTERVAL` n'est qu'indicatif.
- L'`UID` stable évite les doublons lors des ré-imports.
- Les flux `.ics` couvrent une **fenêtre glissante d'années** (année−1 →
  année+3) pour rester alimentés sans changer d'URL.
- Utiliser **« À partir de l'URL »** (et non « Importer ») pour un abonnement
  vivant.
