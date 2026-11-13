import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-5n8gBqZu.mjs";
import { D as Combine, N as Check, O as CloudUpload, S as Image, _ as Loader, a as Square, j as CircleAlert, l as RotateCcw, o as Sparkles, p as Mic, u as Plus, w as Film } from "../_libs/lucide-react.mjs";
import { c as useAppState, l as useT, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { i as useQueryClient, n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { r as seriesListQuery, t as episodeListQuery } from "./catalog-BLKtVYzb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/yonetim-B21oPj2n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTIVE = [
	"queued",
	"PENDING",
	"RUNNING",
	"THROTTLED"
];
var LANG_LABEL = {
	tr: "Türkçe",
	en: "English",
	de: "Deutsch",
	fr: "Français",
	es: "Español",
	pt: "Português",
	ar: "العربية",
	hi: "हिन्दी"
};
var ASSEMBLE_URL = "https://github.com/maliisler1/AI-Multiverse-Cinema/actions/workflows/assemble-episode.yml";
async function call(action, payload = {}) {
	const { data } = await supabase.auth.getSession();
	const resp = await fetch(`${{
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SUPABASE_URL"]}/functions/v1/episode-production`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${data.session?.access_token ?? ""}`
		},
		body: JSON.stringify({
			action,
			...payload
		})
	});
	const body = await resp.json().catch(() => ({}));
	return {
		ok: resp.ok,
		status: resp.status,
		body
	};
}
function ProductionPanel({ seriesSlug = "neo-genesis-2099", episode = 1 }) {
	const { lang } = useT();
	const tr = (a, b) => lang === "tr" ? a : b;
	const [ov, setOv] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	const [dailyLimit, setDailyLimit] = (0, import_react.useState)(false);
	const [refUrl, setRefUrl] = (0, import_react.useState)(null);
	const [voices, setVoices] = (0, import_react.useState)({});
	const [ttsModel, setTtsModel] = (0, import_react.useState)("eleven_v3");
	const [quality, setQuality] = (0, import_react.useState)("economy");
	const [langs, setLangs] = (0, import_react.useState)([]);
	const fileRef = (0, import_react.useRef)(null);
	const base = {
		seriesSlug,
		episode
	};
	const apply = (0, import_react.useCallback)((o) => {
		setOv(o);
		setVoices((v) => Object.keys(v).length ? v : Object.fromEntries(Object.entries(o.speakers).map(([k, s]) => [k, s.defaultVoice])));
		setLangs((l) => l.length ? l : o.langs);
	}, []);
	const load = (0, import_react.useCallback)(async () => {
		const r = await call("overview", base);
		if (!r.ok) {
			setError(r.body.error ?? `HTTP ${r.status}`);
			return;
		}
		setError(null);
		apply(r.body);
	}, [seriesSlug, episode]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (!ov?.hasReference) return;
		supabase.storage.from("videos").createSignedUrl(ov.referencePath, 3600).then(({ data }) => setRefUrl(data?.signedUrl ?? null));
	}, [ov?.hasReference, ov?.referencePath]);
	const active = ov?.jobs.some((j) => ACTIVE.includes(j.status)) ?? false;
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const id = setInterval(async () => {
			const r = await call("poll", base);
			if (r.ok) {
				apply(r.body.overview);
				setDailyLimit(Boolean(r.body.dailyLimit));
			}
		}, 1e4);
		return () => clearInterval(id);
	}, [
		active,
		seriesSlug,
		episode
	]);
	const options = (step, only) => step === "voices" ? {
		voices,
		ttsModel,
		langs
	} : step === "keyframes" ? { imageQuality: quality } : only ? { only } : {};
	/** Önce tutarı sunucudan öğrenir (409), sonra kullanıcı onayı ister. */
	const ask = async (step, only) => {
		setBusy(true);
		const r = await call("start", {
			...base,
			step,
			expectedCredits: -1,
			...options(step, only)
		});
		setBusy(false);
		if (r.status === 409 && typeof r.body.credits === "number") setConfirm({
			step,
			credits: r.body.credits,
			only
		});
		else toast.error(r.body.error ?? tr("Başlatılamadı", "Could not start"));
	};
	const start = async () => {
		if (!confirm) return;
		setBusy(true);
		const r = await call("start", {
			...base,
			step: confirm.step,
			expectedCredits: confirm.credits,
			...options(confirm.step, confirm.only)
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
	const retry = async (job) => {
		if (!window.confirm(tr(`${job.item_key} yeniden üretilsin mi? (${job.credits} kredi)`, `Regenerate ${job.item_key}? (${job.credits} credits)`))) return;
		const r = await call("retry", {
			...base,
			kind: job.kind,
			itemKey: job.item_key
		});
		if (!r.ok) toast.error(r.body.error ?? "Hata");
		await load();
	};
	const stop = async () => {
		await call("cancel", base);
		toast.info(tr("Sıradaki işler durduruldu. Runway'de başlamış olanlar tamamlanacak.", "Queued jobs stopped. Jobs already running will finish."));
		await load();
	};
	const uploadReference = async (file) => {
		if (!ov) return;
		if (file.size > 15 * 1024 * 1024) {
			toast.error(tr("Fotoğraf 15 MB'tan küçük olmalı", "Photo must be under 15 MB"));
			return;
		}
		setBusy(true);
		const { error: upErr } = await supabase.storage.from("videos").upload(ov.referencePath, file, {
			upsert: true,
			contentType: file.type
		});
		setBusy(false);
		if (upErr) toast.error(upErr.message);
		else {
			toast.success(tr("Başrol fotoğrafı yüklendi", "Lead photo uploaded"));
			await load();
		}
	};
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 rounded-2xl bg-destructive/15 p-4 text-sm text-destructive",
		children: error
	});
	if (!ov) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, { className: "h-6 w-6 animate-spin" })
	});
	const step = (name) => ov.steps.find((s) => s.step === name);
	const jobsOf = (kind) => ov.jobs.filter((j) => j.kind === kind);
	const failed = ov.jobs.filter((j) => j.status === "FAILED" || j.status === "CANCELED");
	const allFrames = step("keyframes").succeeded === step("keyframes").total;
	const animated = new Set(jobsOf("clip").filter((j) => j.status === "SUCCEEDED" || ACTIVE.includes(j.status)).map((j) => j.item_key));
	const anyVoiceLang = ov.langs.some((l) => jobsOf("voice").filter((j) => j.lang === l && j.status === "SUCCEEDED").length === ov.lines.length);
	const renderStep = ({ name, icon, title, desc, disabled, children }) => {
		const s = step(name);
		const done = s.succeeded === s.total;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "flex items-center gap-2 font-bold",
						children: [
							icon,
							" ",
							title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: desc
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${done ? "bg-primary/20 text-primary" : "bg-secondary"}`,
						children: [
							s.succeeded,
							"/",
							s.total
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1.5 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-neon transition-all",
						style: { width: `${s.succeeded / s.total * 100}%` }
					})
				}),
				s.inFlight > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-center gap-1.5 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, { className: "h-3.5 w-3.5 animate-spin" }),
						" ",
						tr(`${s.inFlight} iş üretiliyor`, `${s.inFlight} jobs in progress`)
					]
				}),
				children,
				!done && s.inFlight === 0 && (disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: disabled
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy,
					onClick: () => void ask(name),
					className: "mt-3 rounded-full bg-neon px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50",
					children: [s.succeeded ? tr("Kalanları üret", "Generate the rest") : tr("Üret", "Generate"), name === "keyframes" ? ` · ≈${quality === "high" ? (s.total - s.succeeded) * 8 : s.nextCredits} ${tr("kredi", "credits")}` : name === "clips" ? ` · ≈${s.nextCredits} ${tr("kredi", "credits")}` : ""]
				}))
			]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-4 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-bold",
						children: [
							"The Human Code: 2300 · ",
							tr("Bölüm", "Episode"),
							" ",
							episode,
							": ",
							ov.title[lang] ?? ov.title["tr"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							ov.clips.length,
							" ",
							tr("klip", "clips"),
							" · ",
							ov.lines.length,
							" ",
							tr("replik", "lines"),
							" ·",
							" ",
							ov.langs.length,
							" ",
							tr("dil", "languages"),
							" · ",
							ov.durationSec / 60,
							" ",
							tr("dakika", "minutes")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: ov.runwayConfigured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							tr("Runway kredisi", "Runway credits"),
							": ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: ov.creditBalance ?? "?" })
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-destructive",
							children: tr("RUNWAY_API_KEY Supabase'e eklenmemiş.", "RUNWAY_API_KEY is not set in Supabase.")
						})
					}),
					active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void stop(),
						className: "mt-3 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3.5 w-3.5" }),
							" ",
							tr("Sıradakileri durdur", "Stop queued jobs")
						]
					}),
					dailyLimit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-xl bg-secondary p-3 text-xs",
						children: tr("Runway'in günlük üretim sınırına ulaşıldı. Kalan işler sırada bekliyor; yarın bu sayfayı açtığınızda kaldığı yerden devam eder.", "Runway's daily generation limit was reached. Remaining jobs wait in the queue and resume when you open this page tomorrow.")
					})
				]
			}),
			confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "alertdialog",
				className: "rounded-2xl border-2 border-primary bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold",
					children: [tr(`Bu adım yaklaşık ${confirm.credits} Runway kredisi harcayacak.`, `This step will spend about ${confirm.credits} Runway credits.`), ov.creditBalance !== null && tr(` Bakiye: ${ov.creditBalance}.`, ` Balance: ${ov.creditBalance}.`)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						onClick: () => void start(),
						className: "rounded-full bg-neon px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50",
						children: tr("Onayla ve başlat", "Confirm and start")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setConfirm(null),
						className: "rounded-full bg-secondary px-4 py-2 text-sm font-semibold",
						children: tr("Vazgeç", "Cancel")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "flex items-center gap-2 font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }),
							" ",
							tr("0. Başrol fotoğrafı", "0. Lead photo")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: tr("AyShe'nin yüzü bu fotoğraftan alınır. Yüzün net ve önden göründüğü, iyi ışıklı bir fotoğraf seçin.", "AyShe's face comes from this photo. Choose a sharp, well-lit, front-facing photo.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-3",
						children: [
							refUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: refUrl,
								alt: "",
								className: "h-20 w-20 rounded-xl object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-20 w-20 place-items-center rounded-xl bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6 text-muted-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: busy,
								onClick: () => fileRef.current?.click(),
								className: "rounded-full bg-secondary px-4 py-2 text-sm font-semibold",
								children: ov.hasReference ? tr("Değiştir", "Replace") : tr("Fotoğraf yükle", "Upload photo")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/jpeg,image/png,image/webp",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									e.target.value = "";
									if (f) uploadReference(f);
								}
							})
						]
					})
				]
			}),
			renderStep({
				name: "keyframes",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }),
				title: tr("1. Başlangıç kareleri", "1. Keyframes"),
				desc: tr("Her sahnenin görseli yüzünüz referans alınarak üretilir. Birleştirmede kamera hareketiyle canlanır. Beğenmediğiniz kareyi yeniden üretebilir, istediğinizi gerçek videoya çevirebilirsiniz.", "Each scene's image uses your face as reference and comes alive with camera motion when assembled. Regenerate any frame, or turn selected ones into real video."),
				disabled: !ov.hasReference ? tr("Önce başrol fotoğrafını yükleyin.", "Upload the lead photo first.") : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					role: "radiogroup",
					"aria-label": tr("Görsel kalitesi", "Image quality"),
					children: [["economy", tr("Ekonomik · 2-5 kredi/kare", "Economy · 2-5 credits/frame")], ["high", tr("Yüksek · 8 kredi/kare", "High · 8 credits/frame")]].map(([q, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						role: "radio",
						"aria-checked": quality === q,
						onClick: () => setQuality(q),
						className: `rounded-full px-3 py-1 text-xs font-semibold ${quality === q ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`,
						children: label
					}, q))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumbs, {
					jobs: jobsOf("keyframe"),
					clips: ov.clips,
					kind: "image",
					onRetry: retry,
					onAnimate: (key) => void ask("clips", [key]),
					animated
				})] })
			}),
			renderStep({
				name: "clips",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-4 w-4" }),
				title: tr("2. Gerçek video (isteğe bağlı)", "2. Real video (optional)"),
				desc: tr("Gerekli değil: Videosu olmayan sahneler kamera hareketiyle canlanır. Önemli anları karelerdeki film düğmesiyle tek tek videoya çevirebilirsiniz (saniyesi 5 kredi).", "Optional: scenes without video come alive with camera motion. Turn key moments into video one by one with the film button on a frame (5 credits per second)."),
				disabled: step("keyframes").succeeded === 0 ? tr("Önce kareleri üretin.", "Generate keyframes first.") : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumbs, {
					jobs: jobsOf("clip"),
					clips: ov.clips,
					kind: "video",
					onRetry: retry
				}) })
			}),
			renderStep({
				name: "voices",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" }),
				title: tr("3. Seslendirme (8 dil)", "3. Voice-over (8 languages)"),
				desc: tr("Her karakter tüm dillerde aynı sesle konuşur. Sesleri dev.runwayml.com'da dinleyip seçebilirsiniz.", "Each character keeps the same voice in every language. Preview voices on dev.runwayml.com."),
				disabled: void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2 sm:grid-cols-2",
						children: [Object.entries(ov.speakers).map(([id, sp]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sp.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: voices[id] ?? sp.defaultVoice,
								onChange: (e) => setVoices({
									...voices,
									[id]: e.target.value
								}),
								className: "rounded-xl border bg-background px-2 py-1 text-sm",
								children: ov.voicePresets.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: v }, v))
							})]
						}, id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tr("Model", "Model") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: ttsModel,
								onChange: (e) => setTtsModel(e.target.value),
								className: "rounded-xl border bg-background px-2 py-1 text-sm",
								children: ov.ttsModels.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m,
									children: m === "eleven_v3" ? tr("eleven_v3 (duygulu)", "eleven_v3 (expressive)") : m
								}, m))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: ov.langs.map((l) => {
							const n = jobsOf("voice").filter((j) => j.lang === l && j.status === "SUCCEEDED").length;
							const on = langs.includes(l);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setLangs(on ? langs.filter((x) => x !== l) : [...langs, l]),
								className: `rounded-full px-3 py-1 text-xs font-semibold ${on ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`,
								children: [
									n === ov.lines.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 inline h-3 w-3" }),
									LANG_LABEL[l] ?? l,
									" ",
									n,
									"/",
									ov.lines.length
								]
							}, l);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoicePreview, {
						jobs: jobsOf("voice"),
						lines: ov.lines,
						langs: ov.langs
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "flex items-center gap-2 font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Combine, { className: "h-4 w-4" }),
							" ",
							tr("4. Birleştir ve yayınla", "4. Assemble and publish")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: tr("Klipler tek videoda, replikler her dil için ayrı ses parçasında birleştirilir; altyazılar otomatik oluşur ve bölüm uygulamada izlenebilir olur.", "Clips are joined into one video, lines into one audio track per language; subtitles are generated and the episode goes live in the app.")
					}),
					allFrames && anyVoiceLang ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-3 list-decimal space-y-1 pl-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: ASSEMBLE_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "font-semibold text-primary underline",
								children: tr("GitHub'da birleştirme sayfasını açın", "Open the assemble page on GitHub")
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("Sağdaki \"Run workflow\" → yeşil \"Run workflow\" düğmesine basın.", "Click \"Run workflow\" → the green \"Run workflow\" button.") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("Yaklaşık 5 dakika sonra bölüm uygulamada izlenebilir.", "In about 5 minutes the episode is watchable in the app.") })
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: tr("Tüm kareler ve en az bir dilin sesleri hazır olunca açılır.", "Available once all frames and at least one language's voices are ready.")
					})
				]
			}),
			failed.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-destructive/40 bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "flex items-center gap-2 font-bold text-destructive",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
						" ",
						tr("Başarısız işler", "Failed jobs")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2 text-xs",
					children: failed.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: j.item_key }),
							" — ",
							j.failure
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void retry(j),
							className: "flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), j.credits]
						})]
					}, j.id))
				})]
			})
		]
	});
}
function Thumbs({ jobs, clips, kind, onRetry, onAnimate, animated }) {
	if (!jobs.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5",
		children: clips.map((c) => {
			const j = jobs.find((x) => x.item_key === c.key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video overflow-hidden rounded-lg bg-secondary text-[10px]",
				children: [
					j?.url && kind === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: j.url,
						alt: c.key,
						className: "h-full w-full object-cover"
					}),
					j?.url && kind === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: j.url,
						muted: true,
						loop: true,
						playsInline: true,
						onMouseEnter: (e) => void e.currentTarget.play(),
						onMouseLeave: (e) => e.currentTarget.pause(),
						controls: true,
						className: "h-full w-full object-cover"
					}),
					j && ACTIVE.includes(j.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, { className: "h-4 w-4 animate-spin" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-1 top-1 rounded bg-background/80 px-1",
						children: c.key
					}),
					j?.status === "SUCCEEDED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						title: "Yeniden üret",
						onClick: () => onRetry(j),
						className: "absolute right-1 top-1 rounded bg-background/80 p-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" })
					}),
					onAnimate && j?.status === "SUCCEEDED" && !animated?.has(c.key) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						title: `Videoya çevir (${c.duration * 5} kredi)`,
						"aria-label": `${c.key} videoya çevir`,
						onClick: () => onAnimate(c.key),
						className: "absolute bottom-1 right-1 rounded bg-background/80 p-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-3 w-3" })
					})
				]
			}, c.key);
		})
	});
}
function VoicePreview({ jobs, lines, langs }) {
	const [lang, setLang] = (0, import_react.useState)("tr");
	const own = jobs.filter((j) => j.lang === lang && j.url);
	if (!jobs.some((j) => j.url)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
				className: "cursor-pointer text-xs font-semibold",
				children: "Sesleri dinle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: lang,
				onChange: (e) => setLang(e.target.value),
				className: "mt-2 rounded-xl border bg-background px-2 py-1 text-xs",
				children: langs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: l,
					children: LANG_LABEL[l] ?? l
				}, l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1.5",
				children: lines.map((l) => {
					const j = own.find((x) => x.item_key === `${lang}:${l.key}`);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: l.key
							}),
							" ",
							l.text,
							j?.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
								src: j.url,
								controls: true,
								preload: "none",
								className: "mt-1 h-8 w-full"
							})
						]
					}, l.key);
				})
			})
		]
	});
}
/** Videonun süresini (saniye) dosyadan okur. */
function readDuration(file) {
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
function FileButton({ label, onFile, accept }) {
	const ref = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => ref.current?.click(),
		className: "flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-3.5 w-3.5" }),
			" ",
			label
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref,
		type: "file",
		accept,
		className: "hidden",
		onChange: (e) => {
			const f = e.target.files?.[0];
			e.target.value = "";
			if (f) onFile(f);
		}
	})] });
}
function Episodes({ s }) {
	const { data: eps } = useSuspenseQuery(episodeListQuery(s.id, s.slug));
	const qc = useQueryClient();
	const { t } = useT();
	const refresh = () => {
		qc.invalidateQueries({ queryKey: ["episodes", s.id] });
		qc.invalidateQueries({ queryKey: ["series"] });
	};
	const uploadVideo = async (e, file) => {
		const path = `${s.slug}/e${e.n}.mp4`;
		const { error } = await supabase.storage.from("videos").upload(path, file, {
			upsert: true,
			contentType: file.type
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		const dur = await readDuration(file);
		const { error: ue } = await supabase.from("episodes").update({
			video_url: path,
			status: "ready",
			duration_sec: dur
		}).eq("id", e.id);
		if (ue) {
			toast.error(ue.message);
			return;
		}
		toast.success(t("saved"));
		refresh();
	};
	const setStatus = async (e, status) => {
		const { error } = await supabase.from("episodes").update({ status }).eq("id", e.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(t("saved"));
		refresh();
	};
	const uploadTrack = async (e, kind, lang, file) => {
		const path = `${s.slug}/e${e.n}.${kind}.${lang}.${file.name.split(".").pop() || "bin"}`;
		const { error } = await supabase.storage.from("videos").upload(path, file, {
			upsert: true,
			contentType: file.type
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		const { error: te } = await supabase.from("tracks").upsert({
			episode_id: e.id,
			kind,
			lang,
			status: "ready",
			url: path
		}, { onConflict: "episode_id,kind,lang" });
		if (te) {
			toast.error(te.message);
			return;
		}
		toast.success(t("saved"));
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 space-y-3",
		children: eps.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-2xl bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold",
						children: [
							t("episode"),
							" ",
							e.n,
							e.titles.find((x) => x.lang === "tr") ? `: ${e.titles.find((x) => x.lang === "tr").title}` : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							e.video_url ? e.video_url : t("no_video_yet"),
							" ",
							e.duration_sec ? `· ${e.duration_sec} sn` : ""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${e.status === "ready" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`,
					children: e.status === "ready" ? t("status_ready") : t("status_draft")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileButton, {
						label: t("video_file"),
						accept: "video/*",
						onFile: (f) => void uploadVideo(e, f)
					}),
					e.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => void setStatus(e, "draft"),
						className: "rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold",
						children: t("mark_draft")
					}) : e.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void setStatus(e, "ready"),
						className: "flex items-center gap-1 rounded-full bg-neon px-3 py-1.5 text-xs font-bold text-primary-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }),
							" ",
							t("mark_ready")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileButton, {
						label: `${t("audio_track")} · TR`,
						accept: "audio/*",
						onFile: (f) => void uploadTrack(e, "audio", "tr", f)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileButton, {
						label: `${t("sub_track")} · TR`,
						accept: ".vtt,.srt",
						onFile: (f) => void uploadTrack(e, "subs", "tr", f)
					})
				]
			})]
		}, e.id))
	});
}
function SeriesAdmin({ s }) {
	const { t } = useT();
	const qc = useQueryClient();
	const [title, setTitle] = (0, import_react.useState)(s.title);
	const saveTitle = async () => {
		const { error } = await supabase.from("series").update({ title }).eq("id", s.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(t("saved"));
		qc.invalidateQueries({ queryKey: ["series"] });
	};
	const setStatus = async (status) => {
		const { error } = await supabase.from("series").update({ status }).eq("id", s.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(t("saved"));
		qc.invalidateQueries({ queryKey: ["series"] });
	};
	const uploadPoster = async (file) => {
		const ext = file.name.split(".").pop() || "jpg";
		const path = `${s.slug}.${ext}`;
		const { error } = await supabase.storage.from("posters").upload(path, file, {
			upsert: true,
			contentType: file.type
		});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-2xl bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					s.slug,
					" · ",
					t(`cat_${s.category}`),
					" · ",
					s.status === "published" ? t("status_ready") : t("status_draft")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: saveTitle,
						className: "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground",
						children: t("save")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileButton, {
						label: t("poster_file"),
						accept: "image/*",
						onFile: (f) => void uploadPoster(f)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => void setStatus(s.status === "published" ? "draft" : "published"),
						className: "rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold",
						children: s.status === "published" ? t("mark_draft") : t("mark_ready")
					})
				]
			})
		]
	});
}
function Users() {
	const { t } = useT();
	const qc = useQueryClient();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const load = async () => {
		const { data, error } = await supabase.from("profiles").select("user_id,email,display_name,tokens").order("tokens", { ascending: false }).limit(100);
		if (error) {
			toast.error(error.message);
			return;
		}
		setRows(data ?? []);
		setLoaded(true);
	};
	const addTokens = async (user_id, n) => {
		const row = rows.find((r) => r.user_id === user_id);
		if (!row) return;
		const { error } = await supabase.from("profiles").update({ tokens: row.tokens + n }).eq("user_id", user_id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(t("added_tokens", { n }));
		qc.invalidateQueries({ queryKey: ["profile"] });
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [!loaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: load,
			className: "rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground",
			children: t("users_tab")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-3 rounded-2xl bg-card p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-semibold",
						children: r.email || r.display_name || r.user_id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [r.tokens, " jeton"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void addTokens(r.user_id, 50),
					className: "flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " 50"]
				})]
			}, r.user_id))
		})]
	});
}
var RUNWAY_MODELS = [
	"gen4.5",
	"gen4_turbo",
	"gen3_alpha"
];
function RunwayGenerate() {
	const { t } = useT();
	const qc = useQueryClient();
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)("gen4.5");
	const [duration, setDuration] = (0, import_react.useState)(5);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [gens, setGens] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const loadGens = async () => {
		const { data, error } = await supabase.from("video_generations").select("id,episode_id,runway_task_id,status,model,prompt_text,duration_sec,output_url,saved_to_storage,failure_reason,created_at").order("created_at", { ascending: false }).limit(20);
		if (error) {
			toast.error(error.message);
			return;
		}
		setGens(data ?? []);
		setLoaded(true);
	};
	const generate = async () => {
		if (!prompt.trim()) {
			toast.error(t("gen_prompt"));
			return;
		}
		setBusy(true);
		try {
			const apiUrl = `undefined/functions/v1/runway-generate`;
			const { data: sessionData } = await supabase.auth.getSession();
			const resp = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${sessionData.session?.access_token}`
				},
				body: JSON.stringify({
					action: "generate",
					episodeId: null,
					promptText: prompt.trim(),
					model,
					duration,
					ratio: "1280:720"
				})
			});
			const result = await resp.json();
			if (!resp.ok) {
				toast.error(result.error || "Runway API error");
				return;
			}
			toast.success(t("gen_status_pending") + ": " + result.taskId);
			setPrompt("");
			loadGens();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Network error");
		} finally {
			setBusy(false);
		}
	};
	const checkStatus = async (taskId) => {
		const apiUrl = `undefined/functions/v1/runway-generate`;
		const { data: sessionData } = await supabase.auth.getSession();
		try {
			const resp = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${sessionData.session?.access_token}`
				},
				body: JSON.stringify({
					action: "status",
					taskId
				})
			});
			const result = await resp.json();
			if (!resp.ok) {
				toast.error(result.error || "Status check failed");
				return;
			}
			if (result.status === "SUCCEEDED") toast.success(t("gen_status_succeeded"));
			else if (result.status === "FAILED") toast.error(t("gen_status_failed") + ": " + (result.failure || ""));
			else toast.info(result.status);
			loadGens();
			qc.invalidateQueries({ queryKey: ["episodes"] });
			qc.invalidateQueries({ queryKey: ["series"] });
		} catch {
			toast.error("Network error");
		}
	};
	const statusLabel = (s) => {
		if (s === "PENDING" || s === "THROTTLING") return t("gen_status_pending");
		if (s === "RUNNING") return t("gen_status_running");
		if (s === "SUCCEEDED") return t("gen_status_succeeded");
		return t("gen_status_failed");
	};
	const statusColor = (s) => {
		if (s === "SUCCEEDED") return "bg-primary/20 text-primary";
		if (s === "FAILED" || s === "CANCELED") return "bg-destructive/20 text-destructive";
		return "bg-secondary text-muted-foreground";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold",
					children: t("gen_title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: t("gen_sub")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground italic",
					children: t("gen_star_desc")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-3 block text-xs font-semibold",
					children: t("gen_prompt")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: prompt,
					onChange: (e) => setPrompt(e.target.value),
					placeholder: t("gen_prompt_ph"),
					rows: 3,
					className: "mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold",
						children: t("gen_model")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: model,
						onChange: (e) => setModel(e.target.value),
						className: "mt-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
						children: RUNWAY_MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m,
							children: m
						}, m))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold",
						children: t("gen_duration")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: duration,
						onChange: (e) => setDuration(Number(e.target.value)),
						className: "mt-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
						children: [5, 10].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d,
							children: d
						}, d))
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void generate(),
					disabled: busy,
					className: "mt-3 flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), busy ? t("gen_generating") : t("gen_button")]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold",
						children: t("gen_history")
					}), !loaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => void loadGens(),
						className: "rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold",
						children: t("gen_history")
					})]
				}),
				!loaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: t("gen_no_history")
				}),
				loaded && gens.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: t("gen_no_history")
				}),
				gens.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: gens.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-background/50 p-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor(g.status)}`,
									children: statusLabel(g.status)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										g.model,
										" · ",
										g.duration_sec,
										"sn"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 line-clamp-2 text-muted-foreground",
								children: g.prompt_text
							}),
							g.failure_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-destructive",
								children: g.failure_reason
							}),
							g.saved_to_storage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-primary",
								children: ["✓ ", t("status_ready")]
							}),
							(g.status === "PENDING" || g.status === "THROTTLING" || g.status === "RUNNING") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void checkStatus(g.runway_task_id),
								className: "mt-2 flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, { className: "h-3 w-3" }),
									" ",
									t("gen_check")
								]
							})
						]
					}, g.id))
				})
			]
		})]
	});
}
function AdminBody() {
	const { data: all } = useSuspenseQuery(seriesListQuery);
	const { t, lang } = useT();
	const [tab, setTab] = (0, import_react.useState)("series");
	const [pick, setPick] = (0, import_react.useState)(all[0]?.id ?? "");
	const s = all.find((x) => x.id === pick) ?? all[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-xl font-bold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-5 w-5 text-neon" }),
					" ",
					t("admin_title")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					"series",
					"episodes",
					"production",
					"generate",
					"users"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(k),
					className: `rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? "bg-neon text-primary-foreground shadow-neon" : "bg-secondary text-muted-foreground"}`,
					children: k === "production" ? lang === "tr" ? "Bölüm Üretimi" : "Episode Production" : t(`${k}_tab`)
				}, k))
			}),
			tab === "series" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: all.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeriesAdmin, { s: x }, x.id))
			}),
			tab === "episodes" && s && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: pick,
					onChange: (e) => setPick(e.target.value),
					className: "w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary",
					children: all.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: x.id,
						children: x.title
					}, x.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Episodes, { s }, s.id)]
			}),
			tab === "production" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductionPanel, {}),
			tab === "generate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunwayGenerate, {}),
			tab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {})
		]
	});
}
function Admin() {
	const { user, isAdmin, ready } = useAppState();
	const { t } = useT();
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-5 pt-10 text-sm text-muted-foreground",
		children: t("loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("admin_no")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "/giris",
			className: "mt-4 inline-block rounded-full bg-neon px-5 py-2.5 text-sm font-bold text-primary-foreground",
			children: t("sign_in")
		})]
	}) });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("admin_no")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "/",
			className: "mt-4 inline-block rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold",
			children: t("nav_home")
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminBody, {}) });
}
//#endregion
export { Admin as component };
