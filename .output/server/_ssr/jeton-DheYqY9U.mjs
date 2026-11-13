import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { E as Crown, N as Check, l as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as TokenBadge, c as useAppState, l as useT, s as season, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jeton-DheYqY9U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SeasonShop() {
	const { state, update } = useAppState();
	const { t } = useT();
	const [price, setPrice] = (0, import_react.useState)(null);
	const [canBuy, setCanBuy] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let live = true;
		season.available().then((ok) => {
			if (live) setCanBuy(ok);
		});
		season.price().then((p) => {
			if (live) setPrice(p);
		});
		return () => {
			live = false;
		};
	}, []);
	const buy = async () => {
		setBusy(true);
		try {
			if (await season.buy()) {
				update((s) => ({
					...s,
					seasonOwned: true
				}));
				toast.success(t("season_thanks"));
			}
		} catch {
			toast.error(t("season_error"));
		} finally {
			setBusy(false);
		}
	};
	const restore = async () => {
		setBusy(true);
		const owned = await season.check();
		setBusy(false);
		if (owned === null) {
			toast.error(t("season_error"));
			return;
		}
		update((s) => ({
			...s,
			seasonOwned: owned
		}));
		if (owned) toast.success(t("season_restored"));
		else toast.info(t("season_none"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-5 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: t("season_title")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenBadge, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-5 mt-6 rounded-3xl border-2 border-primary bg-card p-5 shadow-neon",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-sm font-bold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4 text-gold" }),
						" The Human Code: 2300 · ",
						t("season_1")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-3xl font-bold text-gold",
					children: state.seasonOwned ? t("season_owned") : price ?? "5 USD"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: t("season_once")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: [
						"season_perk1",
						"season_perk2",
						"season_perk3",
						"season_perk4"
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" }), t(k)]
					}, k))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pt-6",
			children: [
				!state.seasonOwned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => void buy(),
					disabled: busy || canBuy !== true,
					className: "w-full rounded-full bg-neon py-4 text-sm font-bold text-primary-foreground shadow-neon disabled:opacity-60",
					children: busy ? "…" : t("season_buy")
				}),
				canBuy === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-xs text-muted-foreground",
					children: t("season_play_only")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void restore(),
					disabled: busy || canBuy !== true,
					className: "mx-auto mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground disabled:opacity-60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }),
						" ",
						t("season_restore")
					]
				})
			]
		})
	] });
}
//#endregion
export { SeasonShop as component };
