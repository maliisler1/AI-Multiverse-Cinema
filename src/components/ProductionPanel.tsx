import { useCallback, useEffect, useRef, useState } from "react";
import {
  CloudUpload,
  Image as ImageIcon,
  Film,
  Mic,
  Combine,
  Loader as Loader2,
  RotateCcw,
  Square,
  Check,
  CircleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

/** episode-production fonksiyonunun döndürdüğü özet. */
type Job = {
  id: string;
  kind: "keyframe" | "clip" | "voice";
  item_key: string;
  lang: string | null;
  status: string;
  credits: number;
  failure: string | null;
  url: string | null;
};
type StepName = "keyframes" | "clips" | "voices";
type Overview = {
  title: Record<string, string>;
  durationSec: number;
  hasReference: boolean;
  referencePath: string;
  runwayConfigured: boolean;
  creditBalance: number | null;
  speakers: Record<string, { name: string; defaultVoice: string }>;
  voicePresets: string[];
  ttsModels: string[];
  langs: string[];
  clips: { key: string; scene: number; duration: number; face: boolean; motion: string }[];
  lines: { key: string; scene: number; speaker: string; at: number; text: string }[];
  steps: {
    step: StepName;
    total: number;
    succeeded: number;
    inFlight: number;
    failed: number;
    nextCredits: number;
  }[];
  jobs: Job[];
};

const ACTIVE = ["queued", "PENDING", "RUNNING", "THROTTLED"];
const LANG_LABEL: Record<string, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
  ar: "العربية",
  hi: "हिन्दी",
};
const ASSEMBLE_URL =
  "https://github.com/maliisler1/AI-Multiverse-Cinema/actions/workflows/assemble-episode.yml";

async function call(action: string, payload: Record<string, unknown> = {}) {
  const { data } = await supabase.auth.getSession();
  const resp = await fetch(
    `${import.meta.env["VITE_SUPABASE_URL"]}/functions/v1/episode-production`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session?.access_token ?? ""}`,
      },
      body: JSON.stringify({ action, ...payload }),
    },
  );
  const body = await resp.json().catch(() => ({}));
  return { ok: resp.ok, status: resp.status, body };
}

export function ProductionPanel({
  seriesSlug = "neo-genesis-2099",
  episode = 1,
}: {
  seriesSlug?: string;
  episode?: number;
}) {
  const { lang } = useT();
  const tr = (a: string, b: string) => (lang === "tr" ? a : b);
  const [ov, setOv] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<{
    step: StepName;
    credits: number;
    only?: string[] | undefined;
  } | null>(null);
  const [dailyLimit, setDailyLimit] = useState(false);
  const [refUrl, setRefUrl] = useState<string | null>(null);
  const [voices, setVoices] = useState<Record<string, string>>({});
  const [ttsModel, setTtsModel] = useState("eleven_v3");
  const [quality, setQuality] = useState<"economy" | "high">("economy");
  const [langs, setLangs] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const base = { seriesSlug, episode };

  const apply = useCallback((o: Overview) => {
    setOv(o);
    setVoices((v) =>
      Object.keys(v).length
        ? v
        : Object.fromEntries(Object.entries(o.speakers).map(([k, s]) => [k, s.defaultVoice])),
    );
    setLangs((l) => (l.length ? l : o.langs));
  }, []);

  const load = useCallback(async () => {
    const r = await call("overview", base);
    if (!r.ok) {
      setError(r.body.error ?? `HTTP ${r.status}`);
      return;
    }
    setError(null);
    apply(r.body as Overview);
  }, [seriesSlug, episode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!ov?.hasReference) return;
    void supabase.storage
      .from("videos")
      .createSignedUrl(ov.referencePath, 3600)
      .then(({ data }) => setRefUrl(data?.signedUrl ?? null));
  }, [ov?.hasReference, ov?.referencePath]);

  // Yolda iş varken 10 sn'de bir Runway'i yokla ve sıradakileri gönder.
  const active = ov?.jobs.some((j) => ACTIVE.includes(j.status)) ?? false;
  useEffect(() => {
    if (!active) return;
    const id = setInterval(async () => {
      const r = await call("poll", base);
      if (r.ok) {
        apply(r.body.overview as Overview);
        setDailyLimit(Boolean(r.body.dailyLimit));
      }
    }, 10_000);
    return () => clearInterval(id);
  }, [active, seriesSlug, episode]); // eslint-disable-line react-hooks/exhaustive-deps

  const options = (step: StepName, only?: string[]) =>
    step === "voices"
      ? { voices, ttsModel, langs }
      : step === "keyframes"
        ? { imageQuality: quality }
        : only
          ? { only }
          : {};

  /** Önce tutarı sunucudan öğrenir (409), sonra kullanıcı onayı ister. */
  const ask = async (step: StepName, only?: string[]) => {
    setBusy(true);
    const r = await call("start", { ...base, step, expectedCredits: -1, ...options(step, only) });
    setBusy(false);
    if (r.status === 409 && typeof r.body.credits === "number")
      setConfirm({ step, credits: r.body.credits, only });
    else toast.error(r.body.error ?? tr("Başlatılamadı", "Could not start"));
  };

  const start = async () => {
    if (!confirm) return;
    setBusy(true);
    const r = await call("start", {
      ...base,
      step: confirm.step,
      expectedCredits: confirm.credits,
      ...options(confirm.step, confirm.only),
    });
    setBusy(false);
    setConfirm(null);
    if (!r.ok) {
      toast.error(r.body.error ?? tr("Başlatılamadı", "Could not start"));
      return;
    }
    setDailyLimit(Boolean(r.body.dailyLimit));
    toast.success(tr(`${r.body.queued} iş sıraya alındı`, `${r.body.queued} jobs queued`));
    await load();
  };

  const retry = async (job: Job) => {
    if (
      !window.confirm(
        tr(
          `${job.item_key} yeniden üretilsin mi? (${job.credits} kredi)`,
          `Regenerate ${job.item_key}? (${job.credits} credits)`,
        ),
      )
    )
      return;
    const r = await call("retry", { ...base, kind: job.kind, itemKey: job.item_key });
    if (!r.ok) toast.error(r.body.error ?? "Hata");
    await load();
  };

  const stop = async () => {
    await call("cancel", base);
    toast.info(
      tr(
        "Sıradaki işler durduruldu. Runway'de başlamış olanlar tamamlanacak.",
        "Queued jobs stopped. Jobs already running will finish.",
      ),
    );
    await load();
  };

  const uploadReference = async (file: File) => {
    if (!ov) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error(tr("Fotoğraf 15 MB'tan küçük olmalı", "Photo must be under 15 MB"));
      return;
    }
    setBusy(true);
    const { error: upErr } = await supabase.storage
      .from("videos")
      .upload(ov.referencePath, file, { upsert: true, contentType: file.type });
    setBusy(false);
    if (upErr) toast.error(upErr.message);
    else {
      toast.success(tr("Başrol fotoğrafı yüklendi", "Lead photo uploaded"));
      await load();
    }
  };

  if (error)
    return (
      <p className="mt-4 rounded-2xl bg-destructive/15 p-4 text-sm text-destructive">{error}</p>
    );
  if (!ov)
    return (
      <div className="mt-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  const step = (name: StepName) => ov.steps.find((s) => s.step === name)!;
  const jobsOf = (kind: Job["kind"]) => ov.jobs.filter((j) => j.kind === kind);
  const failed = ov.jobs.filter((j) => j.status === "FAILED" || j.status === "CANCELED");
  const allFrames = step("keyframes").succeeded === step("keyframes").total;
  const animated = new Set(
    jobsOf("clip")
      .filter((j) => j.status === "SUCCEEDED" || ACTIVE.includes(j.status))
      .map((j) => j.item_key),
  );
  const anyVoiceLang = ov.langs.some(
    (l) =>
      jobsOf("voice").filter((j) => j.lang === l && j.status === "SUCCEEDED").length ===
      ov.lines.length,
  );

  const renderStep = ({
    name,
    icon,
    title,
    desc,
    disabled,
    children,
  }: {
    name: StepName;
    icon: React.ReactNode;
    title: string;
    desc: string;
    disabled?: string | undefined;
    children?: React.ReactNode;
  }) => {
    const s = step(name);
    const done = s.succeeded === s.total;
    return (
      <section className="rounded-2xl border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold">
              {icon} {title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${done ? "bg-primary/20 text-primary" : "bg-secondary"}`}
          >
            {s.succeeded}/{s.total}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-neon transition-all"
            style={{ width: `${(s.succeeded / s.total) * 100}%` }}
          />
        </div>
        {s.inFlight > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-xs">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
            {tr(`${s.inFlight} iş üretiliyor`, `${s.inFlight} jobs in progress`)}
          </p>
        )}
        {children}
        {!done &&
          s.inFlight === 0 &&
          (disabled ? (
            <p className="mt-3 text-xs text-muted-foreground">{disabled}</p>
          ) : (
            <button
              disabled={busy}
              onClick={() => void ask(name)}
              className="mt-3 rounded-full bg-neon px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              {s.succeeded ? tr("Kalanları üret", "Generate the rest") : tr("Üret", "Generate")}
              {name === "keyframes"
                ? ` · ≈${quality === "high" ? (s.total - s.succeeded) * 8 : s.nextCredits} ${tr("kredi", "credits")}`
                : name === "clips"
                  ? ` · ≈${s.nextCredits} ${tr("kredi", "credits")}`
                  : ""}
            </button>
          ))}
      </section>
    );
  };

  return (
    <div className="mt-4 space-y-4 pb-10">
      <div className="rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-bold">
          Neo-Genesis: 2099 · {tr("Bölüm", "Episode")} {episode}: {ov.title[lang] ?? ov.title["tr"]}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {ov.clips.length} {tr("klip", "clips")} · {ov.lines.length} {tr("replik", "lines")} ·{" "}
          {ov.langs.length} {tr("dil", "languages")} · {ov.durationSec / 60}{" "}
          {tr("dakika", "minutes")}
        </p>
        <p className="mt-2 text-sm">
          {ov.runwayConfigured ? (
            <>
              {tr("Runway kredisi", "Runway credits")}: <b>{ov.creditBalance ?? "?"}</b>
            </>
          ) : (
            <span className="text-destructive">
              {tr(
                "RUNWAY_API_KEY Supabase'e eklenmemiş.",
                "RUNWAY_API_KEY is not set in Supabase.",
              )}
            </span>
          )}
        </p>
        {active && (
          <button
            onClick={() => void stop()}
            className="mt-3 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold"
          >
            <Square className="h-3.5 w-3.5" /> {tr("Sıradakileri durdur", "Stop queued jobs")}
          </button>
        )}
        {dailyLimit && (
          <p className="mt-3 rounded-xl bg-secondary p-3 text-xs">
            {tr(
              "Runway'in günlük üretim sınırına ulaşıldı. Kalan işler sırada bekliyor; yarın bu sayfayı açtığınızda kaldığı yerden devam eder.",
              "Runway's daily generation limit was reached. Remaining jobs wait in the queue and resume when you open this page tomorrow.",
            )}
          </p>
        )}
      </div>

      {confirm && (
        <div role="alertdialog" className="rounded-2xl border-2 border-primary bg-card p-4">
          <p className="text-sm font-semibold">
            {tr(
              `Bu adım yaklaşık ${confirm.credits} Runway kredisi harcayacak.`,
              `This step will spend about ${confirm.credits} Runway credits.`,
            )}
            {ov.creditBalance !== null &&
              tr(` Bakiye: ${ov.creditBalance}.`, ` Balance: ${ov.creditBalance}.`)}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              disabled={busy}
              onClick={() => void start()}
              className="rounded-full bg-neon px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              {tr("Onayla ve başlat", "Confirm and start")}
            </button>
            <button
              onClick={() => setConfirm(null)}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold"
            >
              {tr("Vazgeç", "Cancel")}
            </button>
          </div>
        </div>
      )}

      <section className="rounded-2xl border bg-card p-4">
        <h3 className="flex items-center gap-2 font-bold">
          <CloudUpload className="h-4 w-4" /> {tr("0. Başrol fotoğrafı", "0. Lead photo")}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {tr(
            "AyShe'nin yüzü bu fotoğraftan alınır. Yüzün net ve önden göründüğü, iyi ışıklı bir fotoğraf seçin.",
            "AyShe's face comes from this photo. Choose a sharp, well-lit, front-facing photo.",
          )}
        </p>
        <div className="mt-3 flex items-center gap-3">
          {refUrl ? (
            <img src={refUrl} alt="" className="h-20 w-20 rounded-xl object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-xl bg-secondary">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <button
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold"
          >
            {ov.hasReference ? tr("Değiştir", "Replace") : tr("Fotoğraf yükle", "Upload photo")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void uploadReference(f);
            }}
          />
        </div>
      </section>

      {renderStep({
        name: "keyframes",
        icon: <ImageIcon className="h-4 w-4" />,
        title: tr("1. Başlangıç kareleri", "1. Keyframes"),
        desc: tr(
          "Her sahnenin görseli yüzünüz referans alınarak üretilir. Birleştirmede kamera hareketiyle canlanır. Beğenmediğiniz kareyi yeniden üretebilir, istediğinizi gerçek videoya çevirebilirsiniz.",
          "Each scene's image uses your face as reference and comes alive with camera motion when assembled. Regenerate any frame, or turn selected ones into real video.",
        ),
        disabled: !ov.hasReference
          ? tr("Önce başrol fotoğrafını yükleyin.", "Upload the lead photo first.")
          : undefined,
        children: (
          <>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label={tr("Görsel kalitesi", "Image quality")}
            >
              {(
                [
                  ["economy", tr("Ekonomik · 2-5 kredi/kare", "Economy · 2-5 credits/frame")],
                  ["high", tr("Yüksek · 8 kredi/kare", "High · 8 credits/frame")],
                ] as const
              ).map(([q, label]) => (
                <button
                  key={q}
                  role="radio"
                  aria-checked={quality === q}
                  onClick={() => setQuality(q)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${quality === q ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Thumbs
              jobs={jobsOf("keyframe")}
              clips={ov.clips}
              kind="image"
              onRetry={retry}
              onAnimate={(key) => void ask("clips", [key])}
              animated={animated}
            />
          </>
        ),
      })}

      {renderStep({
        name: "clips",
        icon: <Film className="h-4 w-4" />,
        title: tr("2. Gerçek video (isteğe bağlı)", "2. Real video (optional)"),
        desc: tr(
          "Gerekli değil: Videosu olmayan sahneler kamera hareketiyle canlanır. Önemli anları karelerdeki film düğmesiyle tek tek videoya çevirebilirsiniz (saniyesi 5 kredi).",
          "Optional: scenes without video come alive with camera motion. Turn key moments into video one by one with the film button on a frame (5 credits per second).",
        ),
        disabled:
          step("keyframes").succeeded === 0
            ? tr("Önce kareleri üretin.", "Generate keyframes first.")
            : undefined,
        children: (
          <>
            <Thumbs jobs={jobsOf("clip")} clips={ov.clips} kind="video" onRetry={retry} />
          </>
        ),
      })}

      {renderStep({
        name: "voices",
        icon: <Mic className="h-4 w-4" />,
        title: tr("3. Seslendirme (8 dil)", "3. Voice-over (8 languages)"),
        desc: tr(
          "Her karakter tüm dillerde aynı sesle konuşur. Sesleri dev.runwayml.com'da dinleyip seçebilirsiniz.",
          "Each character keeps the same voice in every language. Preview voices on dev.runwayml.com.",
        ),
        disabled: undefined,
        children: (
          <>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.entries(ov.speakers).map(([id, sp]) => (
                <label key={id} className="flex items-center justify-between gap-2 text-sm">
                  <span>{sp.name}</span>
                  <select
                    value={voices[id] ?? sp.defaultVoice}
                    onChange={(e) => setVoices({ ...voices, [id]: e.target.value })}
                    className="rounded-xl border bg-background px-2 py-1 text-sm"
                  >
                    {ov.voicePresets.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
              ))}
              <label className="flex items-center justify-between gap-2 text-sm">
                <span>{tr("Model", "Model")}</span>
                <select
                  value={ttsModel}
                  onChange={(e) => setTtsModel(e.target.value)}
                  className="rounded-xl border bg-background px-2 py-1 text-sm"
                >
                  {ov.ttsModels.map((m) => (
                    <option key={m} value={m}>
                      {m === "eleven_v3" ? tr("eleven_v3 (duygulu)", "eleven_v3 (expressive)") : m}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ov.langs.map((l) => {
                const n = jobsOf("voice").filter(
                  (j) => j.lang === l && j.status === "SUCCEEDED",
                ).length;
                const on = langs.includes(l);
                return (
                  <button
                    key={l}
                    onClick={() => setLangs(on ? langs.filter((x) => x !== l) : [...langs, l])}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${on ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}
                  >
                    {n === ov.lines.length && <Check className="mr-1 inline h-3 w-3" />}
                    {LANG_LABEL[l] ?? l} {n}/{ov.lines.length}
                  </button>
                );
              })}
            </div>
            <VoicePreview jobs={jobsOf("voice")} lines={ov.lines} langs={ov.langs} />
          </>
        ),
      })}

      <section className="rounded-2xl border bg-card p-4">
        <h3 className="flex items-center gap-2 font-bold">
          <Combine className="h-4 w-4" /> {tr("4. Birleştir ve yayınla", "4. Assemble and publish")}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {tr(
            "Klipler tek videoda, replikler her dil için ayrı ses parçasında birleştirilir; altyazılar otomatik oluşur ve bölüm uygulamada izlenebilir olur.",
            "Clips are joined into one video, lines into one audio track per language; subtitles are generated and the episode goes live in the app.",
          )}
        </p>
        {allFrames && anyVoiceLang ? (
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            <li>
              <a
                href={ASSEMBLE_URL}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary underline"
              >
                {tr("GitHub'da birleştirme sayfasını açın", "Open the assemble page on GitHub")}
              </a>
            </li>
            <li>
              {tr(
                'Sağdaki "Run workflow" → yeşil "Run workflow" düğmesine basın.',
                'Click "Run workflow" → the green "Run workflow" button.',
              )}
            </li>
            <li>
              {tr(
                "Yaklaşık 5 dakika sonra bölüm uygulamada izlenebilir.",
                "In about 5 minutes the episode is watchable in the app.",
              )}
            </li>
          </ol>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            {tr(
              "Tüm kareler ve en az bir dilin sesleri hazır olunca açılır.",
              "Available once all frames and at least one language's voices are ready.",
            )}
          </p>
        )}
      </section>

      {failed.length > 0 && (
        <section className="rounded-2xl border border-destructive/40 bg-card p-4">
          <h3 className="flex items-center gap-2 font-bold text-destructive">
            <CircleAlert className="h-4 w-4" /> {tr("Başarısız işler", "Failed jobs")}
          </h3>
          <ul className="mt-2 space-y-2 text-xs">
            {failed.map((j) => (
              <li key={j.id} className="flex items-start justify-between gap-2">
                <span>
                  <b>{j.item_key}</b> — {j.failure}
                </span>
                <button
                  onClick={() => void retry(j)}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-semibold"
                >
                  <RotateCcw className="h-3 w-3" />
                  {j.credits}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Thumbs({
  jobs,
  clips,
  kind,
  onRetry,
  onAnimate,
  animated,
}: {
  jobs: Job[];
  clips: Overview["clips"];
  kind: "image" | "video";
  onRetry: (j: Job) => void;
  onAnimate?: (key: string) => void;
  animated?: Set<string>;
}) {
  if (!jobs.length) return null;
  return (
    <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
      {clips.map((c) => {
        const j = jobs.find((x) => x.item_key === c.key);
        return (
          <div
            key={c.key}
            className="relative aspect-video overflow-hidden rounded-lg bg-secondary text-[10px]"
          >
            {j?.url && kind === "image" && (
              <img src={j.url} alt={c.key} className="h-full w-full object-cover" />
            )}
            {j?.url && kind === "video" && (
              <video
                src={j.url}
                muted
                loop
                playsInline
                onMouseEnter={(e) => void e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
                controls
                className="h-full w-full object-cover"
              />
            )}
            {j && ACTIVE.includes(j.status) && (
              <div className="absolute inset-0 grid place-items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            <span className="absolute left-1 top-1 rounded bg-background/80 px-1">{c.key}</span>
            {j?.status === "SUCCEEDED" && (
              <button
                title="Yeniden üret"
                onClick={() => onRetry(j)}
                className="absolute right-1 top-1 rounded bg-background/80 p-0.5"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
            {onAnimate && j?.status === "SUCCEEDED" && !animated?.has(c.key) && (
              <button
                title={`Videoya çevir (${c.duration * 5} kredi)`}
                aria-label={`${c.key} videoya çevir`}
                onClick={() => onAnimate(c.key)}
                className="absolute bottom-1 right-1 rounded bg-background/80 p-0.5"
              >
                <Film className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function VoicePreview({
  jobs,
  lines,
  langs,
}: {
  jobs: Job[];
  lines: Overview["lines"];
  langs: string[];
}) {
  const [lang, setLang] = useState("tr");
  const own = jobs.filter((j) => j.lang === lang && j.url);
  if (!jobs.some((j) => j.url)) return null;
  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-xs font-semibold">Sesleri dinle</summary>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="mt-2 rounded-xl border bg-background px-2 py-1 text-xs"
      >
        {langs.map((l) => (
          <option key={l} value={l}>
            {LANG_LABEL[l] ?? l}
          </option>
        ))}
      </select>
      <ul className="mt-2 space-y-1.5">
        {lines.map((l) => {
          const j = own.find((x) => x.item_key === `${lang}:${l.key}`);
          return (
            <li key={l.key} className="text-xs">
              <span className="text-muted-foreground">{l.key}</span> {l.text}
              {j?.url && <audio src={j.url} controls preload="none" className="mt-1 h-8 w-full" />}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
