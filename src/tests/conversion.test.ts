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

describe("Ethiopian → Gregorian conversion", () => {
  // Ethiopian New Year (Meskerem 1). Sept 11, or Sept 12 in the year preceding
  // a Gregorian leap year.
  const newYearAnchors: [number, number, number][] = [
    [2016, 2023, 12], // before the 2024 leap year
    [2017, 2024, 11],
    [2018, 2025, 11],
    [2019, 2026, 11],
    [2020, 2027, 12], // before the 2028 leap year
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

  it("Genna (Tahsas 29) EC 2018 → 2026-01-07 (normal year)", () => {
    expect(ethiopianToGregorian({ year: 2018, month: 4, day: 29 })).toEqual({
      year: 2026,
      month: 1,
      day: 7,
    });
  });

  it("Genna (Tahsas 29) EC 2016 → 2024-01-08 (+1 shift before leap year)", () => {
    expect(ethiopianToGregorian({ year: 2016, month: 4, day: 29 })).toEqual({
      year: 2024,
      month: 1,
      day: 8,
    });
  });
});

describe("Gregorian → Ethiopian conversion (inverse)", () => {
  it("is the exact inverse over a large JDN range", () => {
    for (let jdn = 2_450_000; jdn <= 2_480_000; jdn += 1) {
      const g = jdnToGregorian(jdn);
      const eth = gregorianToEthiopian(g);
      const back = ethiopianToGregorian(eth);
      expect(gregorianToJDN(back)).toBe(jdn);
    }
  });
});

describe("Ethiopian leap years", () => {
  it.each([2011, 2015, 2019, 2023])("EC %i is a leap year", (y) => {
    expect(isEthiopianLeapYear(y)).toBe(true);
  });

  it.each([2016, 2017, 2018, 2020])("EC %i is not a leap year", (y) => {
    expect(isEthiopianLeapYear(y)).toBe(false);
  });

  it("Pagumē has 6 days in a leap year, 5 otherwise", () => {
    expect(daysInEthiopianMonth(2015, 13)).toBe(6);
    expect(daysInEthiopianMonth(2016, 13)).toBe(5);
    expect(daysInEthiopianYear(2015)).toBe(366);
    expect(daysInEthiopianYear(2016)).toBe(365);
  });

  it("the first 12 months always have 30 days", () => {
    for (let m = 1; m <= 12; m++) {
      expect(daysInEthiopianMonth(2016, m)).toBe(30);
    }
  });
});

describe("resolving an Ethiopian date within a Gregorian year", () => {
  it("picks the right occurrence for Genna (January)", () => {
    // Tahsas 29 in 2026 comes from Ethiopian year 2018.
    expect(resolveEthiopianDateInGregorianYear(4, 29, 2026)).toEqual({
      year: 2026,
      month: 1,
      day: 7,
    });
  });

  it("picks the right occurrence for Meskel (September)", () => {
    // Meskerem 17 in 2026 comes from Ethiopian year 2019.
    expect(resolveEthiopianDateInGregorianYear(1, 17, 2026)).toEqual({
      year: 2026,
      month: 9,
      day: 27,
    });
  });

  it("returns null when the Ethiopian date skips a Gregorian year", () => {
    // Tahsas 22 falls on 31 Dec 2026 then 1 Jan 2028: no occurrence in 2027
    // (Gregorian New Year boundary case).
    expect(resolveEthiopianDateInGregorianYear(4, 22, 2027)).toBeNull();
    // But it does exist in the adjacent years.
    expect(resolveEthiopianDateInGregorianYear(4, 22, 2026)).not.toBeNull();
    expect(resolveEthiopianDateInGregorianYear(4, 22, 2028)).not.toBeNull();
  });
});
