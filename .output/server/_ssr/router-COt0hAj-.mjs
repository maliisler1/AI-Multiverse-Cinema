import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-5n8gBqZu.mjs";
import { c as lazyRouteComponent, d as Link, f as useNavigate, i as HeadContent, l as createFileRoute, m as notFound, o as createRouter, p as useRouter, r as Scripts, s as Outlet, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as ArrowLeft, t as X, v as LoaderCircle } from "../_libs/lucide-react.mjs";
import { c as useAppState, i as LANG_NAMES, l as useT, n as AppStateProvider, o as ads, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { n as useSuspenseQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as signedUrl, n as episodeTitle, o as trackStatus, r as seriesListQuery, t as episodeListQuery } from "./catalog-BLKtVYzb.mjs";
import { t as Route$9 } from "./dizi._slug-DxRHPgfE.mjs";
import { i as offline } from "./offline-DXPmEaJz.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as pickFeatured } from "./routes-DCenuwOj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-COt0hAj-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-RWJlcwaA.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "theme-color",
				content: "#fafafa"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Unbounded:wght@600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppStateProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			richColors: true,
			position: "top-center"
		})] })
	});
}
var $$splitComponentImporter$6 = () => import("./routes-BOW2QeUQ.mjs");
var Route$7 = createFileRoute("/")({
	loader: async ({ context }) => {
		const f = pickFeatured(await context.queryClient.ensureQueryData(seriesListQuery));
		if (f) await context.queryClient.ensureQueryData(episodeListQuery(f.id, f.slug));
		return null;
	},
	head: () => ({ meta: [
		{ title: "The Human Code: 2300" },
		{
			name: "description",
			content: "The Human Code: 2300 dizisinin tüm bölümlerini izle."
		},
		{
			property: "og:title",
			content: "The Human Code: 2300"
		},
		{
			property: "og:description",
			content: "İnsanlığın kurtuluşu DNA'nda yazılı."
		},
		{
			property: "og:type",
			content: "video.tv_show"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./ayarlar-CJAXEb9n.mjs");
var Route$6 = createFileRoute("/ayarlar")({
	head: () => ({ meta: [
		{ title: "Dil Ayarları — The Human Code: 2300" },
		{
			name: "description",
			content: "Uygulama, seslendirme ve altyazı dilini ayrı ayrı seç."
		},
		{
			property: "og:title",
			content: "Dil Ayarları — The Human Code: 2300"
		},
		{
			property: "og:description",
			content: "Uygulama, seslendirme ve altyazı dilini ayrı ayrı seç."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./giris-DdS83Y6B.mjs");
var Route$5 = createFileRoute("/giris")({
	head: () => ({ meta: [
		{ title: "Giriş / Kayıt — The Human Code: 2300" },
		{
			name: "description",
			content: "Hesabını aç; jetonların, fotoğrafın ve ilerlemen her cihazda seninle gelsin."
		},
		{
			property: "og:title",
			content: "Hesabını aç — The Human Code: 2300"
		},
		{
			property: "og:description",
			content: "Jetonların, yüz fotoğrafın ve izleme ilerlemen her cihazda seninle gelir."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./jeton-DheYqY9U.mjs");
var Route$4 = createFileRoute("/jeton")({
	head: () => ({ meta: [
		{ title: "Sezonu Satın Al — The Human Code: 2300" },
		{
			name: "description",
			content: "Tüm bölümleri reklamsız ve internetsiz izle."
		},
		{
			property: "og:title",
			content: "Sezonu Satın Al — The Human Code: 2300"
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./kapsul-DOjjcV5T.mjs");
var Route$3 = createFileRoute("/kapsul")({
	head: () => ({ meta: [
		{ title: "Senin kapsülün kaç? — The Human Code: 2300" },
		{
			name: "description",
			content: "Dünya'nın sonundan kurtarılan 23 kişiden hangisisin?"
		},
		{
			property: "og:title",
			content: "Senin kapsülün kaç? — The Human Code: 2300"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./profil-B_39l8ty.mjs");
var Route$2 = createFileRoute("/profil")({
	head: () => ({ meta: [
		{ title: "Hesabım — The Human Code: 2300" },
		{
			name: "description",
			content: "The Human Code: 2300 hesabın."
		},
		{
			property: "og:title",
			content: "Hesabım — The Human Code: 2300"
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./yonetim-B21oPj2n.mjs");
var Route$1 = createFileRoute("/yonetim")({
	loader: ({ context }) => context.queryClient.ensureQueryData(seriesListQuery),
	head: () => ({ meta: [
		{ title: "İçerik Yönetimi — The Human Code: 2300" },
		{
			name: "description",
			content: "Dizi, bölüm, video ve dil dosyalarını yönet."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function canPlay(ep) {
	return !!ep && ep.status === "ready" && !!ep.video_url;
}
function hasEpisodeAccess(ep, unlocked, freeEpisodes, seasonOwned = false) {
	return seasonOwned || ep.n <= freeEpisodes || unlocked.includes(ep.id);
}
function nextPlayable(eps, current) {
	return eps.find((e) => e.n === current + 1 && canPlay(e));
}
var Route = createFileRoute("/izle/$slug/$n")({
	loader: async ({ context, params }) => {
		const s = (await context.queryClient.ensureQueryData(seriesListQuery)).find((x) => x.slug === params.slug);
		if (!s) throw notFound();
		await context.queryClient.ensureQueryData(episodeListQuery(s.id, s.slug));
		return {
			id: s.id,
			slug: s.slug,
			n: Number(params.n)
		};
	},
	component: Player
});
function Player() {
	const { id, slug, n } = Route.useLoaderData();
	const { data: eps } = useSuspenseQuery(episodeListQuery(id, slug));
	const { state, user, update } = useAppState();
	const { t, lang } = useT();
	const nav = useNavigate();
	const video = (0, import_react.useRef)(null);
	const audio = (0, import_react.useRef)(null);
	const [src, setSrc] = (0, import_react.useState)(null);
	const [subSrc, setSubSrc] = (0, import_react.useState)(null);
	const [audioSrc, setAudioSrc] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [buffering, setBuffering] = (0, import_react.useState)(true);
	const [retry, setRetry] = (0, import_react.useState)(0);
	const [autoplay, setAutoplay] = (0, import_react.useState)(() => localStorage.getItem("amc-autoplay") !== "false");
	const [countdown, setCountdown] = (0, import_react.useState)(null);
	const ep = eps.find((e) => e.n === n);
	const next = nextPlayable(eps, n);
	const allowed = !!ep && hasEpisodeAccess(ep, state.unlocked, 2, state.seasonOwned);
	const completed = (0, import_react.useRef)(false);
	const seek = (0, import_react.useRef)(0);
	const mutedFallback = (0, import_react.useRef)(false);
	const updateRef = (0, import_react.useRef)(update);
	updateRef.current = update;
	const tr = (a, b) => lang === "tr" ? a : b;
	(0, import_react.useEffect)(() => {
		let live = true;
		let subBlob = null;
		let timer;
		setSrc(null);
		setSubSrc(null);
		setAudioSrc(null);
		setFailed(false);
		setBuffering(true);
		setCountdown(null);
		completed.current = false;
		mutedFallback.current = false;
		seek.current = ep ? state.resume[ep.id] ?? 0 : 0;
		if (!canPlay(ep) || !allowed) return;
		const current = ep;
		const load = async () => {
			const local = offline.get(current.id);
			if (local) {
				setSrc(offline.src(local.video));
				if (local.audio) setAudioSrc(offline.src(local.audio));
				return;
			}
			try {
				const url = await signedUrl("videos", current.video_url);
				if (!url) throw new Error("video unavailable");
				if (!live) return;
				setSrc(url);
				const readyDub = (lang) => current.tracks.find((x) => x.kind === "audio" && x.lang === lang && x.status === "ready" && x.url);
				const dub = readyDub(state.audioLang) ?? readyDub("tr");
				if (dub) {
					const au = await signedUrl("videos", dub.url);
					if (live) setAudioSrc(au);
				}
				const sub = current.tracks.find((x) => x.kind === "subs" && x.lang === state.subLang && x.status === "ready" && x.url);
				if (sub) {
					const su = await signedUrl("videos", sub.url);
					if (su) {
						const r = await fetch(su);
						if (!r.ok) throw new Error("subtitle unavailable");
						subBlob = URL.createObjectURL(new Blob([await r.text()], { type: "text/vtt" }));
						if (live) setSubSrc(subBlob);
						else URL.revokeObjectURL(subBlob);
					}
				}
			} catch {
				if (live) setFailed(true);
			}
		};
		timer = setTimeout(() => {
			if (live && !video.current?.readyState) setFailed(true);
		}, 3e4);
		load();
		return () => {
			live = false;
			clearTimeout(timer);
			if (subBlob) URL.revokeObjectURL(subBlob);
		};
	}, [
		ep?.id,
		allowed,
		retry,
		state.audioLang,
		state.subLang
	]);
	(0, import_react.useEffect)(() => {
		let live = true;
		if (!ep || !user || !allowed) return;
		supabase.from("user_progress").select("position_sec, completed").eq("user_id", user.id).eq("episode_id", ep.id).maybeSingle().then(({ data }) => {
			if (live && data && !data.completed && data.position_sec > 5) {
				seek.current = data.position_sec;
				const v = video.current;
				if (v && v.readyState && v.currentTime < 1 && v.duration > seek.current) v.currentTime = seek.current;
			}
		});
		return () => {
			live = false;
		};
	}, [
		ep?.id,
		user?.id,
		allowed
	]);
	const save = (done = false) => {
		const v = video.current;
		if (!v || !ep || !allowed || v.currentTime < 1 && !done) return;
		if (done) completed.current = true;
		const position = completed.current ? 0 : Math.floor(v.currentTime);
		updateRef.current((s) => ({
			...s,
			lastWatched: {
				slug,
				n
			},
			resume: {
				...s.resume,
				[ep.id]: position
			}
		}));
		if (user) supabase.from("user_progress").upsert({
			user_id: user.id,
			episode_id: ep.id,
			position_sec: Math.floor(v.currentTime),
			completed: completed.current
		}, { onConflict: "user_id,episode_id" });
	};
	const saveRef = (0, import_react.useRef)(save);
	saveRef.current = save;
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => saveRef.current(), 5e3);
		const hide = () => {
			if (document.visibilityState === "hidden") saveRef.current();
		};
		document.addEventListener("visibilitychange", hide);
		return () => {
			clearInterval(timer);
			document.removeEventListener("visibilitychange", hide);
			saveRef.current();
		};
	}, [ep?.id]);
	const goNext = () => {
		setCountdown(null);
		if (!next) return;
		if (!hasEpisodeAccess(next, state.unlocked, 2, state.seasonOwned)) {
			toast.info(t("locked_ep"));
			nav({
				to: "/dizi/$slug",
				params: { slug }
			});
			return;
		}
		nav({
			to: "/izle/$slug/$n",
			params: {
				slug,
				n: String(next.n)
			}
		});
	};
	(0, import_react.useEffect)(() => {
		if (countdown === null || !autoplay) return;
		if (countdown <= 0) {
			goNext();
			return;
		}
		const timer = setTimeout(() => setCountdown((v) => v === null ? null : v - 1), 1e3);
		return () => clearTimeout(timer);
	}, [countdown, autoplay]);
	const syncAudio = () => {
		const v = video.current, a = audio.current;
		if (!v || !a) return;
		if (Math.abs(a.currentTime - v.currentTime) > .35) a.currentTime = v.currentTime;
		a.playbackRate = v.playbackRate;
		a.volume = v.volume;
		if (v.paused) a.pause();
		else a.play().catch(() => {
			v.pause();
			setAudioSrc(null);
			toast.info(tr("Dublaj başlatılamadı. Mevcut sesle devam edebilirsiniz.", "Dubbing could not start. Continue with the original audio."));
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-3 px-5 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dizi/$slug",
				params: { slug },
				className: "rounded-full glass p-2",
				"aria-label": t("back"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-base font-bold",
				children: ep ? episodeTitle(ep, lang) ?? `${t("episode")} ${n}` : t("draft_ep")
			})]
		}),
		!canPlay(ep) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "m-5 rounded-2xl bg-card p-5",
			children: t("draft_ep_note")
		}) : !allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "m-5 rounded-2xl bg-card p-5",
			children: [
				t("locked_ep"),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dizi/$slug",
					params: { slug },
					className: "text-primary underline",
					children: t("back")
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-5 mt-4 overflow-hidden rounded-2xl bg-black",
				children: [
					failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid aspect-video place-content-center gap-4 p-5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							children: tr("Video yüklenemedi. İnternet bağlantınızı kontrol edin.", "Video could not load. Check your connection.")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-full bg-primary p-3",
							onClick: () => setRetry((v) => v + 1),
							children: tr("Yeniden dene", "Try again")
						})]
					}) : src ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: video,
						src,
						controls: true,
						autoPlay: true,
						playsInline: true,
						preload: "auto",
						className: "aspect-video w-full",
						onLoadedMetadata: (e) => {
							setFailed(false);
							setBuffering(false);
							if (seek.current > 5 && seek.current < e.currentTarget.duration) e.currentTarget.currentTime = seek.current;
						},
						onError: () => setFailed(true),
						onWaiting: () => setBuffering(true),
						onPlaying: () => setBuffering(false),
						onCanPlay: (e) => {
							setBuffering(false);
							const v = e.currentTarget;
							if (v && !mutedFallback.current) v.play().catch(() => {
								mutedFallback.current = true;
								v.muted = true;
								v.play().catch(() => {});
							});
						},
						onPlay: syncAudio,
						onPause: () => {
							audio.current?.pause();
							save();
						},
						onSeeking: syncAudio,
						onTimeUpdate: syncAudio,
						onRateChange: syncAudio,
						onVolumeChange: syncAudio,
						onEnded: () => {
							audio.current?.pause();
							save(true);
							ads.atEpisodeEnd();
							if (next && autoplay) setCountdown(3);
						},
						children: subSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("track", {
							kind: "subtitles",
							src: subSrc,
							srcLang: state.subLang,
							label: LANG_NAMES[state.subLang],
							default: true
						})
					}, ep.id + ":" + retry), buffering && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 grid place-items-center bg-black/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-10 w-10 animate-spin text-white" })
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid aspect-video place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-white" })
					}),
					audioSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						ref: audio,
						src: audioSrc,
						preload: "auto",
						onError: () => {
							setAudioSrc(null);
							toast.info(tr("Dublaj yüklenemedi; mevcut ses kullanılacak.", "Dubbing unavailable; using original audio."));
						}
					}),
					countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs",
								children: t("next_in", { n: countdown })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: goNext,
								className: "rounded-full bg-primary p-2 text-xs",
								children: t("watch_now")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCountdown(null),
								"aria-label": t("cancel_next"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
							})
						]
					})
				]
			}),
			trackStatus(ep, "audio", state.audioLang) !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-5 mt-3 text-xs text-muted-foreground",
				children: t("dub_missing", { lang: LANG_NAMES[state.audioLang] })
			}),
			state.subLang !== "off" && trackStatus(ep, "subs", state.subLang) !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-5 mt-3 text-xs text-muted-foreground",
				children: t("sub_missing", { lang: LANG_NAMES[state.subLang] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "m-5 flex items-center gap-3 rounded-2xl bg-card p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: autoplay,
					onChange: (e) => {
						setAutoplay(e.target.checked);
						localStorage.setItem("amc-autoplay", String(e.target.checked));
						setCountdown(null);
					}
				}), t("autoplay")]
			}),
			next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: goNext,
				className: "mx-5 rounded-full bg-primary px-5 py-3",
				children: [
					t("episode"),
					" ",
					next.n,
					" · ",
					t("watch_now")
				]
			}),
			!next && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "m-5 text-sm text-muted-foreground",
				children: tr("Şu anda başka yayımlanmış bölüm yok.", "No further published episode is available.")
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => {
				nav({ to: "/" });
				ads.atSeriesEnd();
			},
			className: "m-5 rounded-full bg-secondary p-3 text-sm",
			children: tr("Diğer dizileri keşfet", "Explore other series")
		})
	] });
}
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AyarlarRoute: Route$6.update({
		id: "/ayarlar",
		path: "/ayarlar",
		getParentRoute: () => Route$8
	}),
	GirisRoute: Route$5.update({
		id: "/giris",
		path: "/giris",
		getParentRoute: () => Route$8
	}),
	JetonRoute: Route$4.update({
		id: "/jeton",
		path: "/jeton",
		getParentRoute: () => Route$8
	}),
	KapsulRoute: Route$3.update({
		id: "/kapsul",
		path: "/kapsul",
		getParentRoute: () => Route$8
	}),
	ProfilRoute: Route$2.update({
		id: "/profil",
		path: "/profil",
		getParentRoute: () => Route$8
	}),
	YonetimRoute: Route$1.update({
		id: "/yonetim",
		path: "/yonetim",
		getParentRoute: () => Route$8
	}),
	DiziSlugRoute: Route$9.update({
		id: "/dizi/$slug",
		path: "/dizi/$slug",
		getParentRoute: () => Route$8
	}),
	IzleSlugNRoute: Route.update({
		id: "/izle/$slug/$n",
		path: "/izle/$slug/$n",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
