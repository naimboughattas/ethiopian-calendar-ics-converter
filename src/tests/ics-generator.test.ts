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

describe("iCalendar structure", () => {
  const ics = build();

  it("has the VCALENDAR envelope", () => {
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("declares the Africa/Addis_Ababa time zone", () => {
    expect(ics).toContain("X-WR-TIMEZONE:Africa/Addis_Ababa");
  });

  it("uses CRLF-terminated lines", () => {
    expect(ics.includes("\r\n")).toBe(true);
    // No LF not preceded by CR.
    expect(/[^\r]\n/.test(ics)).toBe(false);
  });

  it("emits all-day events with VALUE=DATE and an exclusive DTEND", () => {
    expect(ics).toMatch(/DTSTART;VALUE=DATE:\d{8}/);
    expect(ics).toMatch(/DTEND;VALUE=DATE:\d{8}/);
  });

  it("includes UID, DTSTAMP, SUMMARY and CATEGORIES per event", () => {
    expect(ics).toContain("UID:genna-2026@ethiopian-calendar-converter");
    expect(ics).toContain(`DTSTAMP:${FIXED_STAMP}`);
    expect(ics).toMatch(/SUMMARY:/);
    expect(ics).toMatch(/CATEGORIES:/);
  });

  it("is deterministic (two identical generations)", () => {
    expect(build()).toBe(ics);
  });
});

describe("escaping and folding", () => {
  it("escapes iCalendar special characters", () => {
    expect(escapeText("a;b,c\\d\ne")).toBe("a\\;b\\,c\\\\d\\ne");
  });

  it("folds lines longer than 75 octets with a space continuation", () => {
    const long = `SUMMARY:${"x".repeat(100)}`;
    const folded = foldLine(long);
    expect(folded).toContain("\r\n ");
    for (const physical of folded.split("\r\n")) {
      expect(new TextEncoder().encode(physical).length).toBeLessThanOrEqual(75);
    }
  });

  it("does not fold short lines", () => {
    expect(foldLine("VERSION:2.0")).toBe("VERSION:2.0");
  });
});
