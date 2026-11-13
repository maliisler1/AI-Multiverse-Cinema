import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Capacitor } from "../_libs/@capacitor-community/admob+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Share, d as Play, l as RotateCcw } from "../_libs/lucide-react.mjs";
import { l as useT, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Share$1 } from "../_libs/capacitor__share.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kapsul-DOjjcV5T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ARCHETYPES = [
	"explorer",
	"guardian",
	"sage",
	"healer"
];
/** Her sorunun i. cevabı ARCHETYPES[i] tipine puan verir. */
var QUESTIONS = [
	{
		q: {
			tr: "Dünya'nın son günü. Yanına tek bir şey alabilirsin:",
			en: "Earth's last day. You can take one thing:"
		},
		options: [
			{
				tr: "Bir harita",
				en: "A map"
			},
			{
				tr: "Ailemin fotoğrafı",
				en: "My family's photo"
			},
			{
				tr: "Bir kitap",
				en: "A book"
			},
			{
				tr: "Bir avuç toprak ve tohum",
				en: "A handful of soil and seeds"
			}
		]
	},
	{
		q: {
			tr: "Kapsülün açıldı, etraf karanlık. İlk ne yaparsın?",
			en: "Your capsule opens, it's dark. What do you do first?"
		},
		options: [
			{
				tr: "Işığa doğru yürürüm",
				en: "Walk toward the light"
			},
			{
				tr: "Diğer kapsülleri kontrol ederim",
				en: "Check the other capsules"
			},
			{
				tr: "Durup sesleri dinlerim",
				en: "Stop and listen"
			},
			{
				tr: "Yaralı var mı diye bakarım",
				en: "Look for anyone injured"
			}
		]
	},
	{
		q: {
			tr: "Maskeli bir yabancı yardım teklif ediyor:",
			en: "A masked stranger offers help:"
		},
		options: [
			{
				tr: "Peşinden giderim, risk alırım",
				en: "I follow, I take the risk"
			},
			{
				tr: "Önce grubumu korurum",
				en: "I protect my group first"
			},
			{
				tr: "Ona sorular sorarım",
				en: "I ask questions"
			},
			{
				tr: "Elini tutarım, belki o da korkuyordur",
				en: "I take its hand — maybe it's scared too"
			}
		]
	},
	{
		q: {
			tr: "Yeni gezegende ilk görevin ne olsun?",
			en: "Your first job on the new planet?"
		},
		options: [
			{
				tr: "Bilinmeyen toprakları keşfetmek",
				en: "Explore unknown lands"
			},
			{
				tr: "Herkes için güvenli bir kamp kurmak",
				en: "Build a safe camp for all"
			},
			{
				tr: "Uzaylıların dilini çözmek",
				en: "Decode the aliens' language"
			},
			{
				tr: "İlk bahçeyi ekmek",
				en: "Plant the first garden"
			}
		]
	},
	{
		q: {
			tr: "İnsanlığı kurtaracak olan nedir?",
			en: "What will save humanity?"
		},
		options: [
			{
				tr: "Cesaret",
				en: "Courage"
			},
			{
				tr: "Sadakat",
				en: "Loyalty"
			},
			{
				tr: "Bilgi",
				en: "Knowledge"
			},
			{
				tr: "Umut",
				en: "Hope"
			}
		]
	}
];
var ARCHETYPE_TEXT = {
	explorer: {
		name: {
			tr: "Kâşif",
			en: "Explorer"
		},
		desc: {
			tr: "Yeni gezegene ilk adımı sen atacaksın.",
			en: "You'll take the first step on the new world."
		}
	},
	guardian: {
		name: {
			tr: "Koruyucu",
			en: "Guardian"
		},
		desc: {
			tr: "Leon gibi: önce başkalarını düşünürsün.",
			en: "Like Leon: you put others first."
		}
	},
	sage: {
		name: {
			tr: "Bilge",
			en: "Sage"
		},
		desc: {
			tr: "Taran'ın sırlarını çözecek olan sensin.",
			en: "You're the one who'll crack Taran's secrets."
		}
	},
	healer: {
		name: {
			tr: "Şifacı",
			en: "Healer"
		},
		desc: {
			tr: "İnsanlığın yaralarını sen saracaksın.",
			en: "You'll heal humanity's wounds."
		}
	}
};
function computeCapsule(answers) {
	if (answers.length !== QUESTIONS.length || answers.some((a) => !Number.isInteger(a) || a < 0 || a > 3)) throw new Error("invalid answers");
	const counts = [
		0,
		0,
		0,
		0
	];
	for (const a of answers) counts[a]++;
	const max = Math.max(...counts);
	const last = answers[answers.length - 1];
	const archetype = ARCHETYPES[counts[last] === max ? last : counts.indexOf(max)];
	const code = answers.reduce((acc, a, i) => acc + a * 4 ** i, 0);
	return {
		capsule: code % 47 === 0 ? 23 : (code * 7 + 3) % 22 + 1,
		archetype
	};
}
function pick(lang, l) {
	return lang === "tr" ? l.tr : l.en;
}
function capsuleTitle(lang, capsule) {
	if (capsule === 23) return lang === "tr" ? "AyShe'nin kapsülü!" : "AyShe's capsule!";
	if (capsule === 7) return lang === "tr" ? "Leon'un kapsülü!" : "Leon's capsule!";
	return lang === "tr" ? `Kapsül ${capsule}` : `Capsule ${capsule}`;
}
function shareText(lang, r) {
	const type = pick(lang, ARCHETYPE_TEXT[r.archetype].name);
	return lang === "tr" ? `Dünya'nın sonundan kurtarılan 23 kişiden biriyim: Kapsül ${r.capsule} · ${type} 🚀 Seninki kaç? The Human Code: 2300` : `I'm one of the 23 saved from Earth's end: Capsule ${r.capsule} · ${type} 🚀 What's yours? The Human Code: 2300`;
}
var KEY = "amc-capsule";
function loadCapsule() {
	try {
		const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
		return v && typeof v.capsule === "number" && v.archetype in ARCHETYPE_TEXT ? v : null;
	} catch {
		return null;
	}
}
function saveCapsule(r) {
	try {
		localStorage.setItem(KEY, JSON.stringify(r));
	} catch {}
}
async function shareResult(text, lang) {
	try {
		if (Capacitor.isNativePlatform()) {
			await Share$1.share({
				text,
				dialogTitle: "The Human Code: 2300"
			});
			return;
		}
		if (navigator.share) {
			await navigator.share({ text });
			return;
		}
		await navigator.clipboard.writeText(text);
		toast.success(lang === "tr" ? "Kopyalandı, istediğin yere yapıştır." : "Copied — paste it anywhere.");
	} catch {}
}
function CapsuleQuiz() {
	const { lang } = useT();
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [result, setResult] = (0, import_react.useState)(() => loadCapsule());
	function answer(i) {
		const next = [...answers, i];
		if (next.length < QUESTIONS.length) {
			setAnswers(next);
			return;
		}
		const r = computeCapsule(next);
		saveCapsule(r);
		setResult(r);
		setAnswers([]);
	}
	if (result) {
		const a = ARCHETYPE_TEXT[result.archetype];
		const rare = result.capsule === 23;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pt-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: lang === "tr" ? "Senin kapsülün" : "Your capsule"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-full border-4 ${rare ? "border-gold shadow-[0_0_40px_rgba(234,179,8,.6)]" : "border-primary shadow-[0_0_30px_rgba(45,212,191,.45)]"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-6xl font-black",
						children: result.capsule
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-2xl font-bold",
					children: capsuleTitle(lang, result.capsule)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-lg font-semibold text-primary",
					children: pick(lang, a.name)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: pick(lang, a.desc)
				}),
				rare && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm font-semibold text-gold",
					children: lang === "tr" ? "Çok nadir! Kullanıcıların yalnızca %2'si bu kapsülü alıyor." : "Very rare! Only 2% of people get this capsule."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void shareResult(shareText(lang, result), lang),
					className: "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "h-4 w-4" }),
						" ",
						lang === "tr" ? "Arkadaşlarına sor: seninki kaç?" : "Ask friends: what's yours?"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }),
						" ",
						lang === "tr" ? "Hikâyeyi izle" : "Watch the story"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setResult(null),
					className: "mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }),
						" ",
						lang === "tr" ? "Testi tekrar çöz" : "Retake"
					]
				})
			]
		}) });
	}
	const q = QUESTIONS[answers.length];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					answers.length + 1,
					" / ",
					QUESTIONS.length
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-1 rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 rounded-full bg-primary transition-all",
					style: { width: `${answers.length / QUESTIONS.length * 100}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 text-xl font-bold",
				children: pick(lang, q.q)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-3",
				children: q.options.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => answer(i),
					className: "w-full rounded-2xl bg-card p-4 text-left text-sm font-medium active:scale-[.98]",
					children: pick(lang, o)
				}, i))
			})
		]
	}) });
}
//#endregion
export { CapsuleQuiz as component };
