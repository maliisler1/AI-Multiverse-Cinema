/**
 * Neo-Genesis: 2300 — 2. bölümden itibaren ortak oyuncu ve görünüm tarifleri.
 *
 * Kurallar (Wan 2.2 14B, fotogerçekçi başlangıç karesinden):
 * - Her çekimde tek net eylem ve tek basit kamera hareketi.
 * - Ekranda yazı ya da rakam yok; kalabalık küçük yüzler yok.
 * - Hareketler doğal ve gerçek hızda; durağan kare yok.
 * - Başrolün yüzünü referans portre taşır (face: true). Diğer karakterler her karede
 *   aşağıdaki sabit tarifle yazılır ki bölümden bölüme aynı görünsünler.
 */
import type { Production } from "./types.ts";

export const SERIES_SLUG = "neo-genesis-2099";

export const AYSE_LOOK =
  "a beautiful young woman of about eighteen with long straight black hair, fair porcelain skin, a natural no-makeup look and dark eyes, wearing a fitted white-silver spacesuit with a softly glowing blue emblem on the chest";

export const AYSE_SHORT =
  "beautiful 18 year old woman, long straight black hair, fair skin, no makeup, fitted white-silver spacesuit";

export const STYLE =
  "Photorealistic cinematic film still, natural skin texture, real-world lighting, anamorphic 35mm lens, violet turquoise and gold color grade, volumetric light, shallow depth of field, 16:9";

/** Aster sahneleri için soğuk renk ayarı (keyframe sonuna eklenir). */
export const ASTER_GRADE = "cold ice-white and pale blue color grade, clean reflective surfaces";

/** 2099 anı sahneleri için. */
export const MEMORY_GRADE = "faded warm orange memory color grade, soft film grain, hazy light";

/** Pusula: konuşan turkuaz ışık küresi. */
export const PUSULA = "a small floating turquoise orb of soft light, the size of an apple";

/** Rün (Kapsül 7): genç mühendis. */
export const RUN =
  "a young man of about twenty with short messy dark-blond hair, light stubble and a small scar on his left eyebrow, wearing a scuffed grey and orange engineer jumpsuit";

/** Vael (Kapsül 1): projenin baş bilimcisi, sakin ve ikna edici. */
export const VAEL =
  "a tall calm man in his late fifties with short silver hair, a neatly trimmed grey beard and pale grey eyes, wearing a long seamless white high-collared coat";

/** Nil (Kapsül 15): Aster'de yaşayan meraklı küçük kız. */
export const NIL =
  "a curious ten-year-old girl with curly auburn hair in two short braids and freckles, wearing a simple pale blue tunic";

/** Mera (Kapsül 12): sessiz, güçlü bir botanikçi. */
export const MERA =
  "a woman of about thirty with a short dark pixie haircut and warm brown skin, wearing a torn sage-green field suit";

/** Silgiler: Vael'in maskeli bekçileri. Yüz yok, bu yüzden Wan için güvenli. */
export const SILGI =
  "a tall figure in a smooth featureless white mask and a long hooded white coat";

/** Taran: Elyra'nın yarı saydam bekçisi (1. bölümdeki gibi). */
export const TARAN =
  "a tall ancient semi-transparent guardian with glowing golden eyes and a violet-silver robe woven from crystal";

/** Bölümler arasında aynı kalan alanlar. */
export const base = {
  seriesSlug: SERIES_SLUG,
  faceTag: "Ayse",
  characterLook: AYSE_LOOK,
  characterShort: AYSE_SHORT,
  style: STYLE,
} satisfies Partial<Production>;

/** Varsayılan sesler (Türkçe seslendirmede yerli sesler ayrıca seçilir). */
export const VOICES = {
  narrator: { name: "Anlatıcı", defaultVoice: "Vincent" },
  ayshe: { name: "Ayşe", defaultVoice: "Maya" },
  pusula: { name: "Pusula", defaultVoice: "Serene" },
  taran: { name: "Bekçi Taran", defaultVoice: "Bernard" },
  run: { name: "Rün", defaultVoice: "Noah" },
  vael: { name: "Vael", defaultVoice: "James" },
  nil: { name: "Nil", defaultVoice: "Pip" },
  mera: { name: "Mera", defaultVoice: "Claudia" },
} satisfies Production["speakers"];

type L = Record<"tr" | "en" | "de" | "fr" | "es" | "pt" | "ar" | "hi", string>;

/** Bölüm sonu kartı: "Bölüm N — Ad". */
export function nextCard(n: number, t: L): Production["captions"][number] {
  const word: L = {
    tr: "Bölüm",
    en: "Episode",
    de: "Folge",
    fr: "Épisode",
    es: "Episodio",
    pt: "Episódio",
    ar: "الحلقة",
    hi: "एपिसोड",
  };
  const text = Object.fromEntries(
    Object.entries(t).map(([k, v]) => [k, `${word[k as keyof L]} ${n} — ${v}`]),
  ) as L;
  return { from: 177.5, to: 180, text };
}

// ---------- Kısa yazım yardımcıları ----------

/** 8 dilde metin, sırayla: tr, en, de, fr, es, pt, ar, hi. */
export function t(tr: string, en: string, de: string, fr: string, es: string, pt: string, ar: string, hi: string): L {
  return { tr, en, de, fr, es, pt, ar, hi };
}

type ClipIn = [scene: number, duration: 5 | 10, face: boolean, keyframe: string, motion: string];
type LineIn = {
  scene: number;
  speaker: keyof typeof VOICES;
  at: number;
  tag?: string;
  radio?: boolean;
  text: L;
};

/** Bölümü kurar: anahtarları (c01…, l01…) sırayla verir, konuşanları repliklerden seçer. */
export function episode(e: {
  episode: number;
  title: L;
  clips: ClipIn[];
  lines: LineIn[];
  next?: { n: number; title: L };
}): Production {
  const pad = (i: number) => String(i + 1).padStart(2, "0");
  const used = new Set(e.lines.map((l) => l.speaker));
  return {
    ...base,
    episode: e.episode,
    title: e.title,
    durationSec: e.clips.reduce((s, c) => s + c[1], 0),
    speakers: Object.fromEntries(Object.entries(VOICES).filter(([k]) => used.has(k as keyof typeof VOICES))),
    clips: e.clips.map(([scene, duration, face, keyframe, motion], i) => ({
      key: `c${pad(i)}`,
      scene,
      duration,
      face,
      keyframe,
      motion,
    })),
    lines: e.lines.map((l, i) => ({ key: `l${pad(i)}`, ...l })),
    captions: e.next ? [nextCard(e.next.n, e.next.title)] : [],
  };
}
