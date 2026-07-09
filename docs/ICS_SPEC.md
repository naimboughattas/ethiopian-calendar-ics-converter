# ICS specification / Google Calendar compatibility

Implementation: `src/calendar/ics-generator.ts`. **RFC 5545** compliant.

## VCALENDAR envelope

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ethiopian-calendar-converter//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:<localized feed name>
X-WR-TIMEZONE:Africa/Addis_Ababa
X-PUBLISHED-TTL:PT12H
REFRESH-INTERVAL;VALUE=DURATION:PT12H
... VEVENT ...
END:VCALENDAR
```

- `METHOD:PUBLISH`: published feed (subscription, not an invitation).
- `X-WR-CALNAME` / `X-WR-TIMEZONE`: extensions read by Google/Apple.
- `X-PUBLISHED-TTL` + `REFRESH-INTERVAL`: suggest a refresh every 12 h (Google
  remains in control of its actual frequency — see limitations).

## VEVENT (all-day event)

```
BEGIN:VEVENT
UID:genna-2026@ethiopian-calendar-converter
DTSTAMP:20260101T000000Z
DTSTART;VALUE=DATE:20260107
DTEND;VALUE=DATE:20260108
SUMMARY:Genna (Ethiopian Christmas / Nativity)
DESCRIPTION:Nativity of Christ (Lidet). Corresponds to 25 December (Julian).
CATEGORIES:orthodox_fixed
TRANSP:TRANSPARENT
END:VEVENT
```

### Properties

| Property | Rule |
|---|---|
| `UID` | **Stable and deterministic**: `<id>-<gregYear>@ethiopian-calendar-converter`. Re-running generation creates no duplicate. |
| `DTSTAMP` | UTC timestamp. Injectable for deterministic tests. |
| `DTSTART;VALUE=DATE` | Start date, `YYYYMMDD` format (all-day). |
| `DTEND;VALUE=DATE` | **Exclusive**: the day after the end. One day → `DTEND = DTSTART + 1`. N-day period → `+ N`. |
| `SUMMARY` | Localized title (`?lang=`), falling back to fr then en. |
| `DESCRIPTION` | Optional, localized. |
| `CATEGORIES` | Event category (filtering/color). |
| `TRANSP:TRANSPARENT` | Does not affect availability ("free"). |

## Encoding and serialization

- **CRLF** (`\r\n`) at line endings (RFC requirement).
- **Escaping** (`escapeText`): `\` → `\\`, `;` → `\;`, `,` → `\,`, newline →
  `\n`.
- **Line folding** (`foldLine`) at **75 octets**, continuations prefixed with a
  space. Counting is in **UTF-8 octets** (essential for Amharic titles).
- **UTF-8** charset, declared in `Content-Type: text/calendar; charset=utf-8`.

## Time zone

Since events are **all-day** (`VALUE=DATE`, no time), no `VTIMEZONE` is needed;
they display on the correct day regardless of the client's time zone.
`X-WR-TIMEZONE:Africa/Addis_Ababa` documents the reference time zone.

## HTTP responses

```
Content-Type: text/calendar; charset=utf-8
Content-Disposition: inline; filename="<feed>.ics"
Cache-Control: public, max-age=3600, s-maxage=43200, stale-while-revalidate=86400
```

`s-maxage` lets the CDN (Vercel) cache the response for 12 h; see DEPLOYMENT.md.

## Google Calendar compatibility — watch-outs

- Google **caches** subscriptions by URL and refreshes at **its** own cadence
  (often 8–24 h, sometimes more). `REFRESH-INTERVAL` is only advisory.
- The stable `UID` avoids duplicates on re-import.
- The `.ics` feeds cover a **rolling window of years** (year−1 → year+3) to stay
  populated without changing the URL.
- Use **"From URL"** (not "Import") for a live subscription.
