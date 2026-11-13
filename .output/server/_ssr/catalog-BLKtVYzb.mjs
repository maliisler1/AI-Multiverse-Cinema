import { t as supabase } from "./client-5n8gBqZu.mjs";
import { t as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-BLKtVYzb.js
/**
* Bundled video assets that ship with the app.
* Maps a series slug + episode number to a video URL served from /public.
* These are used as a fallback when Supabase storage doesn't have the video yet.
*/
var BUNDLED_VIDEOS = {
	"neo-genesis-2099": {
		1: "/sample.mp4",
		2: "/sample-2.mp4"
	},
	"cyber-glitch-ro-buster": {
		1: "/sample-2.mp4",
		2: "/sample-3.mp4"
	},
	"neon-hearts-virtual-pulse": {
		1: "/sample-3.mp4",
		2: "/sample.mp4"
	}
};
/** Returns the bundled video URL for a series slug + episode number, if any. */
function getBundledVideo(slug, n) {
	return BUNDLED_VIDEOS[slug]?.[n] ?? null;
}
/** Özel kovalardaki dosyalar için geçici (imzalı) erişim bağlantısı üretir. */
async function signedUrl(bucket, path) {
	if (!path) return null;
	if (path.startsWith("/")) return path;
	const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600 * 6);
	return error ? null : data.signedUrl;
}
var seriesListQuery = queryOptions({
	queryKey: ["series", "list"],
	queryFn: async () => {
		const { data, error } = await supabase.from("series").select("*, series_text(lang,tagline,description)").order("sort", { ascending: true });
		if (error) throw error;
		return (data ?? []).map((s) => {
			const text = {};
			for (const t of s.series_text ?? []) text[t.lang] = t;
			const { series_text: _drop, ...rest } = s;
			return {
				...rest,
				text
			};
		});
	}
});
var episodeListQuery = (seriesId, slug) => queryOptions({
	queryKey: ["episodes", seriesId],
	queryFn: async () => {
		const { data, error } = await supabase.from("episodes").select("*, episode_titles(lang,title), tracks(kind,lang,status,url)").eq("series_id", seriesId).order("n", { ascending: true });
		if (error) throw error;
		return (data ?? []).map((e) => {
			const { episode_titles: titles, ...rest } = e;
			const bundled = e.video_url ? null : getBundledVideo(slug, e.n);
			if (bundled) return {
				...rest,
				titles: titles ?? [],
				video_url: bundled,
				status: "ready"
			};
			return {
				...rest,
				titles: titles ?? []
			};
		});
	}
});
/** Bölümde istenen dilde ses/altyazı durumu. Kayıt yoksa "none". */
function trackStatus(ep, kind, lang) {
	if (kind === "subs" && lang === "off") return "ready";
	return ep.tracks.find((t) => t.kind === kind && t.lang === lang)?.status ?? "none";
}
/** Bölüm başlığı: seçili dil, yoksa İngilizce, yoksa Türkçe, yoksa boş. */
function episodeTitle(ep, lang) {
	return (ep.titles.find((x) => x.lang === lang) ?? ep.titles.find((x) => x.lang === "en") ?? ep.titles.find((x) => x.lang === "tr"))?.title ?? null;
}
function seriesTextOf(s, lang) {
	return s.text[lang] ?? s.text.en ?? s.text.tr ?? {
		lang,
		tagline: null,
		description: null
	};
}
//#endregion
export { signedUrl as a, seriesTextOf as i, episodeTitle as n, trackStatus as o, seriesListQuery as r, episodeListQuery as t };
