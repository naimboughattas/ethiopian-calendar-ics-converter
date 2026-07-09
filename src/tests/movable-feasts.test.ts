import { describe, expect, it } from "vitest";
import { addDays } from "@/calendar/gregorian-date";
import { fasikaGregorian, resolveMovable } from "@/calendar/orthodox-rules";

describe("Fasika (Pâques orthodoxe)", () => {
  // Dates de référence de la Pâque orthodoxe (grégorien).
  const anchors: [number, number, number][] = [
    [2022, 4, 24],
    [2023, 4, 16],
    [2024, 5, 5],
    [2025, 4, 20],
    [2026, 4, 12],
    [2027, 5, 2],
  ];

  it.each(anchors)("Fasika %i = %i/%i", (y, m, d) => {
    expect(fasikaGregorian(y)).toEqual({ year: y, month: m, day: d });
  });
});

describe("fêtes mobiles dérivées de Fasika", () => {
  it("Hosanna = Fasika − 7 jours", () => {
    const fasika = fasikaGregorian(2026);
    expect(resolveMovable("hosanna", 2026)).toEqual(addDays(fasika, -7));
  });

  it("Siklet = Fasika − 2 jours", () => {
    const fasika = fasikaGregorian(2026);
    expect(resolveMovable("siklet", 2026)).toEqual(addDays(fasika, -2));
  });

  it("Erget (Ascension) = Fasika + 39 jours", () => {
    const fasika = fasikaGregorian(2026);
    expect(resolveMovable("erget", 2026)).toEqual(addDays(fasika, 39));
  });

  it("Peraklitos (Pentecôte) = Fasika + 49 jours", () => {
    const fasika = fasikaGregorian(2026);
    expect(resolveMovable("peraklitos", 2026)).toEqual(addDays(fasika, 49));
  });

  it("le Grand Carême commence 55 jours avant Fasika", () => {
    const fasika = fasikaGregorian(2026);
    expect(resolveMovable("abiy_tsom_start", 2026)).toEqual(
      addDays(fasika, -55),
    );
  });
});
