import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { CloudUpload as UploadCloud, Check, Trash2, Plus, Film, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { episodeListQuery, seriesListQuery, type EpisodeRow, type SeriesRow } from "@/lib/catalog";
import { useAppState } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/yonetim")({
  loader: ({ context }) => context.queryClient.ensureQueryData(seriesListQuery),
  head: () => ({
    meta: [
      { title: "İçerik Yönetimi — AI Multiverse Cinema" },
      { name: "description", content: "Dizi, bölüm, video ve dil dosyalarını yönet." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

/** Videonun süresini (saniye) dosyadan okur. */
function readDuration(file: File): Promise<number | null> {
  return new Promise((res) => {
    const v = document.createElement("video");
    const url = URL.createObjectURL(file);
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      res(Number.isFinite(v.duration) ? Math.round(v.duration) : null);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      res(null);
    };
    v.src = url;
  });
}

function FileButton({ label, onFile, accept }: { label: string; onFile: (f: File) => void; accept: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button onClick={() => ref.current?.click()} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
        <UploadCloud className="h-3.5 w-3.5" /> {label}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) onFile(f);
        }}
      />
    </>
  );
}

function Episodes({ s }: { s: SeriesRow }) {
  const { data: eps } = useSuspenseQuery(episodeListQuery(s.id));
  const qc = useQueryClient();
  const { t } = useT();

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["episodes", s.id] });
    qc.invalidateQueries({ queryKey: ["series"] });
  };

  const uploadVideo = async (e: EpisodeRow, file: File) => {
    const path = `${s.slug}/e${e.n}.mp4`;
    const { error } = await supabase.storage.from("videos").upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      toast.error(error.message);
      return;
    }
    const dur = await readDuration(file);
    const { error: ue } = await supabase
      .from("episodes")
      .update({ video_url: path, status: "ready", duration_sec: dur })
      .eq("id", e.id);
    if (ue) {
      toast.error(ue.message);
      return;
    }
    toast.success(t("saved"));
    refresh();
  };

  const setStatus = async (e: EpisodeRow, status: "ready" | "draft") => {
    const { error } = await supabase.from("episodes").update({ status }).eq("id", e.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("saved"));
    refresh();
  };

  const uploadTrack = async (e: EpisodeRow, kind: "audio" | "subs", lang: string, file: File) => {
    const path = `${s.slug}/e${e.n}.${kind}.${lang}.${file.name.split(".").pop() || "bin"}`;
    const { error } = await supabase.storage.from("videos").upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      toast.error(error.message);
      return;
    }
    const { error: te } = await supabase
      .from("tracks")
      .upsert({ episode_id: e.id, kind, lang, status: "ready", url: path }, { onConflict: "episode_id,kind,lang" });
    if (te) {
      toast.error(te.message);
      return;
    }
    toast.success(t("saved"));
    refresh();
  };

  return (
    <ul className="mt-4 space-y-3">
      {eps.map((e) => (
        <li key={e.id} className="rounded-2xl bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {t("episode")} {e.n}
                {e.titles.find((x) => x.lang === "tr") ? `: ${e.titles.find((x) => x.lang === "tr")!.title}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {e.video_url ? e.video_url : t("no_video_yet")} {e.duration_sec ? `· ${e.duration_sec} sn` : ""}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${e.status === "ready" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {e.status === "ready" ? t("status_ready") : t("status_draft")}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <FileButton label={t("video_file")} accept="video/*" onFile={(f) => void uploadVideo(e, f)} />
            {e.status === "ready" ? (
              <button onClick={() => void setStatus(e, "draft")} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
                {t("mark_draft")}
              </button>
            ) : (
              e.video_url && (
                <button onClick={() => void setStatus(e, "ready")} className="flex items-center gap-1 rounded-full bg-neon px-3 py-1.5 text-xs font-bold text-primary-foreground">
                  <Check className="h-3.5 w-3.5" /> {t("mark_ready")}
                </button>
              )
            )}
            <FileButton label={`${t("audio_track")} · TR`} accept="audio/*" onFile={(f) => void uploadTrack(e, "audio", "tr", f)} />
            <FileButton label={`${t("sub_track")} · TR`} accept=".vtt,.srt" onFile={(f) => void uploadTrack(e, "subs", "tr", f)} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function SeriesAdmin({ s }: { s: SeriesRow }) {
  const { t } = useT();
  const qc = useQueryClient();
  const [title, setTitle] = useState(s.title);

  const saveTitle = async () => {
    const { error } = await supabase.from("series").update({ title }).eq("id", s.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("saved"));
    qc.invalidateQueries({ queryKey: ["series"] });
  };

  const setStatus = async (status: "draft" | "published") => {
    const { error } = await supabase.from("series").update({ status }).eq("id", s.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("saved"));
    qc.invalidateQueries({ queryKey: ["series"] });
  };

  const uploadPoster = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${s.slug}.${ext}`;
    const { error } = await supabase.storage.from("posters").upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      toast.error(error.message);
      return;
    }
    const { error: se } = await supabase.from("series").update({ poster_url: path }).eq("id", s.id);
    if (se) {
      toast.error(se.message);
      return;
    }
    toast.success(t("saved"));
    qc.invalidateQueries({ queryKey: ["series"] });
  };

  return (
    <li className="rounded-2xl bg-card p-4">
      <div className="flex items-center gap-3">
        <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {s.slug} · {t(`cat_${s.category}`)} · {s.status === "published" ? t("status_ready") : t("status_draft")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={saveTitle} className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
          {t("save")}
        </button>
        <FileButton label={t("poster_file")} accept="image/*" onFile={(f) => void uploadPoster(f)} />
        <button onClick={() => void setStatus(s.status === "published" ? "draft" : "published")} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
          {s.status === "published" ? t("mark_draft") : t("mark_ready")}
        </button>
      </div>
    </li>
  );
}

function Users() {
  const { t } = useT();
  const qc = useQueryClient();
  const [rows, setRows] = useState<{ user_id: string; email: string | null; display_name: string; tokens: number }[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("profiles").select("user_id,email,display_name,tokens").order("tokens", { ascending: false }).limit(100);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((data ?? []) as typeof rows);
    setLoaded(true);
  };

  const addTokens = async (user_id: string, n: number) => {
    const row = rows.find((r) => r.user_id === user_id);
    if (!row) return;
    const { error } = await supabase.from("profiles").update({ tokens: row.tokens + n }).eq("user_id", user_id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("added_tokens", { n }));
    qc.invalidateQueries({ queryKey: ["profile"] });
    void load();
  };

  return (
    <div className="mt-4">
      {!loaded && (
        <button onClick={load} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          {t("users_tab")}
        </button>
      )}
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.user_id} className="flex items-center justify-between gap-3 rounded-2xl bg-card p-4 text-sm">
            <div className="min-w-0">
              <p className="truncate font-semibold">{r.email || r.display_name || r.user_id}</p>
              <p className="text-xs text-muted-foreground">{r.tokens} jeton</p>
            </div>
            <button onClick={() => void addTokens(r.user_id, 50)} className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5" /> 50
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminBody() {
  const { data: all } = useSuspenseQuery(seriesListQuery);
  const { t } = useT();
  const [tab, setTab] = useState<"series" | "episodes" | "users">("series");
  const [pick, setPick] = useState(all[0]?.id ?? "");
  const s = all.find((x) => x.id === pick) ?? all[0];

  return (
    <div className="px-5 pt-6">
      <h1 className="flex items-center gap-2 text-xl font-bold">
        <Film className="h-5 w-5 text-neon" /> {t("admin_title")}
      </h1>

      <div className="mt-4 flex gap-2">
        {(["series", "episodes", "users"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? "bg-neon text-primary-foreground shadow-neon" : "bg-secondary text-muted-foreground"}`}
          >
            {t(`${k}_tab`)}
          </button>
        ))}
      </div>

      {tab === "series" && (
        <ul className="mt-4 space-y-3">
          {all.map((x) => (
            <SeriesAdmin key={x.id} s={x} />
          ))}
        </ul>
      )}

      {tab === "episodes" && s && (
        <div className="mt-4">
          <select
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className="w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          >
            {all.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title}
              </option>
            ))}
          </select>
          <Episodes key={s.id} s={s} />
        </div>
      )}

      {tab === "users" && <Users />}
    </div>
  );
}

function Admin() {
  const { user, isAdmin, ready } = useAppState();
  const { t } = useT();

  if (!ready) return <AppShell><p className="px-5 pt-10 text-sm text-muted-foreground">{t("loading")}</p></AppShell>;
  if (!user)
    return (
      <AppShell>
        <div className="px-5 pt-10">
          <p className="text-sm text-muted-foreground">{t("admin_no")}</p>
          <a href="/giris" className="mt-4 inline-block rounded-full bg-neon px-5 py-2.5 text-sm font-bold text-primary-foreground">
            {t("sign_in")}
          </a>
        </div>
      </AppShell>
    );
  if (!isAdmin)
    return (
      <AppShell>
        <div className="px-5 pt-10">
          <p className="text-sm text-muted-foreground">{t("admin_no")}</p>
          <a href="/" className="mt-4 inline-block rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold">
            {t("nav_home")}
          </a>
        </div>
      </AppShell>
    );

  return (
    <AppShell>
      <AdminBody />
    </AppShell>
  );
}
