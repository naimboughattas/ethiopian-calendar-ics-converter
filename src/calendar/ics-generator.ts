import type { Locale, ResolvedEvent } from "@/types/event";
import { toIcsDate } from "./gregorian-date";

/**
 * Generation of an iCalendar (RFC 5545) feed compatible with Google Calendar.
 *
 * Key choices:
 *  - all-day events via `VALUE=DATE` (DTSTART/DTEND);
 *  - exclusive DTEND (iCalendar convention);
 *  - stable, deterministic UIDs;
 *  - lines terminated by CRLF and folded at 75 octets;
 *  - time zone declared via X-WR-TIMEZONE (Africa/Addis_Ababa) — all-day
 *    events do not need a VTIMEZONE.
 */

const PRODID = "-//ethiopian-calendar-converter//EN";
const TIMEZONE = "Africa/Addis_Ababa";
const CRLF = "\r\n";

export type IcsOptions = {
  locale: Locale;
  calendarName: string;
  /** Fixed DTSTAMP value (format `YYYYMMDDTHHMMSSZ`). Defaults to now. */
  dtstamp?: string;
};

/** Escapes an iCalendar text value (RFC 5545 §3.3.11). */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Folds a content line at 75 octets (RFC 5545 §3.1), continuations starting
 * with a space. Folding counts UTF-8 octets, not characters (important for
 * Amharic).
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
    // 75 octets for the first line, 74 for the following ones (leading space).
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

/** Deterministic UTC timestamp in iCalendar format. */
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

/** Builds a single VEVENT block. */
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

/** Generates the complete ICS feed from resolved occurrences. */
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
