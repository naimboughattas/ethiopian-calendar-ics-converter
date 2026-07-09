import { describe, expect, it } from "vitest";
import {
  resolveEventsForYear,
  resolveEventsForYearRange,
} from "@/calendar/fixed-events";
import { gregorianToEthiopian } from "@/calendar/conversion";
import { generateMonthlyCommemorations } from "@/calendar/monthly-commemorations";
import { MONTHLY_COMMEMORATIONS } from "@/data/monthly-commemorations";

describe("commémorations mensuelles", () => {
  const events = generateMonthlyCommemorations(2026);

  it("produit 12 occurrences par commémoration (mois 1..12)", () => {
    expect(events).toHaveLength(MONTHLY_COMMEMORATIONS.length * 12);
    for (const c of MONTHLY_COMMEMORATIONS) {
      const occ = events.filter((e) => e.definitionId === `monthly-${c.id}`);
      expect(occ).toHaveLength(12);
    }
  });

  it("chaque occurrence tombe bien sur le quantième éthiopien attendu", () => {
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

  it("chaque occurrence est dans l'année grégorienne demandée", () => {
    for (const ev of events) expect(ev.start.year).toBe(2026);
  });

  it("les 12 occurrences d'une commémoration couvrent 12 mois éthiopiens distincts", () => {
    const mikael = events.filter((e) => e.definitionId === "monthly-mikael");
    const ethMonths = new Set(mikael.map((e) => gregorianToEthiopian(e.start).month));
    expect(ethMonths.size).toBe(12);
  });

  it("génère des UID stables par date", () => {
    const first = events.find((e) => e.definitionId === "monthly-mikael")!;
    const y = first.start.year;
    const m = String(first.start.month).padStart(2, "0");
    const d = String(first.start.day).padStart(2, "0");
    expect(first.uid).toBe(
      `monthly-mikael-${y}${m}${d}@ethiopian-calendar-converter`,
    );
  });

  it("est déterministe", () => {
    expect(generateMonthlyCommemorations(2026)).toEqual(events);
  });

  it("gère plusieurs commémorations le même quantième (ex. jour 5)", () => {
    const day5 = MONTHLY_COMMEMORATIONS.filter((c) => c.day === 5);
    expect(day5.length).toBeGreaterThanOrEqual(2);
    // Chaque commémorations du jour 5 doit avoir ses 12 occurrences, sur les
    // mêmes dates que ses voisines mais avec un UID distinct.
    const ids = day5.map((c) => `monthly-${c.id}`);
    for (const id of ids) {
      expect(events.filter((e) => e.definitionId === id)).toHaveLength(12);
    }
    const uids = events
      .filter((e) => ids.includes(e.definitionId))
      .map((e) => e.uid);
    expect(new Set(uids).size).toBe(uids.length); // aucun doublon d'UID
  });
});

describe("intégration au moteur de résolution", () => {
  it("n'ajoute rien sans l'option includeMonthlyCommemorations", () => {
    const withoutMonthly = resolveEventsForYear(2026, ["commemoration"]);
    expect(withoutMonthly).toHaveLength(0);
  });

  it("ajoute les commémorations quand demandé", () => {
    const withMonthly = resolveEventsForYear(2026, ["commemoration"], {
      includeMonthlyCommemorations: true,
    });
    expect(withMonthly.length).toBe(MONTHLY_COMMEMORATIONS.length * 12);
    expect(withMonthly.every((e) => e.category === "commemoration")).toBe(true);
  });

  it("le flux multi-années ne lève pas sur une date frontière (régression 500)", () => {
    // 2027 saute Tahsas 22 (Uriel) : le flux doit l'ignorer, pas planter.
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
