import { describe, expect, it } from "vitest";
import { resolveEventsForYear } from "@/calendar/fixed-events";
import {
  escapeText,
  foldLine,
  generateIcs,
} from "@/calendar/ics-generator";

const FIXED_STAMP = "20260101T000000Z";

function build(year = 2026, categories?: undefined) {
  const events = resolveEventsForYear(year, categories);
  return generateIcs(events, {
    locale: "fr",
    calendarName: "Test",
    dtstamp: FIXED_STAMP,
  });
}

describe("structure iCalendar", () => {
  const ics = build();

  it("possède l'enveloppe VCALENDAR", () => {
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("déclare le fuseau Africa/Addis_Ababa", () => {
    expect(ics).toContain("X-WR-TIMEZONE:Africa/Addis_Ababa");
  });

  it("utilise des lignes terminées par CRLF", () => {
    expect(ics.includes("\r\n")).toBe(true);
    // Aucun LF non précédé de CR.
    expect(/[^\r]\n/.test(ics)).toBe(false);
  });

  it("émet des événements all-day avec VALUE=DATE et DTEND exclusif", () => {
    expect(ics).toMatch(/DTSTART;VALUE=DATE:\d{8}/);
    expect(ics).toMatch(/DTEND;VALUE=DATE:\d{8}/);
  });

  it("inclut UID, DTSTAMP, SUMMARY et CATEGORIES par événement", () => {
    expect(ics).toContain("UID:genna-2026@ethiopian-calendar-converter");
    expect(ics).toContain(`DTSTAMP:${FIXED_STAMP}`);
    expect(ics).toMatch(/SUMMARY:/);
    expect(ics).toMatch(/CATEGORIES:/);
  });

  it("est déterministe (deux générations identiques)", () => {
    expect(build()).toBe(ics);
  });
});

describe("échappement et pliage", () => {
  it("échappe les caractères spéciaux iCalendar", () => {
    expect(escapeText("a;b,c\\d\ne")).toBe("a\\;b\\,c\\\\d\\ne");
  });

  it("plie les lignes de plus de 75 octets avec continuation par espace", () => {
    const long = `SUMMARY:${"x".repeat(100)}`;
    const folded = foldLine(long);
    expect(folded).toContain("\r\n ");
    for (const physical of folded.split("\r\n")) {
      expect(new TextEncoder().encode(physical).length).toBeLessThanOrEqual(75);
    }
  });

  it("ne plie pas les lignes courtes", () => {
    expect(foldLine("VERSION:2.0")).toBe("VERSION:2.0");
  });
});
