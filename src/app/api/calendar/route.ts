import { isWeeklyFast, resolveEventsForYear } from "@/calendar/fixed-events";
import { generateIcs } from "@/calendar/ics-generator";
import { FEEDS, isFeedType } from "@/data/event-categories";
import type { Locale } from "@/types/event";

/**
 * GET /api/calendar?year=2026&type=all&lang=fr
 *
 * Renvoie un flux ICS pour l'année et le type de flux demandés.
 * - `year` : année grégorienne (par défaut : année courante).
 * - `type` : all | ethiopian-orthodox | ethiopian-cultural | ethiopian-fasting.
 * - `lang` : fr | en | am (par défaut fr).
 */
export const dynamic = "force-dynamic";

const LOCALES: Locale[] = ["fr", "en", "am"];

export function GET(request: Request): Response {
  const url = new URL(request.url);

  const year = Number.parseInt(
    url.searchParams.get("year") ?? String(new Date().getUTCFullYear()),
    10,
  );
  if (!Number.isFinite(year) || year < 1900 || year > 2200) {
    return new Response("Paramètre `year` invalide (attendu 1900–2200).", {
      status: 400,
    });
  }

  const typeParam = url.searchParams.get("type") ?? "all";
  if (!isFeedType(typeParam)) {
    return new Response(
      `Paramètre \`type\` invalide. Valeurs : ${Object.keys(FEEDS).join(", ")}.`,
      { status: 400 },
    );
  }

  const langParam = (url.searchParams.get("lang") ?? "fr") as Locale;
  const locale: Locale = LOCALES.includes(langParam) ? langParam : "fr";

  const feed = FEEDS[typeParam];
  const includeWeeklyFasts =
    feed.includeWeeklyFasts || url.searchParams.get("weekly") === "true";
  const includeMonthlyCommemorations =
    feed.includeMonthlyCommemorations ||
    url.searchParams.get("monthly") === "true";

  let events = resolveEventsForYear(year, feed.categories, {
    includeWeeklyFasts,
    includeMonthlyCommemorations,
  });
  if (feed.weeklyFastsOnly) events = events.filter(isWeeklyFast);
  const ics = generateIcs(events, {
    locale,
    calendarName: feed.name[locale] ?? feed.name.fr,
  });

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="ethiopian-${typeParam}-${year}.ics"`,
      // Cache CDN (Vercel) 12 h + service en arrière-plan pendant 24 h.
      "Cache-Control":
        "public, max-age=3600, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
