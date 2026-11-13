import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Capacitor } from "../_libs/@capacitor-community/admob+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Chromium, P as ArrowLeft, g as Lock, m as Mail, n as User } from "../_libs/lucide-react.mjs";
import { c as useAppState, l as useT, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/giris-DdS83Y6B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Auth() {
	const { t } = useT();
	const nav = useNavigate();
	const { signIn, signUp, signInGoogle, user } = useAppState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("welcome")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 break-all font-bold",
				children: user.email
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-block rounded-full bg-neon px-6 py-3 text-sm font-bold text-primary-foreground shadow-neon",
				children: t("nav_home")
			})
		]
	}) });
	const submit = async () => {
		if (!email.trim() || !password) {
			toast.error(t("fill_fields"));
			return;
		}
		if (mode === "up" && password.length < 6) {
			toast.error(t("weak_pass"));
			return;
		}
		setBusy(true);
		const err = mode === "in" ? await signIn(email.trim(), password) : await signUp(email.trim(), password, name.trim());
		setBusy(false);
		if (err) {
			toast.error(err);
			return;
		}
		if (mode === "up") toast.info(t("email_sent"));
		nav({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-3 px-5 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "rounded-full glass p-2",
				"aria-label": t("back"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5 rtl:rotate-180" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: t("auth_title")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("auth_sub")
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-5 mt-6 space-y-3 rounded-3xl bg-card p-5",
			children: [
				mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-muted-foreground",
						children: t("your_name")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-2 rounded-2xl border bg-background px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full bg-transparent py-3 text-sm outline-none",
							placeholder: "Örn: Kaptan Nova"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-muted-foreground",
						children: t("email")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-2 rounded-2xl border bg-background px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: email,
							onChange: (e) => setEmail(e.target.value),
							type: "email",
							autoComplete: "email",
							className: "w-full bg-transparent py-3 text-sm outline-none",
							placeholder: "ornek@eposta.com"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-muted-foreground",
						children: t("password")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-2 rounded-2xl border bg-background px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: password,
							onChange: (e) => setPassword(e.target.value),
							type: "password",
							autoComplete: mode === "in" ? "current-password" : "new-password",
							className: "w-full bg-transparent py-3 text-sm outline-none",
							placeholder: "••••••"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: submit,
					disabled: busy,
					className: "w-full rounded-full bg-neon py-3.5 text-sm font-bold text-primary-foreground shadow-neon disabled:opacity-60",
					children: busy ? t("loading") : mode === "in" ? t("sign_in") : t("sign_up")
				}),
				!Capacitor.isNativePlatform() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: async () => {
						const err = await signInGoogle();
						if (err) toast.error(err);
					},
					className: "flex w-full items-center justify-center gap-2 rounded-full border bg-background py-3 text-sm font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chromium, { className: "h-4 w-4" }),
						" ",
						t("continue_google")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pt-1 text-center text-sm text-muted-foreground",
					children: [
						mode === "in" ? t("no_account") : t("have_account"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode(mode === "in" ? "up" : "in"),
							className: "font-bold text-primary",
							children: mode === "in" ? t("sign_up") : t("sign_in")
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-5 mt-4 text-center text-[11px] text-muted-foreground",
			children: t("guest_note")
		})
	] });
}
//#endregion
export { Auth as component };
