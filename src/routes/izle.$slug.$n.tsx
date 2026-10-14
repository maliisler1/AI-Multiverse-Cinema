import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { episodeListQuery, seriesListQuery, signedUrl, trackStatus, episodeTitle } from "@/lib/catalog";
import { FREE_EPISODES } from "@/lib/data";
import { useAppState } from "@/lib/store";
import { useT, LANG_NAMES } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { canPlay, hasEpisodeAccess, nextPlayable } from "@/lib/playback";
import { ads } from "@/lib/ads";

export const Route = createFileRoute("/izle/$slug/$n")({
  loader: async ({ context, params }) => {
    const list = await context.queryClient.ensureQueryData(seriesListQuery);
    const s = list.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    await context.queryClient.ensureQueryData(episodeListQuery(s.id));
    return { id: s.id, slug: s.slug, n: Number(params.n) };
  },
  component: Player,
});

export function Player() {
  const { id, slug, n } = Route.useLoaderData();
  const { data: eps } = useSuspenseQuery(episodeListQuery(id));
  const { state, user, update } = useAppState();
  const { t, lang } = useT();
  const nav = useNavigate();
  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [subSrc, setSubSrc] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem("amc-autoplay") !== "false");
  const [countdown, setCountdown] = useState<number | null>(null);
  const ep = eps.find((e) => e.n === n);
  const next = nextPlayable(eps, n);
  const allowed = !!ep && hasEpisodeAccess(ep, state.unlocked, FREE_EPISODES);
  const completed = useRef(false);
  const seek = useRef(0);
  const updateRef = useRef(update);
  updateRef.current = update;
  const tr = (a: string, b: string) => lang === "tr" ? a : b;

  useEffect(() => {
    let live = true;
    let subBlob: string | null = null;
    let timer: ReturnType<typeof setTimeout>;
    setSrc(null); setSubSrc(null); setAudioSrc(null); setFailed(false); setCountdown(null);
    completed.current = false;
    seek.current = ep ? state.resume[ep.id] ?? 0 : 0;
    if (!canPlay(ep) || !allowed) return;
    const current = ep;
    const load = async () => {
      try {
        const url = await signedUrl("videos", current.video_url);
        if (!url) throw new Error("video unavailable");
        if (!live) return;
        setSrc(url);
        const dub = current.tracks.find(x => x.kind === "audio" && x.lang === state.audioLang && x.status === "ready" && x.url);
        if (dub) {
          const au = await signedUrl("videos", dub.url);
          if (live) setAudioSrc(au);
        }
        const sub = current.tracks.find(x => x.kind === "subs" && x.lang === state.subLang && x.status === "ready" && x.url);
        if (sub) {
          const su = await signedUrl("videos", sub.url);
          if (su) {
            const r = await fetch(su);
            if (!r.ok) throw new Error("subtitle unavailable");
            subBlob = URL.createObjectURL(new Blob([await r.text()], {type:"text/vtt"}));
            if (live) setSubSrc(subBlob); else URL.revokeObjectURL(subBlob);
          }
        }
      } catch { if (live) setFailed(true); }
    };
    timer = setTimeout(() => { if (live && !video.current?.readyState) setFailed(true); }, 20000);
    void load();
    return () => { live = false; clearTimeout(timer); if (subBlob) URL.revokeObjectURL(subBlob); };
  }, [ep?.id, allowed, retry, state.audioLang, state.subLang]);

  useEffect(() => {
    let live = true;
    if (!ep || !user || !allowed) return;
    void supabase.from("user_progress").select("position_sec, completed").eq("user_id", user.id).eq("episode_id", ep.id).maybeSingle().then(({data}) => {
      if (live && data && !data.completed && data.position_sec > 5) {
        seek.current = data.position_sec;
        const v = video.current;
        if (v && v.readyState && v.currentTime < 1 && v.duration > seek.current) v.currentTime = seek.current;
      }
    });
    return () => { live = false; };
  }, [ep?.id, user?.id, allowed]);

  const save = (done = false) => {
    const v = video.current;
    if (!v || !ep || !allowed || (v.currentTime < 1 && !done)) return;
    if (done) completed.current = true;
    const position = completed.current ? 0 : Math.floor(v.currentTime);
    updateRef.current(s => ({...s, lastWatched:{slug,n}, resume:{...s.resume,[ep.id]:position}}));
    if (user) void supabase.from("user_progress").upsert({user_id:user.id,episode_id:ep.id,position_sec:Math.floor(v.currentTime),completed:completed.current},{onConflict:"user_id,episode_id"});
  };
  const saveRef = useRef(save); saveRef.current = save;
  useEffect(() => {
    const timer = setInterval(() => saveRef.current(), 5000);
    const hide = () => { if (document.visibilityState === "hidden") saveRef.current(); };
    document.addEventListener("visibilitychange", hide);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", hide); saveRef.current(); };
  }, [ep?.id]);

  const goNext = () => {
    setCountdown(null);
    if (!next) return;
    if (!hasEpisodeAccess(next, state.unlocked, FREE_EPISODES)) {
      toast.info(t("locked_ep"));
      void nav({to:"/dizi/$slug",params:{slug}});
      return;
    }
    void nav({to:"/izle/$slug/$n",params:{slug,n:String(next.n)}});
  };
  useEffect(() => {
    if (countdown === null || !autoplay) return;
    if (countdown <= 0) { goNext(); return; }
    const timer = setTimeout(() => setCountdown(v => v === null ? null : v - 1),1000);
    return () => clearTimeout(timer);
  }, [countdown, autoplay]);

  const syncAudio = () => {
    const v=video.current, a=audio.current;
    if (!v || !a) return;
    if (Math.abs(a.currentTime-v.currentTime)>0.35) a.currentTime=v.currentTime;
    a.playbackRate=v.playbackRate;
    a.volume=v.volume;
    if (v.paused) a.pause(); else void a.play().catch(() => {
      v.pause(); setAudioSrc(null); toast.info(tr("Dublaj başlatılamadı. Mevcut sesle devam edebilirsiniz.","Dubbing could not start. Continue with the original audio."));
    });
  };

  return <AppShell>
    <header className="flex items-center gap-3 px-5 pt-6">
      <Link to="/dizi/$slug" params={{slug}} className="rounded-full glass p-2" aria-label={t("back")}><ArrowLeft className="h-5 w-5"/></Link>
      <h1 className="text-base font-bold">{ep ? episodeTitle(ep,lang) ?? `${t("episode")} ${n}` : t("draft_ep")}</h1>
    </header>
    {!canPlay(ep) ? <p className="m-5 rounded-2xl bg-card p-5">{t("draft_ep_note")}</p> : !allowed ?
      <p className="m-5 rounded-2xl bg-card p-5">{t("locked_ep")} <Link to="/dizi/$slug" params={{slug}} className="text-primary underline">{t("back")}</Link></p> : <>
      <div className="relative mx-5 mt-4 overflow-hidden rounded-2xl bg-black">
        {failed ? <div className="grid aspect-video place-content-center gap-4 p-5 text-center">
          <p role="alert">{tr("Video yüklenemedi. İnternet bağlantınızı kontrol edin.","Video could not load. Check your connection.")}</p>
          <button className="rounded-full bg-primary p-3" onClick={() => setRetry(v=>v+1)}>{tr("Yeniden dene","Try again")}</button>
        </div> : src ? <video key={ep.id+":"+retry} ref={video} src={src} controls autoPlay playsInline muted={!!audioSrc} className="aspect-video w-full"
          onLoadedMetadata={e=>{setFailed(false);if(seek.current>5 && seek.current<e.currentTarget.duration)e.currentTarget.currentTime=seek.current;}}
          onError={()=>setFailed(true)} onPlay={syncAudio} onPause={()=>{audio.current?.pause();save();}} onSeeking={syncAudio} onTimeUpdate={syncAudio} onRateChange={syncAudio} onVolumeChange={syncAudio}
          onEnded={()=>{audio.current?.pause();save(true); if(next && autoplay)setCountdown(3);}}
        >{subSrc && <track kind="subtitles" src={subSrc} srcLang={state.subLang} label={LANG_NAMES[state.subLang as keyof typeof LANG_NAMES]} default/>}</video> : <div className="grid aspect-video place-items-center">{t("loading")}</div>}
        {audioSrc && <audio ref={audio} src={audioSrc} preload="auto" onError={()=>{setAudioSrc(null);toast.info(tr("Dublaj yüklenemedi; mevcut ses kullanılacak.","Dubbing unavailable; using original audio."));}}/>}
        {countdown !== null && <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 p-3">
          <p className="text-xs">{t("next_in",{n:countdown})}</p>
          <button onClick={goNext} className="rounded-full bg-primary p-2 text-xs">{t("watch_now")}</button>
          <button onClick={()=>setCountdown(null)} aria-label={t("cancel_next")}><X/></button>
        </div>}
      </div>
      {trackStatus(ep,"audio",state.audioLang)!=="ready" && <p className="mx-5 mt-3 text-xs text-muted-foreground">{t("dub_missing",{lang:LANG_NAMES[state.audioLang]})}</p>}
      {state.subLang!=="off" && trackStatus(ep,"subs",state.subLang)!=="ready" && <p className="mx-5 mt-3 text-xs text-muted-foreground">{t("sub_missing",{lang:LANG_NAMES[state.subLang]})}</p>}
      <label className="m-5 flex items-center gap-3 rounded-2xl bg-card p-4 text-sm"><input type="checkbox" checked={autoplay} onChange={e=>{setAutoplay(e.target.checked);localStorage.setItem("amc-autoplay",String(e.target.checked));setCountdown(null);}}/>{t("autoplay")}</label>
      {next && <button onClick={goNext} className="mx-5 rounded-full bg-primary px-5 py-3">{t("episode")} {next.n} · {t("watch_now")}</button>}
      {!next && <p className="m-5 text-sm text-muted-foreground">{tr("Şu anda başka yayımlanmış bölüm yok.","No further published episode is available.")}</p>}
    </>}
    <button onClick={()=>{void nav({to:"/"});void ads.atSeriesEnd();}} className="m-5 rounded-full bg-secondary p-3 text-sm">{tr("Diğer dizileri keşfet","Explore other series")}</button>
  </AppShell>;
}
