import { describe, expect, it } from "vitest";
import { AYSHE_CAPSULE, QUESTIONS, computeCapsule } from "@/lib/capsule";

function all(): number[][] {
  const out: number[][] = [];
  for (let c = 0; c < 4 ** QUESTIONS.length; c++) out.push(QUESTIONS.map((_, i) => Math.floor(c / 4 ** i) % 4));
  return out;
}

describe("kapsül testi", () => {
  it("her cevap 1–23 arası kapsül verir, 23 nadirdir ve 1–22'nin hepsi çıkar", () => {
    const res = all().map(computeCapsule);
    for (const r of res) expect(r.capsule).toBeGreaterThanOrEqual(1), expect(r.capsule).toBeLessThanOrEqual(23);
    const ayshe = res.filter((r) => r.capsule === AYSHE_CAPSULE).length / res.length;
    expect(ayshe).toBeGreaterThan(0.01);
    expect(ayshe).toBeLessThan(0.04);
    expect(new Set(res.map((r) => r.capsule)).size).toBe(23);
  });
  it("aynı cevaplar aynı sonucu verir; çoğunluk tipi belirler", () => {
    expect(computeCapsule([1, 1, 1, 0, 2])).toEqual(computeCapsule([1, 1, 1, 0, 2]));
    expect(computeCapsule([1, 1, 1, 0, 2]).archetype).toBe("guardian");
    expect(computeCapsule([0, 0, 3, 3, 3]).archetype).toBe("healer");
  });
  it("geçersiz cevabı reddeder", () => {
    expect(() => computeCapsule([0, 1])).toThrow();
    expect(() => computeCapsule([0, 1, 2, 3, 4])).toThrow();
  });
});
