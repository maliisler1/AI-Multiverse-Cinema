/**
 * Replik zamanlaması ve WebVTT altyazı üretimi (saf fonksiyonlar, test edilebilir).
 */
import type {
  Caption,
  Line,
  ProductionLang,
} from "../../supabase/functions/_shared/productions/types.ts";

export type Placed = { key: string; start: number; end: number; text: string; radio: boolean };

/** Replikler arasında bırakılacak en az boşluk (sn). */
export const GAP = 0.2;

/**
 * Her repliği planlanan saniyeye yerleştirir. Başka dillerde replik daha uzun
 * sürerse bir sonrakini üst üste binmeyecek kadar kaydırır; bölüm sonunu aşanı
 * bölüm sonuna sığacak biçimde öne çeker.
 */
export function layoutLines(
  lines: Line[],
  lang: ProductionLang,
  durations: Record<string, number>,
  total: number,
): Placed[] {
  const placed: Placed[] = [];
  let prevEnd = 0;
  for (const line of lines) {
    const d = durations[line.key];
    if (d === undefined) throw new Error(`Süre yok: ${line.key}`);
    let start = Math.max(line.at, placed.length ? prevEnd + GAP : 0);
    if (start + d > total) start = Math.max(prevEnd + GAP / 2, total - d);
    const end = Math.min(total, start + d);
    placed.push({
      key: line.key,
      start: round(start),
      end: round(end),
      text: line.text[lang],
      radio: Boolean(line.radio),
    });
    prevEnd = end;
  }
  return placed;
}

const round = (n: number) => Math.round(n * 1000) / 1000;

function stamp(sec: number): string {
  const ms = Math.round(sec * 1000);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const r = ms % 1000;
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(h)}:${p(m)}:${p(s)}.${p(r, 3)}`;
}

/** Altyazı: her replik en az 1,2 sn ekranda kalır; bölüm sonu kartı da eklenir. */
export function toVtt(
  placed: Placed[],
  captions: Caption[],
  lang: ProductionLang,
  total: number,
): string {
  const cues = [
    ...placed.map((p) => ({
      from: p.start,
      to: Math.min(total, Math.max(p.end, p.start + 1.2)),
      text: p.text,
    })),
    ...captions.map((c) => ({ from: c.from, to: c.to, text: c.text[lang] })),
  ].sort((a, b) => a.from - b.from);
  const body = cues
    .map((c, i) => `${i + 1}\n${stamp(c.from)} --> ${stamp(c.to)}\n${c.text}`)
    .join("\n\n");
  return `WEBVTT\n\n${body}\n`;
}
