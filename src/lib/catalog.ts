import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/lib/i18n";
import { getBundledVideo } from "@/lib/videos";

export type TrackStatus = "ready" | "planned" | "none";
export type Category = "scifi" | "comedy" | "romance";

export type SeriesText = { lang: string; tagline: string | null; description: string | null };

export type SeriesRow = {
  id: string;
  slug: string;
  title: string;
  category: Category;
  poster_url: string | null;
  status: "draft" | "published";
  sort: number;
  text: Partial<Record<Lang, SeriesText>>;
};

export type EpisodeRow = {
  id: string;
  series_id: string;
  n: number;
  minutes: number;
  video_url: string | null;
  duration_sec: number | null;
  status: "draft" | "ready";
  titles: { lang: string; title: string }[];
  tracks: { kind: "audio" | "subs"; lang: string; status: TrackStatus; url: string | null }[];
};

/** Özel kovalardaki dosyalar için geçici (imzalı) erişim bağlantısı üretir. */
export async function signedUrl(bucket: "posters" | "videos" | "faces", path: string | null): Promise<string | null> {
  if (!path) return null;
  // Root-relative paths are public assets (bundled platform assets or files in /public).
  if (path.startsWith("/")) return path;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 6);
  return error ? null : data.signedUrl;
}

export const seriesListQuery = queryOptions({
  queryKey: ["series", "list"],
  queryFn: async (): Promise<SeriesRow[]> => {
    const { data, error } = await supabase
      .from("series")
      .select("*, series_text(lang,tagline,description)")
      .order("sort", { ascending: true });
    if (error) throw error;
    return ((data ?? []) as unknown as (SeriesRow & { series_text?: SeriesText[] })[]).map((s) => {
      const text: Partial<Record<Lang, SeriesText>> = {};
      for (const t of s.series_text ?? []) text[t.lang as Lang] = t;
      const { series_text: _drop, ...rest } = s;
      return { ...rest, text };
    });
  },
});

export const episodeListQuery = (seriesId: string, slug: string) =>
  queryOptions({
    queryKey: ["episodes", seriesId],
    queryFn: async (): Promise<EpisodeRow[]> => {
      const { data, error } = await supabase
        .from("episodes")
        .select("*, episode_titles(lang,title), tracks(kind,lang,status,url)")
        .eq("series_id", seriesId)
        .order("n", { ascending: true });
      if (error) throw error;
      type Raw = EpisodeRow & { episode_titles?: { lang: string; title: string }[] };
      return ((data ?? []) as unknown as Raw[]).map((e) => {
        const { episode_titles: titles, ...rest } = e;
        const bundled = getBundledVideo(slug, e.n);
        if (bundled) {
          return { ...rest, titles: titles ?? [], video_url: bundled, status: "ready" as const };
        }
        return { ...rest, titles: titles ?? [] };
      });
    },
  });

/** Bölümde istenen dilde ses/altyazı durumu. Kayıt yoksa "none". */
export function trackStatus(ep: EpisodeRow, kind: "audio" | "subs", lang: Lang | "off"): TrackStatus {
  if (kind === "subs" && lang === "off") return "ready";
  const row = ep.tracks.find((t) => t.kind === kind && t.lang === lang);
  return row?.status ?? "none";
}

/** Bölüm başlığı: seçili dil, yoksa İngilizce, yoksa Türkçe, yoksa boş. */
export function episodeTitle(ep: EpisodeRow, lang: Lang): string | null {
  const t = ep.titles.find((x) => x.lang === lang) ?? ep.titles.find((x) => x.lang === "en") ?? ep.titles.find((x) => x.lang === "tr");
  return t?.title ?? null;
}

export function seriesTextOf(s: SeriesRow, lang: Lang): SeriesText {
  return s.text[lang] ?? s.text.en ?? s.text.tr ?? { lang, tagline: null, description: null };
}
