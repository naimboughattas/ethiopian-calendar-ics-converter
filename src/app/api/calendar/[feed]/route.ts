import {
  isWeeklyFast,
  resolveEventsForYearRange,
} from "@/calendar/fixed-events";
import { generateIcs } from "@/calendar/ics-generator";
import { FEEDS, isFeedType } from "@/data/event-categories";
import type { Locale } from "@/types/event";

/**
 * Subscribable, stable `.ics` feeds:
 *   GET /api/calendar/all.ics
 *   GET /api/calendar/ethiopian-orthodox.ics
 *   GET /api/calendar/ethiopian-cultural.ics
 *   GET /api/calendar/ethiopian-fasting.ics
 *
 * These URLs generate a rolling window of years (year-1 → year+3) so that the
 * Google Calendar subscription stays populated without changing the URL.
 * `?lang=` selects the language (fr by default).
 */
export const dynamic = "force-dynamic";

const LOCALES: Locale[] = ["fr", "en", "am"];
const YEARS_BACK = 1;
const YEARS_FORWARD = 3;

export function GET(
  request: Request,
  context: { params: { feed: string } },
): Response {
  const raw = context.params.feed;
  if (!raw.endsWith(".ics")) {
    return new Response("Resource not found (expected *.ics).", {
      status: 404,
    });
  }
  const feedType = raw.slice(0, -".ics".length);
  if (!isFeedType(feedType)) {
    return new Response(
      `Unknown feed. Values: ${Object.keys(FEEDS)
        .map((f) => `${f}.ics`)
        .join(", ")}.`,
      { status: 404 },
    );
  }

  const url = new URL(request.url);
  const langParam = (url.searchParams.get("lang") ?? "fr") as Locale;
  const locale: Locale = LOCALES.includes(langParam) ? langParam : "fr";

  const feed = FEEDS[feedType];
  const includeWeeklyFasts =
    feed.includeWeeklyFasts || url.searchParams.get("weekly") === "true";
  const includeMonthlyCommemorations =
    feed.includeMonthlyCommemorations ||
    url.searchParams.get("monthly") === "true";

  const currentYear = new Date().getUTCFullYear();
  let events = resolveEventsForYearRange(
    currentYear - YEARS_BACK,
    currentYear + YEARS_FORWARD,
    feed.categories,
    { includeWeeklyFasts, includeMonthlyCommemorations },
  );
  if (feed.weeklyFastsOnly) events = events.filter(isWeeklyFast);
  const ics = generateIcs(events, {
    locale,
    calendarName: feed.name[locale] ?? feed.name.fr,
  });

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${raw}"`,
      // CDN cache (Vercel) 12 h + background serving for 24 h.
      "Cache-Control":
        "public, max-age=3600, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
