import { describe, expect, it } from "vitest";
import {
  ethiopianToGregorian,
  gregorianToEthiopian,
  resolveEthiopianDateInGregorianYear,
} from "@/calendar/conversion";
import {
  daysInEthiopianMonth,
  daysInEthiopianYear,
  isEthiopianLeapYear,
} from "@/calendar/ethiopian-date";
import { gregorianToJDN, jdnToGregorian } from "@/calendar/gregorian-date";

describe("conversion éthiopien → grégorien", () => {
  // Nouvel An éthiopien (Meskerem 1). Sept 11, ou Sept 12 l'année précédant
  // une année bissextile grégorienne.
  const newYearAnchors: [number, number, number][] = [
    [2016, 2023, 12], // avant l'année bissextile 2024
    [2017, 2024, 11],
    [2018, 2025, 11],
    [2019, 2026, 11],
    [2020, 2027, 12], // avant l'année bissextile 2028
  ];

  it.each(newYearAnchors)(
    "Meskerem 1 EC %i → %i-09-%i",
    (ey, gy, gd) => {
      expect(ethiopianToGregorian({ year: ey, month: 1, day: 1 })).toEqual({
        year: gy,
        month: 9,
        day: gd,
      });
    },
  );

  it("Genna (Tahsas 29) EC 2018 → 2026-01-07 (année normale)", () => {
    expect(ethiopianToGregorian({ year: 2018, month: 4, day: 29 })).toEqual({
      year: 2026,
      month: 1,
      day: 7,
    });
  });

  it("Genna (Tahsas 29) EC 2016 → 2024-01-08 (décalage +1 avant bissextile)", () => {
    expect(ethiopianToGregorian({ year: 2016, month: 4, day: 29 })).toEqual({
      year: 2024,
      month: 1,
      day: 8,
    });
  });
});

describe("conversion grégorien → éthiopien (inverse)", () => {
  it("est l'inverse exact sur une large plage de JDN", () => {
    for (let jdn = 2_450_000; jdn <= 2_480_000; jdn += 1) {
      const g = jdnToGregorian(jdn);
      const eth = gregorianToEthiopian(g);
      const back = ethiopianToGregorian(eth);
      expect(gregorianToJDN(back)).toBe(jdn);
    }
  });
});

describe("années bissextiles éthiopiennes", () => {
  it.each([2011, 2015, 2019, 2023])("EC %i est bissextile", (y) => {
    expect(isEthiopianLeapYear(y)).toBe(true);
  });

  it.each([2016, 2017, 2018, 2020])("EC %i n'est pas bissextile", (y) => {
    expect(isEthiopianLeapYear(y)).toBe(false);
  });

  it("Pagumē a 6 jours en année bissextile, 5 sinon", () => {
    expect(daysInEthiopianMonth(2015, 13)).toBe(6);
    expect(daysInEthiopianMonth(2016, 13)).toBe(5);
    expect(daysInEthiopianYear(2015)).toBe(366);
    expect(daysInEthiopianYear(2016)).toBe(365);
  });

  it("les 12 premiers mois ont toujours 30 jours", () => {
    for (let m = 1; m <= 12; m++) {
      expect(daysInEthiopianMonth(2016, m)).toBe(30);
    }
  });
});

describe("résolution d'une date éthiopienne dans une année grégorienne", () => {
  it("choisit la bonne occurrence pour Genna (janvier)", () => {
    // Tahsas 29 en 2026 vient de l'année éthiopienne 2018.
    expect(resolveEthiopianDateInGregorianYear(4, 29, 2026)).toEqual({
      year: 2026,
      month: 1,
      day: 7,
    });
  });

  it("choisit la bonne occurrence pour Meskel (septembre)", () => {
    // Meskerem 17 en 2026 vient de l'année éthiopienne 2019.
    expect(resolveEthiopianDateInGregorianYear(1, 17, 2026)).toEqual({
      year: 2026,
      month: 9,
      day: 27,
    });
  });

  it("renvoie null quand la date éthiopienne saute une année grégorienne", () => {
    // Tahsas 22 tombe le 31 déc. 2026 puis le 1er jan. 2028 : aucune
    // occurrence en 2027 (cas frontière du Nouvel An grégorien).
    expect(resolveEthiopianDateInGregorianYear(4, 22, 2027)).toBeNull();
    // Mais elle existe bien dans les années adjacentes.
    expect(resolveEthiopianDateInGregorianYear(4, 22, 2026)).not.toBeNull();
    expect(resolveEthiopianDateInGregorianYear(4, 22, 2028)).not.toBeNull();
  });
});
