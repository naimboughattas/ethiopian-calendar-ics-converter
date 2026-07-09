import { describe, expect, it } from "vitest";
import { resolveEventsForYear } from "@/calendar/fixed-events";
import { dayOfWeek, gregorianToJDN } from "@/calendar/gregorian-date";
import { fasikaGregorian } from "@/calendar/orthodox-rules";
import { generateWeeklyFasts } from "@/calendar/weekly-fasts";

const WEDNESDAY = 2;
const FRIDAY = 4;

describe("day of week (JDN)", () => {
  it("places reference dates correctly", () => {
    // 1 January 2000 = Saturday (5); 1 January 2026 = Thursday (3).
    expect(dayOfWeek(gregorianToJDN({ year: 2000, month: 1, day: 1 }))).toBe(5);
    expect(dayOfWeek(gregorianToJDN({ year: 2026, month: 1, day: 1 }))).toBe(3);
  });
});

describe("weekly fasts (Wednesday/Friday)", () => {
  const weekly = generateWeeklyFasts(2026, []);

  it("produces only Wednesdays and Fridays", () => {
    for (const ev of weekly) {
      const dow = dayOfWeek(gregorianToJDN(ev.start));
      expect(dow === WEDNESDAY || dow === FRIDAY).toBe(true);
    }
  });

  it("excludes the paschal window (Fasika → Pentecost, 50 days)", () => {
    const fasika = gregorianToJDN(fasikaGregorian(2026));
    for (const ev of weekly) {
      const jdn = gregorianToJDN(ev.start);
      const inPaschal = jdn >= fasika && jdn <= fasika + 49;
      expect(inPaschal).toBe(false);
    }
  });

  it("respects the provided exclusion intervals", () => {
    // Exclude the whole first half of March 2026.
    const from = gregorianToJDN({ year: 2026, month: 3, day: 1 });
    const to = gregorianToJDN({ year: 2026, month: 3, day: 15 });
    const filtered = generateWeeklyFasts(2026, [
      { startJdn: from, endExclusiveJdn: to },
    ]);
    for (const ev of filtered) {
      const jdn = gregorianToJDN(ev.start);
      expect(jdn >= from && jdn < to).toBe(false);
    }
  });

  it("generates stable, deterministic UIDs per date", () => {
    const wed = weekly.find(
      (e) => dayOfWeek(gregorianToJDN(e.start)) === WEDNESDAY,
    )!;
    const y = wed.start.year;
    const m = String(wed.start.month).padStart(2, "0");
    const d = String(wed.start.day).padStart(2, "0");
    expect(wed.uid).toBe(
      `weekly-fast-wed-${y}${m}${d}@ethiopian-calendar-converter`,
    );
  });

  it("is deterministic (two identical generations)", () => {
    expect(generateWeeklyFasts(2026, [])).toEqual(weekly);
  });
});

describe("integration with the resolution engine", () => {
  it("adds nothing without the includeWeeklyFasts option", () => {
    const withoutWeekly = resolveEventsForYear(2026, ["fasting"]);
    expect(
      withoutWeekly.some((e) => e.definitionId.startsWith("weekly-fast")),
    ).toBe(false);
  });

  it("adds the weekly fasts when requested", () => {
    const withWeekly = resolveEventsForYear(2026, ["fasting"], {
      includeWeeklyFasts: true,
    });
    const weeklyCount = withWeekly.filter((e) =>
      e.definitionId.startsWith("weekly-fast"),
    ).length;
    // ~90 Wednesdays/Fridays outside the paschal window, reduced by the
    // major-fast exclusion → about forty "ordinary" days.
    expect(weeklyCount).toBeGreaterThan(40);
    expect(weeklyCount).toBeLessThan(generateWeeklyFasts(2026, []).length);
  });

  it("does not place a weekly fast on a major feast (fast lifted)", () => {
    // Genna 2026 (Tahsas 29) falls on 7 January 2026, a Wednesday: the feast
    // lifts the Wednesday fast, so no `weekly-fast` event on that day.
    const withWeekly = resolveEventsForYear(2026, ["fasting"], {
      includeWeeklyFasts: true,
    });
    const gennaJdn = gregorianToJDN({ year: 2026, month: 1, day: 7 });
    expect(dayOfWeek(gennaJdn)).toBe(WEDNESDAY);
    const onGenna = withWeekly.filter(
      (e) =>
        e.definitionId.startsWith("weekly-fast") &&
        gregorianToJDN(e.start) === gennaJdn,
    );
    expect(onGenna).toHaveLength(0);
  });

  it("weekly fasts do not overlap the major fasts (anti-duplicate)", () => {
    const withWeekly = resolveEventsForYear(2026, ["fasting"], {
      includeWeeklyFasts: true,
    });
    const majors = withWeekly.filter(
      (e) => !e.definitionId.startsWith("weekly-fast"),
    );
    const weekly = withWeekly.filter((e) =>
      e.definitionId.startsWith("weekly-fast"),
    );
    for (const w of weekly) {
      const wJdn = gregorianToJDN(w.start);
      for (const major of majors) {
        const inMajor =
          wJdn >= gregorianToJDN(major.start) &&
          wJdn < gregorianToJDN(major.end);
        expect(inMajor).toBe(false);
      }
    }
  });
});
