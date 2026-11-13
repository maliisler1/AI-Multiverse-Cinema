import { describe, expect, it } from "vitest";
import { neoGenesisE1 as p } from "../../supabase/functions/_shared/productions/neo-genesis-2099-e1.ts";
import {
  PRODUCTION_LANGS,
  VOICE_PRESETS,
  clipCredits,
  keyframeCredits,
  keyframePrompt,
  speechText,
  voiceCredits,
} from "../../supabase/functions/_shared/productions/types.ts";

describe("Neo-Genesis bölüm 1 üretim planı", () => {
  it("klipler toplam 180 saniye ve sahneler sırayla", () => {
    expect(p.clips.reduce((s, c) => s + c.duration, 0)).toBe(p.durationSec);
    expect(p.clips).toHaveLength(20);
    const scenes = p.clips.map((c) => c.scene);
    expect([...scenes].sort((a, b) => a - b)).toEqual(scenes);
    expect(new Set(p.clips.map((c) => c.key)).size).toBe(p.clips.length);
  });

  it("her replik 8 dilde dolu ve zamanlar artan sırada", () => {
    let prev = -1;
    for (const line of p.lines) {
      for (const lang of PRODUCTION_LANGS)
        expect(line.text[lang]?.trim().length, `${line.key}/${lang}`).toBeGreaterThan(0);
      expect(line.at).toBeGreaterThan(prev);
      expect(line.at).toBeLessThan(p.durationSec);
      prev = line.at;
    }
    for (const c of p.captions)
      for (const lang of PRODUCTION_LANGS) expect(c.text[lang].length).toBeGreaterThan(0);
  });

  it("varsayılan sesler Runway listesinde ve etiket kuralı geçerli", () => {
    for (const s of Object.values(p.speakers)) expect(VOICE_PRESETS).toContain(s.defaultVoice);
    expect(p.faceTag).toMatch(/^[A-Za-z][A-Za-z0-9_]{2,15}$/);
  });

  it("komutlar Runway'in 1000 karakter sınırının altında", () => {
    for (const c of p.clips) {
      expect(keyframePrompt(p, c).length, c.key).toBeLessThanOrEqual(1000);
      expect(c.motion.length, c.key).toBeLessThanOrEqual(1000);
      expect(keyframePrompt(p, c).includes(`@${p.faceTag}`)).toBe(c.face);
    }
  });

  it("kredi tahmini bütçeye sığıyor", () => {
    expect(keyframeCredits(p)).toBe(160);
    expect(keyframeCredits(p, "economy")).toBe(64);
    expect(clipCredits(p)).toBe(900);
    const voices = voiceCredits(p, PRODUCTION_LANGS, "eleven_v3");
    expect(voices).toBeGreaterThan(100);
    expect(voices).toBeLessThan(300);
    expect(keyframeCredits(p) + clipCredits(p) + voices).toBeLessThan(1923);
  });

  it("ses etiketi yalnızca eleven_v3 modelinde eklenir", () => {
    const line = p.lines.find((l) => l.tag)!;
    expect(speechText(line, "tr", "eleven_v3").startsWith(`[${line.tag}] `)).toBe(true);
    expect(speechText(line, "tr", "eleven_multilingual_v2")).toBe(line.text.tr);
  });
});

import { neoGenesisE2 as p2 } from "../../supabase/functions/_shared/productions/neo-genesis-2099-e2.ts";
import { PRODUCTIONS } from "../../supabase/functions/_shared/productions/index.ts";

describe("The Human Code bölüm 2 üretim planı (Kayıp Sinyal)", () => {
  it("180 saniye, sahneler ve replik zamanları sıralı, 8 dil dolu", () => {
    expect(p2.clips.reduce((t, c) => t + c.duration, 0)).toBe(p2.durationSec);
    const scenes = p2.clips.map((c) => c.scene);
    expect([...scenes].sort((a, b) => a - b)).toEqual(scenes);
    let last = -1;
    for (const l of p2.lines) {
      expect(l.at, l.key).toBeGreaterThan(last);
      last = l.at;
      for (const lang of PRODUCTION_LANGS) expect(l.text[lang].length, `${l.key} ${lang}`).toBeGreaterThan(0);
      expect(p2.speakers[l.speaker], l.key).toBeDefined();
    }
    expect(last).toBeLessThan(p2.durationSec);
  });
  it("görünüş ve stil 1. bölümle aynı, komutlar sınır içinde", () => {
    expect(p2.characterLook).toBe(p.characterLook);
    expect(p2.style).toBe(p.style);
    for (const c of p2.clips) {
      expect(keyframePrompt(p2, c).length, c.key).toBeLessThanOrEqual(1000);
      expect(keyframePrompt(p2, c).includes(`@${p2.faceTag}`)).toBe(c.face);
    }
  });
  it("üretim listesinde sırayla duruyor", () => {
    expect(PRODUCTIONS.map((x) => x.episode)).toEqual([1, 2]);
  });
});
