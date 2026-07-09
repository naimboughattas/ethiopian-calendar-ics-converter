import { describe, expect, it } from "vitest";
import {
  allDefinitions,
  buildUid,
  resolveEvent,
  resolveEventsForYear,
} from "@/calendar/fixed-events";
import { gregorianToJDN } from "@/calendar/gregorian-date";

function byId(id: string) {
  const def = allDefinitions().find((d) => d.id === id);
  if (!def) throw new Error(`Definition not found: ${id}`);
  return def;
}

describe("resolution of fixed events", () => {
  it("Meskel (Meskerem 17) falls on 27/28 September", () => {
    const ev = resolveEvent(byId("meskel"), 2026)!;
    expect(ev.start).toEqual({ year: 2026, month: 9, day: 27 });
  });

  it("Genna (Tahsas 29) falls in January of the requested year", () => {
    const ev = resolveEvent(byId("genna"), 2026)!;
    expect(ev.start).toEqual({ year: 2026, month: 1, day: 7 });
  });

  it("all-day events have an exclusive DTEND (start + 1)", () => {
    const ev = resolveEvent(byId("meskel"), 2026)!;
    expect(gregorianToJDN(ev.end) - gregorianToJDN(ev.start)).toBe(1);
  });

  it("Gregorian civil holidays are fixed (1 May)", () => {
    const ev = resolveEvent(byId("labour-day"), 2026)!;
    expect(ev.start).toEqual({ year: 2026, month: 5, day: 1 });
  });
});

describe("resolution of fasting periods", () => {
  it("Great Lent lasts 55 days", () => {
    const ev = resolveEvent(byId("abiy-tsom"), 2026)!;
    expect(gregorianToJDN(ev.end) - gregorianToJDN(ev.start)).toBe(55);
  });

  it("the Apostles' Fast ends after its start (variable length)", () => {
    const ev = resolveEvent(byId("tsome-hawaryat"), 2026)!;
    expect(gregorianToJDN(ev.end)).toBeGreaterThan(gregorianToJDN(ev.start));
  });

  it("the Advent fast (Hidar 15 → Tahsas 28) straddles the Gregorian New Year", () => {
    const ev = resolveEvent(byId("tsome-gena"), 2026)!;
    // Starts in November/December, ends early the following January.
    expect(ev.start.month).toBeGreaterThanOrEqual(11);
    expect(ev.end.year).toBe(ev.start.year + 1);
  });
});

describe("UID and aggregation", () => {
  it("generates stable, deterministic UIDs", () => {
    expect(buildUid("genna", 2026)).toBe(
      "genna-2026@ethiopian-calendar-converter",
    );
    expect(resolveEvent(byId("genna"), 2026)!.uid).toBe(
      "genna-2026@ethiopian-calendar-converter",
    );
  });

  it("filters by category and sorts by start date", () => {
    const fasting = resolveEventsForYear(2026, ["fasting"]);
    expect(fasting.length).toBeGreaterThan(0);
    expect(fasting.every((e) => e.category === "fasting")).toBe(true);
    for (let i = 1; i < fasting.length; i++) {
      expect(gregorianToJDN(fasting[i]!.start)).toBeGreaterThanOrEqual(
        gregorianToJDN(fasting[i - 1]!.start),
      );
    }
  });
});
