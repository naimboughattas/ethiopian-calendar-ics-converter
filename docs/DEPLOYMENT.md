# Deployment (Vercel)

The project is a standard Next.js app: **zero-configuration** deployment on
Vercel. The `/api/calendar/*` routes become serverless functions; the `.ics`
feeds are cached at the CDN level (see headers below).

## Prerequisites

- A Vercel account.
- Node ≥ 20 (pinned via `engines` in `package.json`).
- The Git repository initialized (done) — useful for continuous deployment via
  GitHub.

## Option A — GitHub import (recommended, continuous deployment)

1. Create a GitHub repository and push the code:
   ```bash
   git remote add origin git@github.com:<user>/ethiopian-calendar-converter.git
   git push -u origin main
   ```
2. On https://vercel.com → **Add New… → Project** → import the repository.
3. Detected framework: **Next.js**. No settings to change.
4. **Deploy**. Every `git push` to `main` redeploys automatically.

## Option B — CLI (manual deployment)

```bash
npm i -g vercel      # or npx vercel
vercel login         # interactive OAuth (browser)
vercel               # preview deployment
vercel --prod        # production deployment
```

> In a non-interactive environment (CI), use a token:
> `vercel --prod --token "$VERCEL_TOKEN" --yes`.
> Create the token at https://vercel.com/account/tokens.

## After deployment — subscription URLs

Replace `<app>` with the assigned domain (e.g. `ethiopian-calendar.vercel.app`):

```
https://<app>/api/calendar/all.ics
https://<app>/api/calendar/ethiopian-orthodox.ics
https://<app>/api/calendar/ethiopian-cultural.ics
https://<app>/api/calendar/ethiopian-fasting.ics
https://<app>/api/calendar/ethiopian-weekly-fasts.ics
https://<app>/api/calendar/ethiopian-commemorations.ics
```

Parameters: `?lang=fr|en|am`, `?weekly=true`, `?monthly=true`.

Add to Google Calendar: **Other calendars → From URL** → paste the URL.

## CDN cache

The `.ics` responses send:

```
Cache-Control: public, max-age=3600, s-maxage=43200, stale-while-revalidate=86400
```

- `s-maxage=43200`: the Vercel CDN serves the cached response for **12 h** (the
  functions do not re-run for every subscriber).
- `stale-while-revalidate=86400`: serves the old version during regeneration,
  for up to 24 h.

These durations suit a calendar (nearly static content per year). Since the
content is recomputed over a **rolling window** (year−1 → year+3), the URLs do
not expire.

## Post-deployment checks

```bash
curl -I https://<app>/api/calendar/all.ics          # 200, text/calendar
curl -s https://<app>/api/calendar/all.ics | head   # BEGIN:VCALENDAR …
```

## Notes

- No environment variables required.
- No database: everything is computed on the fly (pure functions).
- Node runtime (default) — required because `TextEncoder`/`TextDecoder` and the
  date logic run server-side; do not force the Edge runtime.
