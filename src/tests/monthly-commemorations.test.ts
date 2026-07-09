import { describe, expect, it } from "vitest";
import {
  resolveEventsForYear,
  resolveEventsForYearRange,
} from "@/calendar/fixed-events";
import { gregorianToEthiopian } from "@/calendar/conversion";
import { generateMonthlyCommemorations } from "@/calendar/monthly-commemorations";
import { MONTHLY_COMMEMORATIONS } from "@/data/monthly-commemorations";

describe("monthly commemorations", () => {
  const events = generateMonthlyCommemorations(2026);

  it("produces 12 occurrences per commemoration (months 1..12)", () => {
    expect(events).toHaveLength(MONTHLY_COMMEMORATIONS.length * 12);
    for (const c of MONTHLY_COMMEMORATIONS) {
      const occ = events.filter((e) => e.definitionId === `monthly-${c.id}`);
      expect(occ).toHaveLength(12);
    }
  });

  it("each occurrence falls on the expected Ethiopian day-of-month", () => {
    for (const ev of events) {
      const c = MONTHLY_COMMEMORATIONS.find(
        (x) => `monthly-${x.id}` === ev.definitionId,
      )!;
      const eth = gregorianToEthiopian(ev.start);
      expect(eth.day).toBe(c.day);
      expect(eth.month).toBeGreaterThanOrEqual(1);
      expect(eth.month).toBeLessThanOrEqual(12);
    }
  });

  it("each occurrence is in the requested Gregorian year", () => {
    for (const ev of events) expect(ev.start.year).toBe(2026);
  });

  it("the 12 occurrences of a commemoration span 12 distinct Ethiopian months", () => {
    const mikael = events.filter((e) => e.definitionId === "monthly-mikael");
    const ethMonths = new Set(mikael.map((e) => gregorianToEthiopian(e.start).month));
    expect(ethMonths.size).toBe(12);
  });

  it("generates stable UIDs per date", () => {
    const first = events.find((e) => e.definitionId === "monthly-mikael")!;
    const y = first.start.year;
    const m = String(first.start.month).padStart(2, "0");
    const d = String(first.start.day).padStart(2, "0");
    expect(first.uid).toBe(
      `monthly-mikael-${y}${m}${d}@ethiopian-calendar-converter`,
    );
  });

  it("is deterministic", () => {
    expect(generateMonthlyCommemorations(2026)).toEqual(events);
  });

  it("handles several commemorations on the same day-of-month (e.g. day 5)", () => {
    const day5 = MONTHLY_COMMEMORATIONS.filter((c) => c.day === 5);
    expect(day5.length).toBeGreaterThanOrEqual(2);
    // Each day-5 commemoration must have its 12 occurrences, on the same dates
    // as its neighbors but with a distinct UID.
    const ids = day5.map((c) => `monthly-${c.id}`);
    for (const id of ids) {
      expect(events.filter((e) => e.definitionId === id)).toHaveLength(12);
    }
    const uids = events
      .filter((e) => ids.includes(e.definitionId))
      .map((e) => e.uid);
    expect(new Set(uids).size).toBe(uids.length); // no duplicate UID
  });
});

describe("integration with the resolution engine", () => {
  it("adds nothing without the includeMonthlyCommemorations option", () => {
    const withoutMonthly = resolveEventsForYear(2026, ["commemoration"]);
    expect(withoutMonthly).toHaveLength(0);
  });

  it("adds the commemorations when requested", () => {
    const withMonthly = resolveEventsForYear(2026, ["commemoration"], {
      includeMonthlyCommemorations: true,
    });
    expect(withMonthly.length).toBe(MONTHLY_COMMEMORATIONS.length * 12);
    expect(withMonthly.every((e) => e.category === "commemoration")).toBe(true);
  });

  it("the multi-year feed does not throw on a boundary date (500 regression)", () => {
    // 2027 skips Tahsas 22 (Uriel): the feed must ignore it, not crash.
    expect(() =>
      resolveEventsForYearRange(2025, 2029, ["commemoration"], {
        includeMonthlyCommemorations: true,
      }),
    ).not.toThrow();
    const range = resolveEventsForYearRange(2025, 2029, ["commemoration"], {
      includeMonthlyCommemorations: true,
    });
    expect(range.length).toBeGreaterThan(0);
  });
});
