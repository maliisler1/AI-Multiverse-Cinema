import { Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Lock,
  Play,
  Info,
  Film,
  ListVideo,
  Crown,
  Tv,
  Download,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, TokenBadge } from "@/components/AppShell";
import {
  episodeListQuery,
  seriesListQuery,
  seriesTextOf,
  trackStatus,
  episodeTitle,
  signedUrl,
  type EpisodeRow,
  type SeriesRow,
} from "@/lib/catalog";
import { FREE_EPISODES } from "@/lib/data";
import { ads } from "@/lib/ads";
import { offline, useOffline } from "@/lib/offline";
import { BUNDLED_POSTERS } from "@/lib/posters";
import { useAppState } from "@/lib/store";
import { useT, LANG_NAMES } from "@/lib/i18n";

/** Bir dizinin afişi, açıklaması, dil durumu ve bölüm listesi. Ana sayfa ve dizi sayfası paylaşır. */
export function SeriesView({
  id,
  slug,
  home = false,
  children,
}: {
  id: string;
  slug: string;
  home?: boolean;
  children?: ReactNode;
}) {
  const { data: all } = useSuspenseQuery(seriesListQuery);
  const { data: eps } = useSuspenseQuery(episodeListQuery(id, slug));
  const { state, unlockEpisode } = useAppState();
  const saved = useOffline();
  const [locked, setLocked] = useState<{ n: number; id: string } | null>(null);
  const [adBusy, setAdBusy] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { t, lang } = useT();
  const nav = useNavigate();
  const s = all.find((x) => x.id === id) as SeriesRow;
  const tx = seriesTextOf(s, lang);
  const poster = BUNDLED_POSTERS[s.slug];
  const st = (v: string) =>
    t(v === "ready" ? "st_ready" : v === "planned" ? "st_planned" : "st_none");
  const audioSt = trackStatus(
    eps[0] ?? ({ tracks: [], titles: [] } as never),
    "audio",
    state.audioLang,
  );
  const subSt = trackStatus(eps[0] ?? ({ tracks: [], titles: [] } as never), "subs", state.subLang);
  const first = eps[0];
  const anyReady = eps.some((e) => e.status === "ready" && e.video_url);

  const owned = state.seasonOwned;
  const hasAccess = (n: number, episodeId: string) =>
    owned || n <= FREE_EPISODES || state.unlocked.includes(episodeId);

  const open = async (n: number, episodeId: string, ready: boolean) => {
    if (!ready) {
      toast.info(t("draft_ep_note"));
      return;
    }
    if (!hasAccess(n, episodeId)) {
      // Kilitli bölüm: reklam izleyerek aç ya da sezonu satın al.
      setLocked({ n, id: episodeId });
      return;
    }
    nav({ to: "/izle/$slug/$n", params: { slug: s.slug, n: String(n) } });
  };

  const unlockWithAd = async () => {
    if (!locked || adBusy) return;
    setAdBusy(true);
    const result = await ads.showRewarded();
    setAdBusy(false);
    if (result === "unavailable") return void toast.error(t("ad_unavailable"));
    if (result === "dismissed") return void toast.info(t("ad_not_done"));
    const err = await unlockEpisode(locked.id, 0);
    if (err) return void toast.error(err);
    toast.success(t("ad_unlocked", { n: locked.n }));
    const n = locked.n;
    setLocked(null);
    nav({ to: "/izle/$slug/$n", params: { slug: s.slug, n: String(n) } });
  };

  const download = async (e: EpisodeRow) => {
    if (downloading) return;
    setDownloading(e.id);
    try {
      const url = await signedUrl("videos", e.video_url);
      if (!url) throw new Error("no video");
      const pick = (l: string) =>
        e.tracks.find((x) => x.kind === "audio" && x.lang === l && x.status === "ready" && x.url);
      const dub = pick(state.audioLang) ?? pick("tr");
      const audioUrl = dub ? await signedUrl("videos", dub.url) : null;
      await offline.download(
        e.id,
        url,
        audioUrl && dub ? { url: audioUrl, lang: dub.lang } : undefined,
      );
      toast.success(t("download_done", { n: e.n }));
    } catch {
      toast.error(t("download_err"));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <AppShell>
      <div className="relative">
        {poster ? (
          <img
            src={poster}
            alt={s.title}
            width={768}
            height={1152}
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-primary/30 via-card to-accent/20" />
        )}
        <div className="absolute inset-0 bg-fade" />
        <div className="absolute inset-x-0 top-0 flex justify-between p-5">
          {home ? (
            <span className="rounded-full glass px-3 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-neon">
              The Human Code
            </span>
          ) : (
            <Link to="/" className="rounded-full glass p-2" aria-label={t("back")}>
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          )}
          <TokenBadge />
        </div>
      </div>

      <div className="relative -mt-20 px-5">
        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-accent-foreground">
          {t(`cat_${s.category}`)}
        </span>
        <h1 className="mt-3 text-2xl font-bold">{s.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tx.description}</p>
        {first && (
          <button
            onClick={() => open(first.n, first.id, first.status === "ready" && !!first.video_url)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon py-3 text-sm font-bold text-primary-foreground shadow-neon"
          >
            <Play className="h-4 w-4 fill-current" /> {t("watch_ep1")}
          </button>
        )}
        {first && eps.length > 1 && (
          <button
            onClick={() => {
              // Tüm sezon: otomatik geçişi açar, bölümler art arda oynar (kilitli bölümde durur).
              try {
                localStorage.setItem("amc-autoplay", "true");
              } catch {
                /* depolama kapalı olabilir */
              }
              void open(first.n, first.id, first.status === "ready" && !!first.video_url);
            }}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold"
          >
            <ListVideo className="h-4 w-4" /> {t("watch_season")}
          </button>
        )}

        <section className="mt-6 rounded-2xl bg-card p-4 text-sm">
          <h2 className="font-bold">{t("lang_box")}</h2>
          <p className="mt-2 flex justify-between">
            <span>
              {t("audio")}: {LANG_NAMES[state.audioLang]}
            </span>
            <span className="text-muted-foreground">{st(audioSt)}</span>
          </p>
          {state.subLang !== "off" && (
            <p className="mt-1 flex justify-between">
              <span>
                {t("subtitles")}: {LANG_NAMES[state.subLang]}
              </span>
              <span className="text-muted-foreground">{st(subSt)}</span>
            </p>
          )}
          {!anyReady && (
            <p className="mt-3 flex gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0" />
              {t("no_video")}
            </p>
          )}
          {anyReady && audioSt !== "ready" && (
            <p className="mt-3 text-xs text-muted-foreground">
              {t("dub_missing", { lang: LANG_NAMES[state.audioLang] })}
            </p>
          )}
          {anyReady && subSt !== "ready" && state.subLang !== "off" && (
            <p className="mt-1 text-xs text-muted-foreground">
              {t("sub_missing", { lang: LANG_NAMES[state.subLang] })}
            </p>
          )}
        </section>

        <h2 className="mt-7 text-sm font-bold">{t("episodes")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("free_ep", { n: FREE_EPISODES })}</p>
        <ul className="mt-3 space-y-2">
          {eps.map((e) => {
            const ready = e.status === "ready" && !!e.video_url;
            const unlocked = hasAccess(e.n, e.id);
            const isSaved = !!saved[e.id];
            const title = episodeTitle(e, lang);
            return (
              <li key={e.id}>
                <button
                  onClick={() => open(e.n, e.id, ready)}
                  className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-start"
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full ${unlocked && ready ? "bg-neon text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                  >
                    {ready ? (
                      unlocked ? (
                        <Play className="h-4 w-4 fill-current" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )
                    ) : (
                      <Film className="h-4 w-4" />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">
                      {t("episode")} {e.n}
                      {title ? `: ${title}` : ""}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {e.minutes} {t("min")} · {ready ? t("status_ready") : t("status_draft")}
                    </span>
                  </span>
                  {!unlocked && ready && <Lock className="h-4 w-4 text-gold" />}
                </button>
                {owned && ready && offline.supported() && (
                  <button
                    onClick={() => (isSaved ? void offline.remove(e.id) : void download(e))}
                    disabled={downloading !== null && downloading !== e.id}
                    className="mt-1 flex w-full items-center justify-end gap-1.5 px-4 text-xs font-semibold text-muted-foreground disabled:opacity-50"
                  >
                    {isSaved ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    {downloading === e.id
                      ? t("downloading")
                      : isSaved
                        ? `${t("downloaded")} · ${t("remove_download")}`
                        : t("download")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {!owned && (
          <Link
            to="/jeton"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-center text-sm"
          >
            <Crown className="h-4 w-4 text-gold" />
            <span className="font-bold text-primary">{t("season_title")}</span>
            <span className="text-muted-foreground">
              · {t("season_perk2")}, {t("season_perk3").toLowerCase()}
            </span>
          </Link>
        )}
        {children}
      </div>
      {locked && (
        <div
          className="fixed inset-0 z-[60] grid place-items-end bg-background/70 p-4 backdrop-blur-sm"
          onClick={() => setLocked(null)}
        >
          <div
            className="mx-auto w-full max-w-md rounded-3xl border bg-card p-6"
            onClick={(ev) => ev.stopPropagation()}
          >
            <Lock className="h-6 w-6 text-gold" />
            <h2 className="mt-3 text-lg font-bold">{t("locked_title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("episode")} {locked.n}
            </p>
            {ads.canReward() && (
              <button
                onClick={() => void unlockWithAd()}
                disabled={adBusy}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold disabled:opacity-60"
              >
                <Tv className="h-4 w-4" /> {adBusy ? "…" : t("watch_ad")}
              </button>
            )}
            <Link
              to="/jeton"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neon py-3 text-sm font-bold text-primary-foreground shadow-neon"
            >
              <Crown className="h-4 w-4" /> {t("season_title")}
            </Link>
          </div>
        </div>
      )}
    </AppShell>
  );
}
