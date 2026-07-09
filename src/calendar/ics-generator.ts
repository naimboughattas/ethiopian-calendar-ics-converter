import type { Locale, ResolvedEvent } from "@/types/event";
import { toIcsDate } from "./gregorian-date";

/**
 * Génération d'un flux iCalendar (RFC 5545) compatible Google Calendar.
 *
 * Choix clés :
 *  - événements « journée entière » via `VALUE=DATE` (DTSTART/DTEND) ;
 *  - DTEND exclusif (convention iCalendar) ;
 *  - UID stables et déterministes ;
 *  - lignes terminées par CRLF et pliées à 75 octets ;
 *  - fuseau déclaré via X-WR-TIMEZONE (Africa/Addis_Ababa) — les événements
 *    all-day n'ont pas besoin de VTIMEZONE.
 */

const PRODID = "-//ethiopian-calendar-converter//EN";
const TIMEZONE = "Africa/Addis_Ababa";
const CRLF = "\r\n";

export type IcsOptions = {
  locale: Locale;
  calendarName: string;
  /** Valeur DTSTAMP fixe (format `YYYYMMDDTHHMMSSZ`). Par défaut : maintenant. */
  dtstamp?: string;
};

/** Échappe une valeur texte iCalendar (RFC 5545 §3.3.11). */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Plie une ligne de contenu à 75 octets (RFC 5545 §3.1), les continuations
 * commençant par une espace. Le pliage compte en octets UTF-8, pas en
 * caractères (important pour l'amharique).
 */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) return line;

  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let current: number[] = [];
  let isFirst = true;
  for (const byte of bytes) {
    // 75 octets pour la 1re ligne, 74 pour les suivantes (espace de tête).
    const limit = isFirst ? 75 : 74;
    if (current.length >= limit) {
      chunks.push(decoder.decode(new Uint8Array(current)));
      current = [];
      isFirst = false;
    }
    current.push(byte);
  }
  if (current.length > 0) chunks.push(decoder.decode(new Uint8Array(current)));
  return chunks.join(`${CRLF} `);
}

/** Horodatage UTC déterministe au format iCalendar. */
function nowStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function pickLocale(
  text: Partial<Record<Locale, string>> | undefined,
  locale: Locale,
): string | undefined {
  if (!text) return undefined;
  return text[locale] ?? text.fr ?? text.en;
}

/** Construit un unique bloc VEVENT. */
function buildEvent(event: ResolvedEvent, options: IcsOptions): string[] {
  const summary = pickLocale(event.title, options.locale) ?? event.definitionId;
  const description = pickLocale(event.description, options.locale);
  const dtstamp = options.dtstamp ?? nowStamp();

  const lines: string[] = [
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${toIcsDate(event.start)}`,
    `DTEND;VALUE=DATE:${toIcsDate(event.end)}`,
    `SUMMARY:${escapeText(summary)}`,
  ];
  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`);
  lines.push(`CATEGORIES:${escapeText(event.category)}`);
  lines.push("TRANSP:TRANSPARENT");
  lines.push("END:VEVENT");
  return lines;
}

/** Génère le flux ICS complet à partir d'occurrences résolues. */
export function generateIcs(
  events: ResolvedEvent[],
  options: IcsOptions,
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(options.calendarName)}`,
    `X-WR-TIMEZONE:${TIMEZONE}`,
    "X-PUBLISHED-TTL:PT12H",
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
  ];

  for (const event of events) lines.push(...buildEvent(event, options));

  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join(CRLF) + CRLF;
}
