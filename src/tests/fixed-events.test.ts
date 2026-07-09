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
  if (!def) throw new Error(`Définition introuvable : ${id}`);
  return def;
}

describe("résolution des événements fixes", () => {
  it("Meskel (Meskerem 17) tombe le 27/28 septembre", () => {
    const ev = resolveEvent(byId("meskel"), 2026)!;
    expect(ev.start).toEqual({ year: 2026, month: 9, day: 27 });
  });

  it("Genna (Tahsas 29) tombe en janvier de l'année demandée", () => {
    const ev = resolveEvent(byId("genna"), 2026)!;
    expect(ev.start).toEqual({ year: 2026, month: 1, day: 7 });
  });

  it("les événements all-day ont un DTEND exclusif (début + 1)", () => {
    const ev = resolveEvent(byId("meskel"), 2026)!;
    expect(gregorianToJDN(ev.end) - gregorianToJDN(ev.start)).toBe(1);
  });

  it("les jours fériés civils grégoriens sont fixes (1er mai)", () => {
    const ev = resolveEvent(byId("labour-day"), 2026)!;
    expect(ev.start).toEqual({ year: 2026, month: 5, day: 1 });
  });
});

describe("résolution des périodes de jeûne", () => {
  it("le Grand Carême dure 55 jours", () => {
    const ev = resolveEvent(byId("abiy-tsom"), 2026)!;
    expect(gregorianToJDN(ev.end) - gregorianToJDN(ev.start)).toBe(55);
  });

  it("le jeûne des Apôtres se termine après son début (longueur variable)", () => {
    const ev = resolveEvent(byId("tsome-hawaryat"), 2026)!;
    expect(gregorianToJDN(ev.end)).toBeGreaterThan(gregorianToJDN(ev.start));
  });

  it("le jeûne de l'Avent (Hidar 15 → Tahsas 28) chevauche le Nouvel An grégorien", () => {
    const ev = resolveEvent(byId("tsome-gena"), 2026)!;
    // Débute en novembre/décembre, se termine début janvier suivant.
    expect(ev.start.month).toBeGreaterThanOrEqual(11);
    expect(ev.end.year).toBe(ev.start.year + 1);
  });
});

describe("UID et agrégation", () => {
  it("génère des UID stables et déterministes", () => {
    expect(buildUid("genna", 2026)).toBe(
      "genna-2026@ethiopian-calendar-converter",
    );
    expect(resolveEvent(byId("genna"), 2026)!.uid).toBe(
      "genna-2026@ethiopian-calendar-converter",
    );
  });

  it("filtre par catégorie et trie par date de début", () => {
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
