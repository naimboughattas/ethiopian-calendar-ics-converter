import {
  isWeeklyFast,
  resolveEventsForYearRange,
} from "@/calendar/fixed-events";
import { generateIcs } from "@/calendar/ics-generator";
import { FEEDS, isFeedType } from "@/data/event-categories";
import type { Locale } from "@/types/event";

/**
 * Flux `.ics` abonnables et stables :
 *   GET /api/calendar/all.ics
 *   GET /api/calendar/ethiopian-orthodox.ics
 *   GET /api/calendar/ethiopian-cultural.ics
 *   GET /api/calendar/ethiopian-fasting.ics
 *
 * Ces URLs génèrent une fenêtre glissante d'années (année-1 → année+3) pour
 * que l'abonnement Google Calendar reste alimenté sans changer d'URL.
 * `?lang=` permet de choisir la langue (fr par défaut).
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
    return new Response("Ressource introuvable (attendu *.ics).", {
      status: 404,
    });
  }
  const feedType = raw.slice(0, -".ics".length);
  if (!isFeedType(feedType)) {
    return new Response(
      `Flux inconnu. Valeurs : ${Object.keys(FEEDS)
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
      // Cache CDN (Vercel) 12 h + service en arrière-plan pendant 24 h.
      "Cache-Control":
        "public, max-age=3600, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
