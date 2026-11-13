import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as TokenBadge, c as useAppState, i as LANG_NAMES, l as useT, r as LANGS, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ayarlar-CJAXEb9n.js
var import_jsx_runtime = require_jsx_runtime();
function Picker({ label, value, onChange, allowOff, offLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-2 w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary",
			children: [allowOff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "off",
				children: offLabel
			}), LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: l,
				children: LANG_NAMES[l]
			}, l))]
		})]
	});
}
function Settings() {
	const { state, update } = useAppState();
	const { t } = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-5 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: t("settings_title")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenBadge, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 px-5 text-sm text-muted-foreground",
			children: t("settings_note")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-5 px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picker, {
					label: t("ui_lang"),
					value: state.uiLang,
					onChange: (v) => update((s) => ({
						...s,
						uiLang: v,
						langChosen: true
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picker, {
					label: t("audio_lang"),
					value: state.audioLang,
					onChange: (v) => update((s) => ({
						...s,
						audioLang: v
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picker, {
					label: t("sub_lang"),
					value: state.subLang,
					allowOff: true,
					offLabel: t("sub_off"),
					onChange: (v) => update((s) => ({
						...s,
						subLang: v
					}))
				})
			]
		})
	] });
}
//#endregion
export { Settings as component };
