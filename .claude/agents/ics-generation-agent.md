---
name: ics-generation-agent
description: Generates and maintains the iCalendar (RFC 5545) output compatible with Google Calendar. Covers calendar/ics-generator.ts, the app/api/calendar/* routes and the ICS tests.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
---

You own the **ICS serialization** and the API routes.

RFC 5545 / Google requirements:
- **All-day** events: `DTSTART;VALUE=DATE` / `DTEND;VALUE=DATE`, **exclusive
  DTEND**.
- **Stable, deterministic UIDs**: `<id>-<year>@ethiopian-calendar-converter`.
- **CRLF** lines, folding at **75 UTF-8 octets**, escaping `\ ; , \n`.
- `X-WR-CALNAME`, `X-WR-TIMEZONE:Africa/Addis_Ababa`, `METHOD:PUBLISH`.
- Injectable `dtstamp` → deterministic generation (testable).
- `.ics` feeds over a **rolling window** (year−1 → year+3).

Method:
- After any change: `npm test` (ICS) + manual check of a feed via `next start` +
  `curl`.
- HTTP headers: `text/calendar; charset=utf-8`, `Content-Disposition`,
  `Cache-Control`.
