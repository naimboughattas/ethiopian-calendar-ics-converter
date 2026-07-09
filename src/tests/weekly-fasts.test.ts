import { describe, expect, it } from "vitest";
import { resolveEventsForYear } from "@/calendar/fixed-events";
import { dayOfWeek, gregorianToJDN } from "@/calendar/gregorian-date";
import { fasikaGregorian } from "@/calendar/orthodox-rules";
import { generateWeeklyFasts } from "@/calendar/weekly-fasts";

const WEDNESDAY = 2;
const FRIDAY = 4;

describe("jour de la semaine (JDN)", () => {
  it("place correctement des dates de référence", () => {
    // 1er janvier 2000 = samedi (5) ; 1er janvier 2026 = jeudi (3).
    expect(dayOfWeek(gregorianToJDN({ year: 2000, month: 1, day: 1 }))).toBe(5);
    expect(dayOfWeek(gregorianToJDN({ year: 2026, month: 1, day: 1 }))).toBe(3);
  });
});

describe("jeûnes hebdomadaires (mercredi/vendredi)", () => {
  const weekly = generateWeeklyFasts(2026, []);

  it("ne produit que des mercredis et des vendredis", () => {
    for (const ev of weekly) {
      const dow = dayOfWeek(gregorianToJDN(ev.start));
      expect(dow === WEDNESDAY || dow === FRIDAY).toBe(true);
    }
  });

  it("exclut la fenêtre pascale (Fasika → Pentecôte, 50 jours)", () => {
    const fasika = gregorianToJDN(fasikaGregorian(2026));
    for (const ev of weekly) {
      const jdn = gregorianToJDN(ev.start);
      const inPaschal = jdn >= fasika && jdn <= fasika + 49;
      expect(inPaschal).toBe(false);
    }
  });

  it("respecte les intervalles d'exclusion fournis", () => {
    // Exclut toute la première quinzaine de mars 2026.
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

  it("génère des UID stables et déterministes par date", () => {
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

  it("est déterministe (deux générations identiques)", () => {
    expect(generateWeeklyFasts(2026, [])).toEqual(weekly);
  });
});

describe("intégration au moteur de résolution", () => {
  it("n'ajoute rien sans l'option includeWeeklyFasts", () => {
    const withoutWeekly = resolveEventsForYear(2026, ["fasting"]);
    expect(
      withoutWeekly.some((e) => e.definitionId.startsWith("weekly-fast")),
    ).toBe(false);
  });

  it("ajoute les jeûnes hebdomadaires quand demandé", () => {
    const withWeekly = resolveEventsForYear(2026, ["fasting"], {
      includeWeeklyFasts: true,
    });
    const weeklyCount = withWeekly.filter((e) =>
      e.definitionId.startsWith("weekly-fast"),
    ).length;
    // ~90 mercredis/vendredis hors fenêtre pascale, réduits par l'exclusion
    // des grands jeûnes → une quarantaine de jours « ordinaires ».
    expect(weeklyCount).toBeGreaterThan(40);
    expect(weeklyCount).toBeLessThan(generateWeeklyFasts(2026, []).length);
  });

  it("ne place pas de jeûne hebdomadaire sur une grande fête (jeûne levé)", () => {
    // Genna 2026 (Tahsas 29) tombe le 7 janvier 2026, un mercredi : la fête
    // lève le jeûne du mercredi, aucun événement `weekly-fast` ce jour-là.
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

  it("les jeûnes hebdomadaires ne recouvrent pas les grands jeûnes (anti-doublon)", () => {
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
