/**
 * Bölüm üretim planı tipleri ve kredi hesapları.
 *
 * Bu dosya hem Supabase Edge Function (Deno), hem birleştirme betiği (Node),
 * hem de testler (Vitest) tarafından içe aktarılır. Bu yüzden dış bağımlılık
 * kullanmaz ve içe aktarmalarda `.ts` uzantısı yazılır.
 */

export const PRODUCTION_LANGS = ["tr", "en", "de", "fr", "es", "pt", "ar", "hi"] as const;
export type ProductionLang = (typeof PRODUCTION_LANGS)[number];

export type SpeakerId = "narrator" | "ayshe" | "pusula" | "taran";

/** Runway'in hazır ses listesi (SDK 4.22 text_to_speech presetId). */
export const VOICE_PRESETS = [
  "Maya",
  "Arjun",
  "Serene",
  "Bernard",
  "Billy",
  "Mark",
  "Clint",
  "Mabel",
  "Chad",
  "Leslie",
  "Eleanor",
  "Elias",
  "Elliot",
  "Grungle",
  "Brodie",
  "Sandra",
  "Kirk",
  "Kylie",
  "Lara",
  "Lisa",
  "Malachi",
  "Marlene",
  "Martin",
  "Miriam",
  "Monster",
  "Paula",
  "Pip",
  "Rusty",
  "Ragnar",
  "Xylar",
  "Maggie",
  "Jack",
  "Katie",
  "Noah",
  "James",
  "Rina",
  "Ella",
  "Mariah",
  "Frank",
  "Claudia",
  "Niki",
  "Vincent",
  "Kendrick",
  "Myrna",
  "Tom",
  "Wanda",
  "Benjamin",
  "Kiana",
  "Rachel",
] as const;
export type VoicePreset = (typeof VOICE_PRESETS)[number];

export const TTS_MODELS = ["eleven_v3", "eleven_multilingual_v2"] as const;
export type TtsModel = (typeof TTS_MODELS)[number];

export type Clip = {
  /** c01 … c20 */
  key: string;
  scene: number;
  /** Saniye. gen4_turbo için 5 veya 10 kullanıyoruz. */
  duration: 5 | 10;
  /** Başrol yüzü (referans fotoğraf) bu karede kullanılacak mı? */
  face: boolean;
  /** Başlangıç karesi için görüntü komutu (gen4_image). */
  keyframe: string;
  /** Kareyi hareketlendirme komutu (gen4_turbo). */
  motion: string;
};

export type Line = {
  /** l01 … l21 */
  key: string;
  scene: number;
  speaker: SpeakerId;
  /** Bölüm başından itibaren repliğin başlama saniyesi (Türkçe zamanlama). */
  at: number;
  /** eleven_v3 ses etiketi, ör. "whispers". Etiket desteklemeyen modelde eklenmez. */
  tag?: string;
  /** Telsiz/uzak sinyal efekti (birleştirmede filtrelenir). */
  radio?: boolean;
  text: Record<ProductionLang, string>;
};

export type Caption = { from: number; to: number; text: Record<ProductionLang, string> };

export type Production = {
  seriesSlug: string;
  episode: number;
  title: Record<ProductionLang, string>;
  /** Toplam süre (saniye). Kliplerin toplamına eşit olmalı. */
  durationSec: number;
  /** Referans fotoğrafa promptlarda verilecek etiket (3-16 harf/rakam/_). */
  faceTag: string;
  /** Başrolün görünüş tarifi; yüz kullanılan her kare komutunun başına eklenir. */
  characterLook: string;
  /**
   * Başrolün kısa tarifi (isteğe bağlı). Kaggle'da SDXL komutu 77 kelime parçasıyla sınırlı olduğu
   * için sahne önce, bu kısa tarif sonra yazılır; yüzü zaten referans portre taşır.
   */
  characterShort?: string;
  /** Her kare komutunun sonuna eklenen görsel stil. */
  style: string;
  speakers: Record<SpeakerId, { name: string; defaultVoice: VoicePreset }>;
  clips: Clip[];
  lines: Line[];
  /** Ses yerine yalnızca altyazıda görünen yazılar (ör. bölüm sonu kartı). */
  captions: Caption[];
};

/** Runway kredi tarifeleri (Ekim 2026, docs.dev.runwayml.com/guides/pricing). */
export const CREDITS = {
  keyframe1080p: 8,
  keyframe720p: 5,
  keyframeTurbo: 2,
  gen4TurboPerSec: 5,
  ttsCharsPerCredit: 50,
} as const;

/**
 * Kare kalitesi:
 * - high: gen4_image 1080p (8 kredi)
 * - economy: yüzlü karelerde gen4_image_turbo (2 kredi, referans fotoğraf zorunlu),
 *   yüzsüz karelerde gen4_image 720p (5 kredi)
 */
export const IMAGE_QUALITIES = ["economy", "high"] as const;
export type ImageQuality = (typeof IMAGE_QUALITIES)[number];

export function keyframeCost(clip: Clip, quality: ImageQuality): number {
  if (quality === "high") return CREDITS.keyframe1080p;
  return clip.face ? CREDITS.keyframeTurbo : CREDITS.keyframe720p;
}

/** Runway text_to_image isteğinin model ve oranı. */
export function keyframeModel(clip: Clip, quality: ImageQuality): { model: string; ratio: string } {
  if (quality === "high") return { model: "gen4_image", ratio: "1920:1080" };
  return clip.face
    ? { model: "gen4_image_turbo", ratio: "1920:1080" }
    : { model: "gen4_image", ratio: "1280:720" };
}

export function keyframeCredits(p: Production, quality: ImageQuality = "high"): number {
  return p.clips.reduce((sum, c) => sum + keyframeCost(c, quality), 0);
}

export function clipCredits(p: Production): number {
  return p.clips.reduce((sum, c) => sum + c.duration * CREDITS.gen4TurboPerSec, 0);
}

export function lineCredits(text: string): number {
  return Math.max(1, Math.ceil(text.length / CREDITS.ttsCharsPerCredit));
}

/** Seslendirmeye gönderilecek metin: etiket destekleyen modelde etiket başa eklenir. */
export function speechText(line: Line, lang: ProductionLang, model: TtsModel): string {
  const text = line.text[lang];
  return model === "eleven_v3" && line.tag ? `[${line.tag}] ${text}` : text;
}

export function voiceCredits(
  p: Production,
  langs: readonly ProductionLang[],
  model: TtsModel,
): number {
  let sum = 0;
  for (const lang of langs)
    for (const line of p.lines) sum += lineCredits(speechText(line, lang, model));
  return sum;
}

/** Yüz kullanılan karelerde komut: "@Etiket, <görünüş>. <sahne>. <stil>" */
export function keyframePrompt(p: Production, clip: Clip): string {
  const subject = clip.face ? `@${p.faceTag}, ${p.characterLook}. ` : "";
  return `${subject}${clip.keyframe}. ${p.style}`;
}

/** Depolama yolları (videos kovası içinde). */
export function storagePaths(p: Production) {
  const base = `productions/${p.seriesSlug}/e${p.episode}`;
  return {
    base,
    reference: `${base}/ref/face.jpg`,
    keyframe: (key: string) => `${base}/keyframes/${key}.png`,
    clip: (key: string) => `${base}/clips/${key}.mp4`,
    voice: (lang: ProductionLang, key: string) => `${base}/voices/${lang}/${key}.mp3`,
    finalVideo: `${p.seriesSlug}/e${p.episode}.mp4`,
    finalAudio: (lang: ProductionLang) => `${p.seriesSlug}/e${p.episode}.${lang}.m4a`,
    finalSubs: (lang: ProductionLang) => `${p.seriesSlug}/e${p.episode}.${lang}.vtt`,
  };
}
