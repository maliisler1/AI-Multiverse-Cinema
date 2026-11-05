/**
 * Bölüm birleştirme: klipleri tek videoda, replikleri dil başına tek ses
 * parçasında birleştirir, altyazıları üretir ve uygulamaya bağlar.
 *
 * GitHub Actions'ta çalışır (.github/workflows/assemble-episode.yml).
 * Yerelde: node --experimental-strip-types scripts/assemble-episode.ts neo-genesis-2099 1
 *
 * Ortam değişkenleri:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  — depolamadan okuyup yazmak için
 *   LOCAL_DIR (isteğe bağlı) — Supabase yerine bu klasörü kullanır (test/yerel çalışma):
 *     <LOCAL_DIR>/productions/... girdileri okunur, çıktılar <LOCAL_DIR>/out/ altına yazılır.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTIONS } from "../supabase/functions/_shared/productions/index.ts";
import {
  PRODUCTION_LANGS,
  storagePaths,
  type ProductionLang,
} from "../supabase/functions/_shared/productions/types.ts";
import { layoutLines, toVtt } from "./lib/timeline.ts";

const [slug, epArg] = process.argv.slice(2);
const prod = PRODUCTIONS.find((p) => p.seriesSlug === slug && p.episode === Number(epArg));
if (!prod) {
  console.error(`Üretim planı bulunamadı: ${slug} ${epArg}`);
  process.exit(1);
}
const paths = storagePaths(prod);
const localDir = process.env["LOCAL_DIR"];
const work = join(tmpdir(), `assemble-${slug}-${epArg}-${Date.now()}`);
mkdirSync(work, { recursive: true });

const db = localDir
  ? null
  : createClient(need("SUPABASE_URL"), need("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false },
    });

function need(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`${name} tanımlı değil (GitHub → Settings → Secrets and variables → Actions)`);
    process.exit(1);
  }
  return v;
}

function ff(args: string[]) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

function probeDuration(file: string): number {
  const out = execFileSync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    file,
  ]).toString();
  return Number.parseFloat(out);
}

/** Depolamadan dosyayı indirir; yoksa null. */
async function fetchFile(path: string): Promise<string | null> {
  const dest = join(work, path);
  mkdirSync(dirname(dest), { recursive: true });
  if (localDir) {
    const src = join(localDir, path);
    if (!existsSync(src)) return null;
    writeFileSync(dest, readFileSync(src));
    return dest;
  }
  const { data, error } = await db!.storage.from("videos").download(path);
  if (error || !data) return null;
  writeFileSync(dest, Buffer.from(await data.arrayBuffer()));
  return dest;
}

async function putFile(path: string, file: string, contentType: string) {
  if (localDir) {
    const dest = join(localDir, "out", path);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(file));
    return;
  }
  const { error } = await db!.storage
    .from("videos")
    .upload(path, readFileSync(file), { upsert: true, contentType });
  if (error) throw new Error(`${path} yüklenemedi: ${error.message}`);
}

const ISO3: Record<ProductionLang, string> = {
  tr: "tur",
  en: "eng",
  de: "ger",
  fr: "fre",
  es: "spa",
  pt: "por",
  ar: "ara",
  hi: "hin",
};

/**
 * Durağan kareyi sinematik kamera hareketiyle canlandırır. Sırayla yavaş yakınlaşma,
 * uzaklaşma, sağa ve sola kaydırma; her karenin başı ve sonu kısa geçişle yumuşatılır.
 * Titremeyi önlemek için kare önce 4K'ya büyütülür.
 */
export function kenBurns(index: number, duration: number): string {
  const n = Math.round(duration * 30);
  const t = `on/${n}`;
  const center = `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
  const moves = [
    `z='1+0.12*${t}':${center}`,
    `z='1.12-0.12*${t}':${center}`,
    `z='1.1':x='(iw-iw/zoom)*${t}':y='ih/2-(ih/zoom/2)'`,
    `z='1.1':x='(iw-iw/zoom)*(1-${t})':y='ih/2-(ih/zoom/2)'`,
  ];
  return (
    `scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,setsar=1,` +
    `zoompan=${moves[index % moves.length]}:d=${n}:s=1280x720:fps=30,` +
    `fade=t=in:st=0:d=0.4,fade=t=out:st=${duration - 0.4}:d=0.4`
  );
}

async function main() {
  const total = prod!.durationSec;

  // 1) Video: her sahne için gerçek klip varsa onu, yoksa başlangıç karesini kamera hareketiyle
  //    (yakınlaşma / uzaklaşma / kaydırma) canlandırarak kullanır; sonra hepsini birleştirir.
  console.log(`▶ ${prod!.clips.length} sahne indiriliyor…`);
  const inputs: string[][] = [];
  const filters: string[] = [];
  const missing: string[] = [];
  let stills = 0;
  for (const [i, c] of prod!.clips.entries()) {
    const clip = await fetchFile(paths.clip(c.key));
    if (clip) {
      inputs.push(["-i", clip]);
      filters.push(
        `[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,` +
          `tpad=stop_mode=clone:stop_duration=${c.duration},trim=duration=${c.duration},setpts=PTS-STARTPTS[v${i}]`,
      );
      continue;
    }
    const still = await fetchFile(paths.keyframe(c.key));
    if (!still) {
      missing.push(c.key);
      continue;
    }
    stills++;
    inputs.push(["-i", still]);
    filters.push(`[${i}:v]${kenBurns(i, c.duration)},setpts=PTS-STARTPTS[v${i}]`);
  }
  if (missing.length)
    throw new Error(
      `Eksik kareler: ${missing.join(", ")}. Önce yönetim panelinden kareleri üretin.`,
    );
  console.log(`  ${prod!.clips.length - stills} gerçek video, ${stills} hareketli kare`);

  const concat =
    `${prod!.clips.map((_, i) => `[v${i}]`).join("")}concat=n=${prod!.clips.length}:v=1:a=0,` +
    `fade=t=in:st=0:d=1.5,fade=t=out:st=${total - 2}:d=2[out]`;
  const video = join(work, "episode.mp4");
  console.log("▶ Video birleştiriliyor…");
  ff([
    ...inputs.flat(),
    "-filter_complex",
    [...filters, concat].join(";"),
    "-map",
    "[out]",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-t",
    String(total),
    video,
  ]);

  // 2) Diller: replikleri yerleştir, karıştır, ses seviyesini dengele; altyazı üret.
  const ready: ProductionLang[] = [];
  const skipped: string[] = [];
  const langFiles: Partial<Record<ProductionLang, { audio: string; vtt: string }>> = {};
  for (const lang of PRODUCTION_LANGS) {
    const files: Record<string, string> = {};
    const durations: Record<string, number> = {};
    for (const line of prod!.lines) {
      const f = await fetchFile(paths.voice(lang, line.key));
      if (!f) break;
      files[line.key] = f;
      durations[line.key] = probeDuration(f);
    }
    if (Object.keys(files).length !== prod!.lines.length) {
      skipped.push(lang);
      continue;
    }
    const placed = layoutLines(prod!.lines, lang, durations, total);
    const inputs = placed.flatMap((p) => ["-i", files[p.key]!]);
    const parts = placed.map((p, i) => {
      const ms = Math.round(p.start * 1000);
      const radio = p.radio ? "highpass=f=350,lowpass=f=3200,aecho=0.8:0.6:60:0.35," : "";
      return `[${i}:a]aresample=48000,aformat=channel_layouts=stereo,${radio}adelay=${ms}|${ms}[a${i}]`;
    });
    const mix =
      `${placed.map((_, i) => `[a${i}]`).join("")}amix=inputs=${placed.length}:normalize=0,` +
      `apad=whole_dur=${total},atrim=0:${total},loudnorm=I=-16:TP=-1.5:LRA=11[mix]`;
    const audio = join(work, `episode.${lang}.m4a`);
    ff([
      ...inputs,
      "-filter_complex",
      [...parts, mix].join(";"),
      "-map",
      "[mix]",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      audio,
    ]);
    const vtt = join(work, `episode.${lang}.vtt`);
    writeFileSync(vtt, toVtt(placed, prod!.captions, lang, total));
    await putFile(paths.finalAudio(lang), audio, "audio/mp4");
    await putFile(paths.finalSubs(lang), vtt, "text/vtt");
    ready.push(lang);
    langFiles[lang] = { audio, vtt };
    console.log(`✔ ${lang}: ${placed.length} replik yerleştirildi`);
  }
  if (!ready.length)
    throw new Error("Hiçbir dilin seslendirmesi tamamlanmamış. Önce sesleri üretin.");

  await putFile(paths.finalVideo, video, "video/mp4");
  console.log(`✔ Video yüklendi: ${paths.finalVideo}`);

  // Yerel çalışmada: her dil için sesli ve altyazılı, doğrudan izlenebilir bir MP4.
  if (localDir) {
    const dir = join(localDir, "izle");
    mkdirSync(dir, { recursive: true });
    for (const lang of ready) {
      const f = langFiles[lang]!;
      const out = join(dir, `Bolum-${prod!.episode}-${prod!.title.tr}-${lang}.mp4`);
      ff([
        "-i",
        video,
        "-i",
        f.audio,
        "-i",
        f.vtt,
        "-map",
        "0:v",
        "-map",
        "1:a",
        "-map",
        "2:s",
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        "-c:s",
        "mov_text",
        "-metadata:s:a:0",
        `language=${ISO3[lang]}`,
        "-metadata:s:s:0",
        `language=${ISO3[lang]}`,
        "-movflags",
        "+faststart",
        out,
      ]);
      console.log(`🎬 İzlemeye hazır: ${out}`);
    }
  }

  // 3) Uygulamaya bağla: bölüm "ready", hazır diller için ses + altyazı satırları.
  if (db) {
    const { data: series } = await db
      .from("series")
      .select("id")
      .eq("slug", prod!.seriesSlug)
      .single();
    if (!series) throw new Error("Dizi veritabanında yok");
    const { data: ep } = await db
      .from("episodes")
      .select("id")
      .eq("series_id", series.id)
      .eq("n", prod!.episode)
      .single();
    if (!ep) throw new Error("Bölüm veritabanında yok");
    const { error: e1 } = await db
      .from("episodes")
      .update({ video_url: paths.finalVideo, duration_sec: total, status: "ready" })
      .eq("id", ep.id);
    if (e1) throw new Error(e1.message);
    const rows = ready.flatMap((lang) => [
      { episode_id: ep.id, kind: "audio", lang, status: "ready", url: paths.finalAudio(lang) },
      { episode_id: ep.id, kind: "subs", lang, status: "ready", url: paths.finalSubs(lang) },
    ]);
    const { error: e2 } = await db
      .from("tracks")
      .upsert(rows, { onConflict: "episode_id,kind,lang" });
    if (e2) throw new Error(e2.message);
  }

  console.log(
    `\nBölüm hazır. Diller: ${ready.join(", ")}${skipped.length ? ` · eksik: ${skipped.join(", ")}` : ""}`,
  );
}

main().catch((e) => {
  console.error(`✖ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
