import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, Play, Coins, Info, Film } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TokenBadge } from "@/components/AppShell";
import { episodeListQuery, seriesListQuery, seriesTextOf, trackStatus, episodeTitle, type SeriesRow } from "@/lib/catalog";
import { FREE_EPISODES, EPISODE_COST } from "@/lib/data";
import { BUNDLED_POSTERS } from "@/lib/posters";
import { useAppState } from "@/lib/store";
import { useT, LANG_NAMES } from "@/lib/i18n";

export const Route = createFileRoute("/dizi/$slug")({
  loader: async ({ context, params }) => {
    const list = await context.queryClient.ensureQueryData(seriesListQuery);
    const s = list.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    await context.queryClient.ensureQueryData(episodeListQuery(s.id, s.slug));
    return { id: s.id, slug: s.slug };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.slug} — AI Multiverse Cinema` },
          { property: "og:title", content: loaderData.slug },
          { property: "og:type", content: "video.tv_show" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Dizi bulunamadı" }, { name: "robots", content: "noindex" }],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(seriesListQuery);
  const { data: eps } = useSuspenseQuery(episodeListQuery(id, slug));
  const { state, unlockEpisode, user } = useAppState();
  const { t, lang } = useT();
  const nav = useNavigate();
  const s = all.find((x) => x.id === id) as SeriesRow;
  const tx = seriesTextOf(s, lang);
  const poster = BUNDLED_POSTERS[s.slug];
  const st = (v: string) => t(v === "ready" ? "st_ready" : v === "planned" ? "st_planned" : "st_none");
  const audioSt = trackStatus(eps[0] ?? { tracks: [], titles: [] } as never, "audio", state.audioLang);
  const subSt = trackStatus(eps[0] ?? ({ tracks: [], titles: [] } as never), "subs", state.subLang);
  const anyReady = eps.some((e) => e.status === "ready" && e.video_url);

  const open = async (n: number, episodeId: string, ready: boolean) => {
    if (!ready) {
      toast.info(t("draft_ep_note"));
      return;
    }
    if (n > FREE_EPISODES && !state.unlocked.includes(episodeId)) {
      if (!user) {
        toast.error(t("auth_title"));
        return nav({ to: "/giris" });
      }
      if (state.tokens < EPISODE_COST) {
        toast.error(t("not_enough"));
        return nav({ to: "/jeton" });
      }
      const err = await unlockEpisode(episodeId, EPISODE_COST);
      if (err) {
        toast.error(err);
        return;
      }
      toast.success(t("unlocked", { n }));
    }
    nav({ to: "/izle/$slug/$n", params: { slug: s.slug, n: String(n) } });
  };

  return (
    <AppShell>
      <div className="relative">
        {poster ? (
          <img src={poster} alt={s.title} width={768} height={1152} className="aspect-[4/5] w-full object-cover" />
        ) : (
          <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-primary/30 via-card to-accent/20" />
        )}
        <div className="absolute inset-0 bg-fade" />
        <div className="absolute inset-x-0 top-0 flex justify-between p-5">
          <Link to="/" className="rounded-full glass p-2" aria-label={t("back")}>
            <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
          <TokenBadge />
        </div>
      </div>

      <div className="relative -mt-20 px-5">
        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-accent-foreground">{t(`cat_${s.category}`)}</span>
        <h1 className="mt-3 text-2xl font-bold">{s.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tx.description}</p>

        <section className="mt-6 rounded-2xl bg-card p-4 text-sm">
          <h2 className="font-bold">{t("lang_box")}</h2>
          <p className="mt-2 flex justify-between">
            <span>{t("audio")}: {LANG_NAMES[state.audioLang]}</span>
            <span className="text-muted-foreground">{st(audioSt)}</span>
          </p>
          {state.subLang !== "off" && (
            <p className="mt-1 flex justify-between">
              <span>{t("subtitles")}: {LANG_NAMES[state.subLang]}</span>
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
            <p className="mt-3 text-xs text-muted-foreground">{t("dub_missing", { lang: LANG_NAMES[state.audioLang] })}</p>
          )}
          {anyReady && subSt !== "ready" && state.subLang !== "off" && (
            <p className="mt-1 text-xs text-muted-foreground">{t("sub_missing", { lang: LANG_NAMES[state.subLang] })}</p>
          )}
        </section>

        <h2 className="mt-7 text-sm font-bold">{t("episodes")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("free_ep", { n: FREE_EPISODES })}</p>
        <ul className="mt-3 space-y-2">
          {eps.map((e) => {
            const ready = e.status === "ready" && !!e.video_url;
            const unlocked = e.n <= FREE_EPISODES || state.unlocked.includes(e.id);
            const title = episodeTitle(e, lang);
            return (
              <li key={e.id}>
                <button onClick={() => open(e.n, e.id, ready)} className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-start">
                  <span className={`grid h-10 w-10 place-items-center rounded-full ${unlocked && ready ? "bg-neon text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {ready ? (unlocked ? <Play className="h-4 w-4 fill-current" /> : <Lock className="h-4 w-4" />) : <Film className="h-4 w-4" />}
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
                  {!unlocked && ready && (
                    <span className="flex items-center gap-1 text-xs font-bold text-gold">
                      <Coins className="h-3.5 w-3.5" />
                      {EPISODE_COST}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <Link to="/jeton" className="mt-5 block rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
          {t("buy_q")} <span className="font-bold text-primary">{t("buy_cta")}</span>
        </Link>
      </div>
    </AppShell>
  );
}
