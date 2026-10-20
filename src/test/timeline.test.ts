import { describe, expect, it } from "vitest";
import { GAP, layoutLines, toVtt } from "../../scripts/lib/timeline.ts";
import { neoGenesisE1 as p } from "../../supabase/functions/_shared/productions/neo-genesis-2099-e1.ts";

const durationsOf = (sec: number) => Object.fromEntries(p.lines.map((l) => [l.key, sec]));

describe("replik zamanlaması", () => {
  it("kısa repliklerde planlanan saniyeler korunur", () => {
    const placed = layoutLines(p.lines, "tr", durationsOf(1), p.durationSec);
    expect(placed.map((x) => x.start)).toEqual(p.lines.map((l) => l.at));
  });

  it("uzun replikler üst üste binmez ve bölüm sonunu aşmaz", () => {
    const placed = layoutLines(p.lines, "de", durationsOf(9), p.durationSec);
    for (let i = 1; i < placed.length; i++) {
      expect(placed[i]!.start).toBeGreaterThanOrEqual(placed[i - 1]!.end + GAP / 2 - 0.001);
    }
    expect(placed.at(-1)!.end).toBeLessThanOrEqual(p.durationSec);
  });

  it("telsiz efekti yalnızca son sinyal repliğinde", () => {
    const placed = layoutLines(p.lines, "tr", durationsOf(1), p.durationSec);
    expect(placed.filter((x) => x.radio).map((x) => x.key)).toEqual(["l21"]);
  });
});

describe("altyazı", () => {
  it("geçerli WebVTT üretir, son kartı içerir, bölüm sonunu aşmaz", () => {
    const placed = layoutLines(p.lines, "en", durationsOf(2), p.durationSec);
    const vtt = toVtt(placed, p.captions, "en", p.durationSec);
    expect(vtt.startsWith("WEBVTT\n\n1\n00:00:03.000 --> 00:00:05.000\nThe year is 2300.")).toBe(
      true,
    );
    expect(vtt).toContain("Episode 2 — Lost Signal");
    expect(vtt).not.toMatch(/--> 00:03:00\.[0-9]*[1-9]/);
  });
});
