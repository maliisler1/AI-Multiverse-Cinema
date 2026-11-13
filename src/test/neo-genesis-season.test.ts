import { describe, expect, it } from "vitest";
import { PRODUCTIONS } from "../../supabase/functions/_shared/productions/index.ts";
import { PRODUCTION_LANGS, VOICE_PRESETS, keyframePrompt } from "../../supabase/functions/_shared/productions/types.ts";

const season = PRODUCTIONS.filter((p) => p.seriesSlug === "neo-genesis-2099" && p.episode > 1);

describe.each(season.map((p) => [p.episode, p] as const))("Neo-Genesis bölüm %i", (_n, p) => {
  it("3 dakika, 20 sahne, sahneler sırayla", () => {
    expect(p.durationSec).toBe(180);
    expect(p.clips).toHaveLength(20);
    const scenes = p.clips.map((c) => c.scene);
    expect([...scenes].sort((a, b) => a - b)).toEqual(scenes);
  });

  it("her replik 8 dilde dolu, zamanlar artan ve sahnesinin içinde", () => {
    let prev = -1;
    const sceneSpan = new Map<number, [number, number]>();
    let t = 0;
    for (const c of p.clips) {
      const s = sceneSpan.get(c.scene);
      sceneSpan.set(c.scene, [s ? s[0] : t, t + c.duration]);
      t += c.duration;
    }
    for (const line of p.lines) {
      for (const lang of PRODUCTION_LANGS)
        expect(line.text[lang]?.trim().length, `${line.key}/${lang}`).toBeGreaterThan(0);
      expect(line.at, line.key).toBeGreaterThan(prev);
      const [from, to] = sceneSpan.get(line.scene)!;
      expect(line.at, `${line.key} sahne ${line.scene}`).toBeGreaterThanOrEqual(from);
      expect(line.at, `${line.key} sahne ${line.scene}`).toBeLessThan(to);
      expect(p.speakers[line.speaker], line.key).toBeDefined();
      prev = line.at;
    }
  });

  it("AyShe adı tutarlı, ekranda yazı yok, komutlar sınırda", () => {
    const all = JSON.stringify(p);
    expect(all).not.toMatch(/Ayşe|Ayse\b|Elira/);
    for (const s of Object.values(p.speakers)) expect(VOICE_PRESETS).toContain(s!.defaultVoice);
    for (const c of p.clips) {
      expect(keyframePrompt(p, c).length, c.key).toBeLessThanOrEqual(1000);
      expect(c.keyframe, c.key).not.toMatch(/\b(text|number|letters|sign|crowd)\b|\d/i);
    }
  });
});

describe("Neo-Genesis sezon bütünlüğü", () => {
  it("2-15. bölümler eksiksiz ve her bölüm bir sonrakini duyuruyor", () => {
    expect(season.map((p) => p.episode)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    for (const p of season.slice(0, -1)) {
      const next = PRODUCTIONS.find((q) => q.seriesSlug === p.seriesSlug && q.episode === p.episode + 1)!;
      expect(p.captions[0]!.text.tr, `bölüm ${p.episode}`).toBe(`Bölüm ${next.episode} — ${next.title.tr}`);
    }
  });
});
