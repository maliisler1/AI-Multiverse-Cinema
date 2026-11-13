import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as CircleCheck, E as Crown, P as ArrowLeft, T as Download, d as Play, g as Lock, i as Tv, w as Film, x as Info, y as ListVideo } from "../_libs/lucide-react.mjs";
import { a as TokenBadge, c as useAppState, i as LANG_NAMES, l as useT, o as ads, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as signedUrl, i as seriesTextOf, n as episodeTitle, o as trackStatus, r as seriesListQuery, t as episodeListQuery } from "./catalog-BLKtVYzb.mjs";
import { a as useOffline, i as offline, n as neo_genesis_default, r as neon_hearts_default, t as cyber_glitch_default } from "./offline-DXPmEaJz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SeriesView-UeIRlsRJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Hazır afişi olan diziler; diğerleri yönetici afiş yükleyene dek desenli alan gösterir. */
var BUNDLED_POSTERS = {
	"neo-genesis-2099": neo_genesis_default,
	"cyber-glitch-ro-buster": cyber_glitch_default,
	"neon-hearts-virtual-pulse": neon_hearts_default
};
/** Bir dizinin afişi, açıklaması, dil durumu ve bölüm listesi. Ana sayfa ve dizi sayfası paylaşır. */
function SeriesView({ id, slug, home = false, children }) {
	const { data: all } = useSuspenseQuery(seriesListQuery);
	const { data: eps } = useSuspenseQuery(episodeListQuery(id, slug));
	const { state, unlockEpisode } = useAppState();
	const saved = useOffline();
	const [locked, setLocked] = (0, import_react.useState)(null);
	const [adBusy, setAdBusy] = (0, import_react.useState)(false);
	const [downloading, setDownloading] = (0, import_react.useState)(null);
	const { t, lang } = useT();
	const nav = useNavigate();
	const s = all.find((x) => x.id === id);
	const tx = seriesTextOf(s, lang);
	const poster = BUNDLED_POSTERS[s.slug];
	const st = (v) => t(v === "ready" ? "st_ready" : v === "planned" ? "st_planned" : "st_none");
	const audioSt = trackStatus(eps[0] ?? {
		tracks: [],
		titles: []
	}, "audio", state.audioLang);
	const subSt = trackStatus(eps[0] ?? {
		tracks: [],
		titles: []
	}, "subs", state.subLang);
	const first = eps[0];
	const anyReady = eps.some((e) => e.status === "ready" && e.video_url);
	const owned = state.seasonOwned;
	const hasAccess = (n, episodeId) => owned || n <= 2 || state.unlocked.includes(episodeId);
	const open = async (n, episodeId, ready) => {
		if (!ready) {
			toast.info(t("draft_ep_note"));
			return;
		}
		if (!hasAccess(n, episodeId)) {
			setLocked({
				n,
				id: episodeId
			});
			return;
		}
		nav({
			to: "/izle/$slug/$n",
			params: {
				slug: s.slug,
				n: String(n)
			}
		});
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
		nav({
			to: "/izle/$slug/$n",
			params: {
				slug: s.slug,
				n: String(n)
			}
		});
	};
	const download = async (e) => {
		if (downloading) return;
		setDownloading(e.id);
		try {
			const url = await signedUrl("videos", e.video_url);
			if (!url) throw new Error("no video");
			const pick = (l) => e.tracks.find((x) => x.kind === "audio" && x.lang === l && x.status === "ready" && x.url);
			const dub = pick(state.audioLang) ?? pick("tr");
			const audioUrl = dub ? await signedUrl("videos", dub.url) : null;
			await offline.download(e.id, url, audioUrl && dub ? {
				url: audioUrl,
				lang: dub.lang
			} : void 0);
			toast.success(t("download_done", { n: e.n }));
		} catch {
			toast.error(t("download_err"));
		} finally {
			setDownloading(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: poster,
					alt: s.title,
					width: 768,
					height: 1152,
					className: "aspect-[4/5] w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-primary/30 via-card to-accent/20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-fade" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 top-0 flex justify-between p-5",
					children: [home ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full glass px-3 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-neon",
						children: "The Human Code"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "rounded-full glass p-2",
						"aria-label": t("back"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5 rtl:rotate-180" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenBadge, {})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative -mt-20 px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-accent-foreground",
					children: t(`cat_${s.category}`)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-2xl font-bold",
					children: s.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: tx.description
				}),
				first && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => open(first.n, first.id, first.status === "ready" && !!first.video_url),
					className: "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon py-3 text-sm font-bold text-primary-foreground shadow-neon",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }),
						" ",
						t("watch_ep1")
					]
				}),
				first && eps.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						try {
							localStorage.setItem("amc-autoplay", "true");
						} catch {}
						open(first.n, first.id, first.status === "ready" && !!first.video_url);
					},
					className: "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "h-4 w-4" }),
						" ",
						t("watch_season")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 rounded-2xl bg-card p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: t("lang_box")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								t("audio"),
								": ",
								LANG_NAMES[state.audioLang]
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: st(audioSt)
							})]
						}),
						state.subLang !== "off" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								t("subtitles"),
								": ",
								LANG_NAMES[state.subLang]
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: st(subSt)
							})]
						}),
						!anyReady && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 shrink-0" }), t("no_video")]
						}),
						anyReady && audioSt !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: t("dub_missing", { lang: LANG_NAMES[state.audioLang] })
						}),
						anyReady && subSt !== "ready" && state.subLang !== "off" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: t("sub_missing", { lang: LANG_NAMES[state.subLang] })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-7 text-sm font-bold",
					children: t("episodes")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: t("free_ep", { n: 2 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: eps.map((e) => {
						const ready = e.status === "ready" && !!e.video_url;
						const unlocked = hasAccess(e.n, e.id);
						const isSaved = !!saved[e.id];
						const title = episodeTitle(e, lang);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => open(e.n, e.id, ready),
							className: "flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid h-10 w-10 place-items-center rounded-full ${unlocked && ready ? "bg-neon text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
									children: ready ? unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-sm font-semibold",
										children: [
											t("episode"),
											" ",
											e.n,
											title ? `: ${title}` : ""
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											e.minutes,
											" ",
											t("min"),
											" · ",
											ready ? t("status_ready") : t("status_draft")
										]
									})]
								}),
								!unlocked && ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-gold" })
							]
						}), owned && ready && offline.supported() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => isSaved ? void offline.remove(e.id) : void download(e),
							disabled: downloading !== null && downloading !== e.id,
							className: "mt-1 flex w-full items-center justify-end gap-1.5 px-4 text-xs font-semibold text-muted-foreground disabled:opacity-50",
							children: [isSaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), downloading === e.id ? t("downloading") : isSaved ? `${t("downloaded")} · ${t("remove_download")}` : t("download")]
						})] }, e.id);
					})
				}),
				!owned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/jeton",
					className: "mt-5 flex items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-center text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4 text-gold" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-primary",
							children: t("season_title")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								"· ",
								t("season_perk2"),
								", ",
								t("season_perk3").toLowerCase()
							]
						})
					]
				}),
				children
			]
		}),
		locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[60] grid place-items-end bg-background/70 p-4 backdrop-blur-sm",
			onClick: () => setLocked(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-md rounded-3xl border bg-card p-6",
				onClick: (ev) => ev.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6 text-gold" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-lg font-bold",
						children: t("locked_title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							t("episode"),
							" ",
							locked.n
						]
					}),
					ads.canReward() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void unlockWithAd(),
						disabled: adBusy,
						className: "mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold disabled:opacity-60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tv, { className: "h-4 w-4" }),
							" ",
							adBusy ? "…" : t("watch_ad")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/jeton",
						className: "mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neon py-3 text-sm font-bold text-primary-foreground shadow-neon",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" }),
							" ",
							t("season_title")
						]
					})
				]
			})
		})
	] });
}
//#endregion
export { SeriesView as n, BUNDLED_POSTERS as t };
