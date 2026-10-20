import type { SupabaseClient } from "npm:@supabase/supabase-js@2.117.3";
import { PRODUCTIONS } from "../_shared/productions/index.ts";
import {
  PRODUCTION_LANGS, TTS_MODELS, VOICE_PRESETS, IMAGE_QUALITIES, keyframeCost, keyframeModel, keyframePrompt,
  lineCredits, speechText, storagePaths, CREDITS, type ImageQuality, type Production, type ProductionLang, type SpeakerId, type TtsModel, type VoicePreset,
} from "../_shared/productions/types.ts";

const RUNWAY = "https://api.dev.runwayml.com/v1";
const RUNWAY_VERSION = "2024-11-06";
/** Aynı anda Runway'de çalışan en fazla iş (Tier 1: 1-2 eşzamanlı; fazlası THROTTLED kuyruğa girer). */
const MAX_IN_FLIGHT = 3;
/** Bir poll çağrısında indirilecek en fazla çıktı (fonksiyon süre sınırı için). */
const MAX_DOWNLOADS_PER_POLL = 4;
const IN_FLIGHT = ["PENDING", "RUNNING", "THROTTLED"];

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

export type Kind = "keyframe" | "clip" | "voice";
export type Step = "keyframes" | "clips" | "voices";
const STEP_KIND: Record<Step, Kind> = { keyframes: "keyframe", clips: "clip", voices: "voice" };

type Job = {
  id: string;
  kind: Kind;
  item_key: string;
  lang: string | null;
  status: string;
  runway_task_id: string | null;
  credits: number;
  params: Record<string, unknown>;
  storage_path: string | null;
  failure: string | null;
  attempts: number;
};

export class HttpError extends Error {
  constructor(public status: number, message: string, public extra: Record<string, unknown> = {}) {
    super(message);
  }
}

export async function requireAdmin(db: SupabaseClient, req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new HttpError(401, "Giriş gerekli");
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) throw new HttpError(401, "Giriş gerekli");
  const { data: isAdmin } = await db.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (isAdmin !== true) throw new HttpError(403, "Bu işlem yalnızca yöneticiler içindir");
}

export function findProduction(slug: unknown, episode: unknown): Production {
  const p = PRODUCTIONS.find((x) => x.seriesSlug === slug && x.episode === Number(episode));
  if (!p) throw new HttpError(404, "Bu bölüm için üretim planı yok");
  return p;
}

export class Ctx {
  paths: ReturnType<typeof storagePaths>;
  constructor(private db: SupabaseClient, private p: Production, private runwayKey: string | null) {
    this.paths = storagePaths(p);
  }

  // ---------- Runway ----------
  private async runway(path: string, init: { method?: string; body?: unknown } = {}) {
    if (!this.runwayKey) throw new HttpError(503, "RUNWAY_API_KEY tanımlı değil. Supabase → Edge Functions → Secrets bölümüne ekleyin.");
    const resp = await fetch(`${RUNWAY}${path}`, {
      method: init.method ?? (init.body ? "POST" : "GET"),
      headers: {
        Authorization: `Bearer ${this.runwayKey}`,
        "X-Runway-Version": RUNWAY_VERSION,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
    });
    const text = await resp.text();
    let data: Record<string, unknown> = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    return { ok: resp.ok, status: resp.status, data };
  }

  private async creditBalance(): Promise<number | null> {
    if (!this.runwayKey) return null;
    try {
      const r = await this.runway("/organization");
      return r.ok && typeof r.data.creditBalance === "number" ? r.data.creditBalance : null;
    } catch {
      return null;
    }
  }

  // ---------- Depolama ----------
  private async signed(path: string, seconds = 3600): Promise<string> {
    const { data, error } = await this.db.storage.from("videos").createSignedUrl(path, seconds);
    if (error || !data) throw new Error(`İmzalı bağlantı oluşturulamadı: ${path}`);
    return data.signedUrl;
  }

  private async exists(path: string): Promise<boolean> {
    const dir = path.slice(0, path.lastIndexOf("/"));
    const name = path.slice(path.lastIndexOf("/") + 1);
    const { data } = await this.db.storage.from("videos").list(dir, { search: name });
    return (data ?? []).some((f) => f.name === name);
  }

  // ---------- İşler ----------
  private async jobs(): Promise<Job[]> {
    const { data, error } = await this.db
      .from("production_jobs")
      .select("id,kind,item_key,lang,status,runway_task_id,credits,params,storage_path,failure,attempts")
      .eq("series_slug", this.p.seriesSlug)
      .eq("episode_n", this.p.episode)
      .order("kind")
      .order("item_key");
    if (error) throw new Error(error.message);
    return (data ?? []) as Job[];
  }

  private async update(id: string, patch: Partial<Job>) {
    await this.db.from("production_jobs").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
  }

  /** Bir adım için yapılacak (henüz başarılı ya da yolda olmayan) işler ve kredileri. */
  private plan(step: Step, jobs: Job[], opts: ReturnType<Ctx["options"]>) {
    const kind = STEP_KIND[step];
    const done = new Set(
      jobs.filter((j) => j.kind === kind && (j.status === "SUCCEEDED" || j.status === "queued" || IN_FLIGHT.includes(j.status)))
        .map((j) => j.item_key),
    );
    const items: { item_key: string; lang: string | null; credits: number; params: Record<string, unknown> }[] = [];
    if (kind === "keyframe") {
      for (const c of this.p.clips) {
        if (done.has(c.key) || (opts.only && !opts.only.includes(c.key))) continue;
        items.push({ item_key: c.key, lang: null, credits: keyframeCost(c, opts.quality), params: { quality: opts.quality } });
      }
    } else if (kind === "clip") {
      const ready = new Set(jobs.filter((j) => j.kind === "keyframe" && j.status === "SUCCEEDED").map((j) => j.item_key));
      for (const c of this.p.clips) {
        if (!done.has(c.key) && ready.has(c.key) && (!opts.only || opts.only.includes(c.key))) {
          items.push({ item_key: c.key, lang: null, credits: c.duration * CREDITS.gen4TurboPerSec, params: {} });
        }
      }
    } else {
      for (const lang of opts.langs) {
        for (const line of this.p.lines) {
          const key = `${lang}:${line.key}`;
          if (done.has(key)) continue;
          items.push({
            item_key: key, lang,
            credits: lineCredits(speechText(line, lang, opts.model)),
            params: { model: opts.model, voice: opts.voices[line.speaker] },
          });
        }
      }
    }
    return { items, credits: items.reduce((s, i) => s + i.credits, 0) };
  }

  private options(body: Record<string, unknown>) {
    const model = TTS_MODELS.includes(body.ttsModel as TtsModel) ? (body.ttsModel as TtsModel) : "eleven_v3";
    const langs = Array.isArray(body.langs)
      ? PRODUCTION_LANGS.filter((l) => (body.langs as string[]).includes(l))
      : [...PRODUCTION_LANGS];
    const voices = {} as Record<SpeakerId, VoicePreset>;
    const asked = (body.voices ?? {}) as Record<string, string>;
    for (const [id, sp] of Object.entries(this.p.speakers) as [SpeakerId, Production["speakers"][SpeakerId]][]) {
      const v = asked[id];
      voices[id] = VOICE_PRESETS.includes(v as VoicePreset) ? (v as VoicePreset) : sp.defaultVoice;
    }
    const quality: ImageQuality = IMAGE_QUALITIES.includes(body.imageQuality as ImageQuality)
      ? (body.imageQuality as ImageQuality)
      : "economy";
    /** Yalnızca bu klipler (ör. tek bir kareyi videoya çevirmek için). */
    const only = Array.isArray(body.only) ? (body.only as unknown[]).map(String) : null;
    return { model, langs, voices, quality, only };
  }

  // ---------- Eylemler ----------
  async overview() {
    const jobs = await this.jobs();
    const opts = this.options({});
    const steps = (["keyframes", "clips", "voices"] as Step[]).map((step) => {
      const kind = STEP_KIND[step];
      const own = jobs.filter((j) => j.kind === kind);
      const total = kind === "voice" ? this.p.lines.length * PRODUCTION_LANGS.length : this.p.clips.length;
      return {
        step,
        total,
        succeeded: own.filter((j) => j.status === "SUCCEEDED").length,
        inFlight: own.filter((j) => j.status === "queued" || IN_FLIGHT.includes(j.status)).length,
        failed: own.filter((j) => j.status === "FAILED" || j.status === "CANCELED").length,
        nextCredits: this.plan(step, jobs, opts).credits,
      };
    });
    return {
      title: this.p.title,
      durationSec: this.p.durationSec,
      hasReference: await this.exists(this.paths.reference),
      referencePath: this.paths.reference,
      runwayConfigured: Boolean(this.runwayKey),
      creditBalance: await this.creditBalance(),
      speakers: this.p.speakers,
      voicePresets: VOICE_PRESETS,
      imageQualities: IMAGE_QUALITIES,
      ttsModels: TTS_MODELS,
      langs: PRODUCTION_LANGS,
      clips: this.p.clips.map((c) => ({ key: c.key, scene: c.scene, duration: c.duration, face: c.face, motion: c.motion })),
      lines: this.p.lines.map((l) => ({ key: l.key, scene: l.scene, speaker: l.speaker, at: l.at, text: l.text.tr })),
      steps,
      jobs: await this.signJobs(jobs),
    };
  }

  /** Arayüzde önizleme için başarılı çıktılara kısa süreli bağlantı ekler. */
  private async signJobs(jobs: Job[]) {
    const paths = jobs.filter((j) => j.status === "SUCCEEDED" && j.storage_path).map((j) => j.storage_path!);
    const urls = new Map<string, string>();
    if (paths.length) {
      const { data } = await this.db.storage.from("videos").createSignedUrls(paths, 3600);
      for (const d of data ?? []) if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl);
    }
    return jobs.map((j) => ({ ...j, url: j.storage_path ? urls.get(j.storage_path) ?? null : null }));
  }

  async start(body: Record<string, unknown>) {
    const step = body.step as Step;
    if (!(step in STEP_KIND)) throw new HttpError(400, "Geçersiz adım");
    if (!this.runwayKey) throw new HttpError(503, "RUNWAY_API_KEY tanımlı değil");
    if (step === "keyframes" && this.p.clips.some((c) => c.face) && !(await this.exists(this.paths.reference))) {
      throw new HttpError(400, "Önce başrol fotoğrafını yükleyin");
    }
    const jobs = await this.jobs();
    const opts = this.options(body);
    const { items, credits } = this.plan(step, jobs, opts);
    if (!items.length) throw new HttpError(400, step === "clips" ? "Videoya dönüştürülecek hazır kare yok" : "Bu adımda yapılacak iş kalmadı");
    if (Number(body.expectedCredits) !== credits) {
      throw new HttpError(409, "Kredi tutarı değişti, lütfen yeniden onaylayın", { credits });
    }
    const balance = await this.creditBalance();
    if (balance !== null && balance < credits) {
      throw new HttpError(402, `Yetersiz kredi: ${credits} gerekli, ${balance} var`, { credits, balance });
    }
    const rows = items.map((i) => ({
      series_slug: this.p.seriesSlug, episode_n: this.p.episode, kind: STEP_KIND[step],
      item_key: i.item_key, lang: i.lang, credits: i.credits, params: i.params,
      status: "queued", runway_task_id: null, failure: null, storage_path: null, updated_at: new Date().toISOString(),
    }));
    const { error } = await this.db.from("production_jobs").upsert(rows, { onConflict: "series_slug,episode_n,kind,item_key" });
    if (error) throw new Error(error.message);
    const pump = await this.pump();
    return { queued: items.length, credits, ...pump };
  }

  async retry(kind: Kind, itemKey: string) {
    const job = (await this.jobs()).find((j) => j.kind === kind && j.item_key === itemKey);
    if (!job) throw new HttpError(404, "İş bulunamadı");
    if (job.status === "queued" || IN_FLIGHT.includes(job.status)) throw new HttpError(400, "Bu iş zaten sürüyor");
    await this.update(job.id, { status: "queued", runway_task_id: null, failure: null });
    return { ...(await this.pump()), credits: job.credits };
  }

  async cancel() {
    const { error } = await this.db.from("production_jobs")
      .update({ status: "CANCELED", failure: "Yönetici durdurdu", updated_at: new Date().toISOString() })
      .eq("series_slug", this.p.seriesSlug).eq("episode_n", this.p.episode).eq("status", "queued");
    if (error) throw new Error(error.message);
    return { canceled: true };
  }

  async poll() {
    const jobs = await this.jobs();
    let downloads = 0;
    for (const job of jobs.filter((j) => IN_FLIGHT.includes(j.status) && j.runway_task_id)) {
      const r = await this.runway(`/tasks/${job.runway_task_id}`);
      if (!r.ok) continue;
      const status = String(r.data.status ?? "");
      if (status === "SUCCEEDED") {
        if (downloads >= MAX_DOWNLOADS_PER_POLL) continue;
        downloads++;
        const out = (r.data.output as string[] | undefined)?.[0];
        try {
          if (!out) throw new Error("Runway çıktı vermedi");
          await this.save(job, out);
        } catch (e) {
          await this.update(job.id, { status: "FAILED", failure: e instanceof Error ? e.message : "Kaydedilemedi" });
        }
      } else if (status === "FAILED" || status === "CANCELED" || status === "CANCELLED") {
        await this.update(job.id, {
          status: status === "FAILED" ? "FAILED" : "CANCELED",
          failure: String(r.data.failure ?? r.data.failureCode ?? "Runway hatası"),
        });
      } else if (["PENDING", "RUNNING", "THROTTLED"].includes(status) && status !== job.status) {
        await this.update(job.id, { status });
      } else if (status === "THROTTLING" && job.status !== "THROTTLED") {
        await this.update(job.id, { status: "THROTTLED" });
      }
    }
    const pump = await this.pump();
    return { ...pump, overview: await this.overview() };
  }

  private async save(job: Job, url: string) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Çıktı indirilemedi (${resp.status})`);
    const bytes = new Uint8Array(await resp.arrayBuffer());
    let path: string;
    let type: string;
    if (job.kind === "keyframe") {
      type = resp.headers.get("content-type")?.includes("jpeg") ? "image/jpeg" : "image/png";
      path = this.paths.keyframe(job.item_key);
    } else if (job.kind === "clip") {
      type = "video/mp4";
      path = this.paths.clip(job.item_key);
    } else {
      type = "audio/mpeg";
      const [lang, key] = job.item_key.split(":") as [ProductionLang, string];
      path = this.paths.voice(lang, key);
    }
    const { error } = await this.db.storage.from("videos").upload(path, bytes, { upsert: true, contentType: type });
    if (error) throw new Error(error.message);
    await this.update(job.id, { status: "SUCCEEDED", storage_path: path, failure: null });
  }

  /** Sıradaki işleri Runway'e gönderir; günlük sınıra (429) takılınca durur. */
  private async pump() {
    const jobs = await this.jobs();
    let inFlight = jobs.filter((j) => IN_FLIGHT.includes(j.status)).length;
    const order: Kind[] = ["keyframe", "clip", "voice"];
    const queued = jobs.filter((j) => j.status === "queued")
      .sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.item_key.localeCompare(b.item_key));
    let submitted = 0;
    let dailyLimit = false;
    for (const job of queued) {
      if (inFlight >= MAX_IN_FLIGHT) break;
      let payload: { path: string; body: Record<string, unknown> };
      try {
        payload = await this.request(job);
      } catch (e) {
        await this.update(job.id, { status: "FAILED", failure: e instanceof Error ? e.message : "Hazırlanamadı" });
        continue;
      }
      const r = await this.runway(payload.path, { body: payload.body });
      if (r.status === 429) {
        dailyLimit = true;
        break;
      }
      if (!r.ok || typeof r.data.id !== "string") {
        await this.update(job.id, { status: "FAILED", failure: `Runway ${r.status}: ${JSON.stringify(r.data).slice(0, 400)}` });
        continue;
      }
      await this.update(job.id, { status: "PENDING", runway_task_id: r.data.id, attempts: job.attempts + 1 });
      inFlight++;
      submitted++;
    }
    return { submitted, dailyLimit };
  }

  private async request(job: Job): Promise<{ path: string; body: Record<string, unknown> }> {
    if (job.kind === "keyframe") {
      const clip = this.p.clips.find((c) => c.key === job.item_key);
      if (!clip) throw new Error("Klip planda yok");
      const quality: ImageQuality = job.params.quality === "high" ? "high" : "economy";
      const body: Record<string, unknown> = {
        ...keyframeModel(clip, quality),
        promptText: keyframePrompt(this.p, clip),
      };
      if (clip.face) body.referenceImages = [{ uri: await this.signed(this.paths.reference), tag: this.p.faceTag }];
      return { path: "/text_to_image", body };
    }
    if (job.kind === "clip") {
      const clip = this.p.clips.find((c) => c.key === job.item_key);
      if (!clip) throw new Error("Klip planda yok");
      return {
        path: "/image_to_video",
        body: {
          model: "gen4_turbo",
          promptImage: await this.signed(this.paths.keyframe(clip.key)),
          promptText: clip.motion,
          ratio: "1280:720",
          duration: clip.duration,
        },
      };
    }
    const [lang, key] = job.item_key.split(":") as [ProductionLang, string];
    const line = this.p.lines.find((l) => l.key === key);
    if (!line) throw new Error("Replik planda yok");
    const model = (job.params.model as TtsModel) ?? "eleven_v3";
    const voice = (job.params.voice as VoicePreset) ?? this.p.speakers[line.speaker].defaultVoice;
    const body: Record<string, unknown> = {
      model,
      promptText: speechText(line, lang, model),
      voice: { type: "runway-preset", presetId: voice },
    };
    if (model === "eleven_v3") body.languageCode = lang;
    return { path: "/text_to_speech", body };
  }
}
