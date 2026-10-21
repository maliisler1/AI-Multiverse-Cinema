/**
 * Gerçek Runway ve Supabase olmadan üretim akışını test eder.
 * Çalıştırma: deno test supabase/functions/episode-production/production.test.ts
 */
import { Ctx, HttpError } from "./production.ts";
import { neoGenesisE1 as p } from "../_shared/productions/neo-genesis-2099-e1.ts";
import { storagePaths } from "../_shared/productions/types.ts";

function assert(cond: unknown, msg = "assertion failed"): asserts cond {
  if (!cond) throw new Error(msg);
}
function eq<T>(a: T, b: T, msg = "") {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} beklenen ${JSON.stringify(b)}, gelen ${JSON.stringify(a)}`);
}
async function rejects(fn: () => Promise<unknown>, status: number) {
  try {
    await fn();
  } catch (e) {
    if (e instanceof HttpError && e.status === status) return e;
    throw new Error(`HTTP ${status} bekleniyordu, gelen: ${e}`);
  }
  throw new Error(`HTTP ${status} bekleniyordu, hata yok`);
}

type Row = Record<string, unknown>;

class FakeDb {
  rows: Row[] = [];
  files = new Map<string, Uint8Array>();
  private seq = 0;

  from(_table: string) {
    return new Query(this);
  }
  storage = {
    from: (_bucket: string) => ({
      createSignedUrl: async (path: string) => ({ data: { signedUrl: `https://signed.test/${path}` }, error: null }),
      createSignedUrls: async (paths: string[]) => ({
        data: paths.map((path) => ({ path, signedUrl: `https://signed.test/${path}` })), error: null,
      }),
      list: async (dir: string, opts: { search: string }) => ({
        data: [...this.files.keys()].filter((k) => k === `${dir}/${opts.search}`).map((k) => ({ name: k.split("/").pop()! })),
        error: null,
      }),
      upload: async (path: string, bytes: Uint8Array) => {
        this.files.set(path, bytes);
        return { error: null };
      },
    }),
  };
  insert(row: Row) {
    this.rows.push({ id: `job${++this.seq}`, attempts: 0, ...row });
  }
}

class Query {
  private op: "select" | "update" | "upsert" = "select";
  private patch: Row = {};
  private upserts: Row[] = [];
  private filters: [string, unknown][] = [];
  constructor(private db: FakeDb) {}
  select() { return this; }
  order() { return this; }
  eq(k: string, v: unknown) { this.filters.push([k, v]); return this; }
  update(patch: Row) { this.op = "update"; this.patch = patch; return this; }
  upsert(rows: Row[]) { this.op = "upsert"; this.upserts = rows; return this; }
  then<A>(resolve: (v: { data: Row[] | null; error: null }) => A) {
    return Promise.resolve(this.run()).then(resolve);
  }
  private match(r: Row) {
    return this.filters.every(([k, v]) => r[k] === v);
  }
  private run() {
    if (this.op === "update") {
      for (const r of this.db.rows) if (this.match(r)) Object.assign(r, this.patch);
      return { data: null, error: null };
    }
    if (this.op === "upsert") {
      for (const u of this.upserts) {
        const hit = this.db.rows.find((r) =>
          r.series_slug === u.series_slug && r.episode_n === u.episode_n && r.kind === u.kind && r.item_key === u.item_key);
        if (hit) Object.assign(hit, u); else this.db.insert(u);
      }
      return { data: null, error: null };
    }
    const data = this.db.rows.filter((r) => this.match(r)).map((r) => ({ ...r }))
      .sort((a, b) => String(a.kind).localeCompare(String(b.kind)) || String(a.item_key).localeCompare(String(b.item_key)));
    return { data, error: null };
  }
}

/** Sahte Runway: görevler her poll'da bir adım ilerler. */
function fakeRunway(opts: { balance?: number; limitAfter?: number } = {}) {
  const requests: { path: string; body: Record<string, unknown> }[] = [];
  const tasks = new Map<string, number>();
  let created = 0;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const res = (body: unknown, status = 200) =>
      new Response(typeof body === "string" ? body : JSON.stringify(body), { status });
    if (url.startsWith("https://output.test/")) return new Response(new Uint8Array([1, 2, 3]), { headers: { "content-type": "image/png" } });
    const path = url.replace("https://api.dev.runwayml.com/v1", "");
    if (path === "/organization") return res({ creditBalance: opts.balance ?? 1923 });
    if (path.startsWith("/tasks/")) {
      const id = path.split("/")[2]!;
      const n = (tasks.get(id) ?? 0) + 1;
      tasks.set(id, n);
      return res(n >= 2 ? { id, status: "SUCCEEDED", output: [`https://output.test/${id}`] } : { id, status: "RUNNING" });
    }
    if (opts.limitAfter !== undefined && created >= opts.limitAfter) return res({ error: "daily limit" }, 429);
    requests.push({ path, body: JSON.parse(String(init?.body)) });
    const id = `task_${++created}`;
    return res({ id });
  }) as typeof fetch;
  return { requests };
}

const paths = storagePaths(p);
// deno-lint-ignore no-explicit-any
const ctxOf = (db: FakeDb) => new Ctx(db as any, p, "test-key");

async function drain(ctx: Ctx, rounds = 40) {
  for (let i = 0; i < rounds; i++) {
    const r = await ctx.poll();
    if (r.overview.jobs.every((j) => j.status === "SUCCEEDED" || j.status === "FAILED")) return r;
  }
  throw new Error("işler bitmedi");
}

Deno.test("başrol fotoğrafı olmadan kare üretimi başlamaz", async () => {
  fakeRunway();
  await rejects(() => ctxOf(new FakeDb()).start({ step: "keyframes", expectedCredits: 64 }), 400);
});

Deno.test("kredi onayı tutmazsa 409 ve doğru tutar döner, Runway'e istek gitmez", async () => {
  const rw = fakeRunway();
  const db = new FakeDb();
  db.files.set(paths.reference, new Uint8Array([1]));
  const e = await rejects(() => ctxOf(db).start({ step: "keyframes", expectedCredits: -1 }), 409);
  eq(e.extra.credits, 64);
  eq(rw.requests.length, 0);
});

Deno.test("yetersiz kredide 402", async () => {
  fakeRunway({ balance: 50 });
  const db = new FakeDb();
  db.files.set(paths.reference, new Uint8Array([1]));
  await rejects(() => ctxOf(db).start({ step: "keyframes", expectedCredits: 64 }), 402);
});

Deno.test("kareler → klipler → sesler uçtan uca", async () => {
  const rw = fakeRunway();
  const db = new FakeDb();
  db.files.set(paths.reference, new Uint8Array([1]));
  const ctx = ctxOf(db);

  // Kareler
  const s1 = await ctx.start({ step: "keyframes", imageQuality: "high", expectedCredits: 160 });
  eq(s1.queued, 20);
  eq(s1.submitted, 3, "eşzamanlı sınır");
  const faceReq = rw.requests.find((r) => r.body.referenceImages);
  assert(faceReq, "yüz referanslı istek yok");
  eq((faceReq.body.referenceImages as { tag: string }[])[0]!.tag, "AyShe");
  assert(String(faceReq.body.promptText).startsWith("@AyShe, "), "komut @AyShe ile başlamalı");
  eq(rw.requests[0]!.body.model, "gen4_image");
  eq(rw.requests[0]!.body.ratio, "1920:1080");
  eq(faceReq.body.model, "gen4_image", "yüksek kalitede yüzlü kare de gen4_image");
  await drain(ctx);
  eq(p.clips.every((c) => db.files.has(paths.keyframe(c.key))), true, "tüm kareler kaydedildi");

  // Klipler: tutar 900
  const before = rw.requests.length;
  await rejects(() => ctx.start({ step: "clips", expectedCredits: 100 }), 409);
  await ctx.start({ step: "clips", expectedCredits: 900 });
  const clipReq = rw.requests[before]!;
  eq(clipReq.path, "/image_to_video");
  eq(clipReq.body.model, "gen4_turbo");
  eq(clipReq.body.duration, p.clips[0]!.duration);
  eq(clipReq.body.promptImage, `https://signed.test/${paths.keyframe("c01")}`);
  await drain(ctx);
  eq(p.clips.every((c) => db.files.has(paths.clip(c.key))), true, "tüm klipler kaydedildi");

  // Sesler: yalnızca tr+en, ses seçimi uygulanır
  const ov = await ctx.overview();
  eq(ov.steps.find((s) => s.step === "clips")!.succeeded, 20);
  const e = await rejects(() => ctx.start({ step: "voices", langs: ["tr", "en"], voices: { ayshe: "Katie" }, expectedCredits: -1 }), 409);
  const v = await ctx.start({ step: "voices", langs: ["tr", "en"], voices: { ayshe: "Katie" }, expectedCredits: e.extra.credits });
  eq(v.queued, p.lines.length * 2);
  await drain(ctx, 80);
  const tts = rw.requests.filter((r) => r.path === "/text_to_speech");
  eq(tts.length, p.lines.length * 2);
  const l02 = tts.find((r) => String(r.body.promptText).includes("Neredeyim"))!;
  eq(l02.body.promptText, "[whispers] Neredeyim? Ben... kimim?");
  eq(l02.body.voice, { type: "runway-preset", presetId: "Katie" });
  eq(l02.body.languageCode, "tr");
  const narrator = tts.find((r) => String(r.body.promptText).startsWith("Yıl 2300"))!;
  eq((narrator.body.voice as { presetId: string }).presetId, "Vincent");
  assert(db.files.has(paths.voice("en", "l21")), "İngilizce son replik kaydedildi");

  // Her şey bittiyse yeniden başlatmak iş üretmez
  await rejects(() => ctx.start({ step: "keyframes", expectedCredits: 0 }), 400);
});

Deno.test("günlük sınır (429) kuyruğu durdurur, işler sırada kalır", async () => {
  fakeRunway({ limitAfter: 2 });
  const db = new FakeDb();
  db.files.set(paths.reference, new Uint8Array([1]));
  const r = await ctxOf(db).start({ step: "keyframes", expectedCredits: 64 });
  eq(r.submitted, 2);
  eq(r.dailyLimit, true);
  eq(db.rows.filter((x) => x.status === "queued").length, 18);
});

Deno.test("başarısız iş yeniden denenebilir", async () => {
  fakeRunway();
  const db = new FakeDb();
  db.files.set(paths.reference, new Uint8Array([1]));
  const ctx = ctxOf(db);
  await ctx.start({ step: "keyframes", expectedCredits: 64 });
  const job = db.rows.find((x) => x.item_key === "c01")!;
  job.status = "FAILED";
  job.failure = "SAFETY.OUTPUT";
  const r = await ctx.retry("keyframe", "c01");
  eq(r.credits, 5, "c01 yüzsüz ekonomik kare");
  eq(db.rows.find((x) => x.item_key === "c01")!.failure, null);
  await rejects(() => ctx.retry("keyframe", "c02"), 400);
});

Deno.test("ekonomik kareler: yüzlü kare turbo (2), yüzsüz 720p (5); tek kare videoya çevrilebilir", async () => {
  const rw = fakeRunway();
  const db = new FakeDb();
  db.files.set(paths.reference, new Uint8Array([1]));
  const ctx = ctxOf(db);
  await ctx.start({ step: "keyframes", expectedCredits: 64 });
  await drain(ctx);
  const imgs = rw.requests.filter((r) => r.path === "/text_to_image");
  eq(imgs.length, 20);
  const face = imgs.filter((r) => r.body.referenceImages);
  eq(face.length, p.clips.filter((c) => c.face).length);
  assert(face.every((r) => r.body.model === "gen4_image_turbo" && r.body.ratio === "1920:1080"), "yüzlü kareler turbo");
  assert(imgs.filter((r) => !r.body.referenceImages).every((r) => r.body.model === "gen4_image" && r.body.ratio === "1280:720"), "yüzsüz kareler 720p");

  // Yalnızca c11'i videoya çevir: 10 sn × 5 = 50 kredi
  const e = await rejects(() => ctx.start({ step: "clips", only: ["c11"], expectedCredits: -1 }), 409);
  eq(e.extra.credits, 50);
  const r = await ctx.start({ step: "clips", only: ["c11"], expectedCredits: 50 });
  eq(r.queued, 1);
  eq(rw.requests.at(-1)!.path, "/image_to_video");
  eq((await ctx.overview()).steps.find((s) => s.step === "clips")!.nextCredits, 900 - 50);
});
