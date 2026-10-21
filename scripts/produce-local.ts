/**
 * Bölümü kendi bilgisayarınızda üretir: Runway'den kareleri (yüzünüzle) ve seslendirmeyi alır,
 * kamera hareketi + ses + altyazıyla birleştirip her dil için izlenebilir bir MP4 çıkarır.
 *
 * Kullanım (VS Code terminalinde, proje klasöründe):
 *   npm run bolum
 *   npm run bolum -- --diller=tr,en          (yalnızca seçilen diller)
 *   npm run bolum -- --kalite=yuksek         (kare başına 8 kredi; varsayılan ekonomik)
 *
 * Gerekenler:
 *   - uretim/foto.jpg  (başrol fotoğrafı; .jpeg/.png/.webp de olur, en fazla 5 MB)
 *   - ffmpeg           (Windows: winget install --id Gyan.FFmpeg -e)
 *   - Runway geliştirici API anahtarı: program sorar, hiçbir yere kaydetmez.
 *     (İsterseniz RUNWAY_API_KEY ortam değişkeni de kullanılabilir.)
 *
 * Program kaldığı yerden devam eder: daha önce indirilen kare ve sesleri tekrar üretmez.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline";
import { PRODUCTIONS } from "../supabase/functions/_shared/productions/index.ts";
import {
  PRODUCTION_LANGS,
  keyframeCost,
  keyframeModel,
  keyframePrompt,
  lineCredits,
  speechText,
  storagePaths,
  type ImageQuality,
  type ProductionLang,
  type TtsModel,
} from "../supabase/functions/_shared/productions/types.ts";

const RUNWAY = process.env["RUNWAY_API_BASE"] ?? "https://api.dev.runwayml.com/v1";
const VERSION = "2024-11-06";
const ROOT = resolve(process.env["URETIM_DIR"] ?? "uretim");
const CONCURRENCY = 2;
const POLL_MS = Number(process.env["URETIM_POLL_MS"] ?? 5000);
const MODEL: TtsModel = "eleven_v3";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
) as Record<string, string>;

const prod = PRODUCTIONS.find(
  (p) =>
    p.seriesSlug === (args["dizi"] ?? "neo-genesis-2099") &&
    p.episode === Number(args["bolum"] ?? 1),
);
if (!prod) fail("Bu dizi/bölüm için üretim planı yok.");
const paths = storagePaths(prod!);
const quality: ImageQuality = args["kalite"] === "yuksek" ? "high" : "economy";
const langs = (args["diller"] ? args["diller"].split(",") : [...PRODUCTION_LANGS]).filter(
  (l): l is ProductionLang => (PRODUCTION_LANGS as readonly string[]).includes(l),
);
if (!langs.length) fail(`Geçerli dil yok. Kullanılabilir diller: ${PRODUCTION_LANGS.join(",")}`);

function fail(msg: string): never {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

const local = (storagePath: string) => join(ROOT, storagePath);
const have = (storagePath: string) => existsSync(local(storagePath));

// ---------- ön kontroller ----------
function checkFfmpeg() {
  for (const bin of ["ffmpeg", "ffprobe"]) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
    } catch {
      fail(
        `${bin} bulunamadı. Kurmak için terminalde şunu çalıştırın:\n` +
          `    winget install --id Gyan.FFmpeg -e\n` +
          `  Kurulum bitince VS Code'u kapatıp yeniden açın ve programı tekrar çalıştırın.`,
      );
    }
  }
}

function photoDataUri(): string {
  mkdirSync(ROOT, { recursive: true });
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  for (const ext of Object.keys(types)) {
    const f = join(ROOT, `foto.${ext}`);
    if (!existsSync(f)) continue;
    if (statSync(f).size > 5 * 1024 * 1024)
      fail(`${f} 5 MB'tan büyük. Daha küçük bir fotoğraf kullanın.`);
    return `data:${types[ext]};base64,${readFileSync(f).toString("base64")}`;
  }
  fail(`Başrol fotoğrafı yok. Fotoğrafınızı şu adla kaydedin:\n    ${join(ROOT, "foto.jpg")}`);
}

function ask(question: string, hidden = false): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (hidden) {
    // Yazılan anahtar ekranda görünmesin.
    (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s: string) => {
      if (s.includes(question)) process.stdout.write(question);
      else if (s.includes("\n") || s.includes("\r")) process.stdout.write("\n");
      else process.stdout.write("*");
    };
  }
  return new Promise((res) =>
    rl.question(question, (a) => {
      rl.close();
      res(a.trim());
    }),
  );
}

// ---------- Runway ----------
let apiKey = "";
async function runway(path: string, body?: unknown) {
  const resp = await fetch(`${RUNWAY}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-Runway-Version": VERSION,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });
  const text = await resp.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { status: resp.status, ok: resp.ok, data };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class DailyLimit extends Error {}

type Job = {
  label: string;
  path: string;
  credits: number;
  endpoint: string;
  body: Record<string, unknown>;
};

async function runJob(job: Job): Promise<void> {
  let task: { status: number; ok: boolean; data: Record<string, unknown> } | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    task = await runway(job.endpoint, job.body);
    if (task.status !== 429) break;
    if (attempt === 3) throw new DailyLimit();
    await sleep(30_000 * (attempt + 1));
  }
  if (!task!.ok || typeof task!.data["id"] !== "string") {
    throw new Error(`Runway ${task!.status}: ${JSON.stringify(task!.data).slice(0, 300)}`);
  }
  const id = task!.data["id"] as string;
  const started = Date.now();
  for (;;) {
    await sleep(POLL_MS);
    const r = await runway(`/tasks/${id}`);
    const status = String(r.data["status"] ?? "");
    if (status === "SUCCEEDED") {
      const url = (r.data["output"] as string[] | undefined)?.[0];
      if (!url) throw new Error("Runway çıktı vermedi");
      const file = await fetch(url);
      if (!file.ok) throw new Error(`Çıktı indirilemedi (${file.status})`);
      mkdirSync(dirname(local(job.path)), { recursive: true });
      writeFileSync(local(job.path), Buffer.from(await file.arrayBuffer()));
      return;
    }
    if (status === "FAILED" || status === "CANCELED" || status === "CANCELLED") {
      throw new Error(String(r.data["failure"] ?? r.data["failureCode"] ?? "Runway hatası"));
    }
    if (Date.now() - started > 15 * 60_000) throw new Error("15 dakikada tamamlanmadı");
  }
}

async function runAll(jobs: Job[]) {
  const failures: { label: string; error: string }[] = [];
  let done = 0;
  let stop = false;
  const queue = [...jobs];
  const worker = async () => {
    while (queue.length && !stop) {
      const job = queue.shift()!;
      try {
        await runJob(job);
        done++;
        console.log(`  ✔ ${job.label}  (${done}/${jobs.length})`);
      } catch (e) {
        if (e instanceof DailyLimit) {
          stop = true;
          return;
        }
        failures.push({ label: job.label, error: e instanceof Error ? e.message : String(e) });
        console.log(`  ✖ ${job.label}: ${failures.at(-1)!.error}`);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return { failures, dailyLimit: stop };
}

// ---------- ana akış ----------
async function main() {
  console.log(`\n🎬 ${prod!.seriesSlug} · Bölüm ${prod!.episode}: ${prod!.title.tr}\n`);
  checkFfmpeg();
  const face = photoDataUri();

  apiKey = process.env["RUNWAY_API_KEY"] ?? "";
  if (!apiKey)
    apiKey = await ask("Runway geliştirici API anahtarını yapıştırın (ekranda görünmez): ", true);
  if (!apiKey.startsWith("key_"))
    fail("Anahtar 'key_' ile başlamalı. dev.runwayml.com → API Keys bölümünden alın.");
  const org = await runway("/organization");
  if (org.status === 401)
    fail(
      "Runway anahtarı geçersiz. dev.runwayml.com → API Keys bölümünden yeni anahtar oluşturun.",
    );
  const balance =
    typeof org.data["creditBalance"] === "number" ? (org.data["creditBalance"] as number) : null;

  const jobs: Job[] = [];
  for (const c of prod!.clips) {
    const path = paths.keyframe(c.key);
    if (have(path)) continue;
    jobs.push({
      label: `Kare ${c.key}`,
      path,
      credits: keyframeCost(c, quality),
      endpoint: "/text_to_image",
      body: {
        ...keyframeModel(c, quality),
        promptText: keyframePrompt(prod!, c),
        ...(c.face ? { referenceImages: [{ uri: face, tag: prod!.faceTag }] } : {}),
      },
    });
  }
  for (const lang of langs) {
    for (const line of prod!.lines) {
      const path = paths.voice(lang, line.key);
      if (have(path)) continue;
      const text = speechText(line, lang, MODEL);
      jobs.push({
        label: `Ses ${lang}:${line.key}`,
        path,
        credits: lineCredits(text),
        endpoint: "/text_to_speech",
        body: {
          model: MODEL,
          promptText: text,
          voice: { type: "runway-preset", presetId: prod!.speakers[line.speaker].defaultVoice },
          languageCode: lang,
        },
      });
    }
  }

  const credits = jobs.reduce((s, j) => s + j.credits, 0);
  const frames = jobs.filter((j) => j.endpoint === "/text_to_image").length;
  console.log(`Yapılacak: ${frames} kare, ${jobs.length - frames} ses (${langs.join(", ")})`);
  console.log(
    `Harcanacak kredi: yaklaşık ${credits}${balance !== null ? ` · bakiyeniz: ${balance}` : ""}`,
  );
  if (balance !== null && balance < credits) fail("Kredi yetersiz.");

  if (jobs.length) {
    const ok =
      args["onay"] === "true" ||
      (await ask("Devam edilsin mi? (e/h): ")).toLowerCase().startsWith("e");
    if (!ok) fail("İptal edildi, kredi harcanmadı.");
    console.log("\n▶ Runway'de üretiliyor (birkaç dakika sürebilir)…");
    const { failures, dailyLimit } = await runAll(jobs);
    if (dailyLimit) {
      console.log(
        "\n⏸  Runway'in günlük üretim sınırına ulaşıldı. Yarın 'npm run bolum' ile kaldığı yerden devam edin.",
      );
    }
    if (failures.length) {
      console.log(
        `\n${failures.length} iş başarısız oldu. Programı tekrar çalıştırırsanız yalnızca bunlar yeniden denenir.`,
      );
    }
  } else {
    console.log("Bütün kareler ve sesler zaten hazır.");
  }

  const framesReady = prod!.clips.every(
    (c) => have(paths.keyframe(c.key)) || have(paths.clip(c.key)),
  );
  const langReady = langs.some((l) => prod!.lines.every((line) => have(paths.voice(l, line.key))));
  if (!framesReady || !langReady) {
    fail(
      "Birleştirmek için tüm kareler ve en az bir dilin sesleri gerekli. Programı tekrar çalıştırın.",
    );
  }

  console.log("\n▶ Bölüm birleştiriliyor (5-10 dakika sürebilir)…");
  process.env["LOCAL_DIR"] = ROOT;
  process.argv = [process.argv[0]!, "assemble-episode.ts", prod!.seriesSlug, String(prod!.episode)];
  await import("./assemble-episode.ts");
}

main().catch((e) => fail(e instanceof Error ? e.message : String(e)));
