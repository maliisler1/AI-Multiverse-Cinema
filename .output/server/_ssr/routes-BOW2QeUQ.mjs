import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Orbit, k as Clapperboard, o as Sparkles, r as UserRound } from "../_libs/lucide-react.mjs";
import { l as useT, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { r as seriesListQuery } from "./catalog-BLKtVYzb.mjs";
import { n as SeriesView, t as BUNDLED_POSTERS } from "./SeriesView-UeIRlsRJ.mjs";
import { t as pickFeatured } from "./routes-DCenuwOj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BOW2QeUQ.js
var import_jsx_runtime = require_jsx_runtime();
/** Ana dizi: önce sabit slug, yoksa ilk yayımlanmış dizi, yoksa listedeki ilk dizi. */
/** Ana dizi dışında yalnızca yayımlanmış diziler gösterilir; yeni dizi yayımlanınca kendiliğinden belirir. */
function otherPublished(all, featured) {
	return all.filter((s) => s.id !== featured?.id && s.status === "published");
}
function Index() {
	const { data: all } = useSuspenseQuery(seriesListQuery);
	const { t } = useT();
	const featured = pickFeatured(all);
	if (!featured) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-5 pt-10 text-sm text-muted-foreground",
		children: t("loading")
	}) });
	const others = otherPublished(all, featured);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SeriesView, {
		id: featured.id,
		slug: featured.slug,
		home: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/kapsul",
				className: "mt-8 flex items-center gap-4 rounded-2xl border border-primary/40 bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orbit, { className: "h-9 w-9 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold",
					children: t("capsule_cta")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: t("capsule_cta_sub")
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold",
					children: t("extras")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold",
								children: t("extra_cast")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: t("coming_soon")
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold",
								children: t("extra_bts")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: t("coming_soon")
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-2xl border border-dashed p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-sm font-bold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-gold" }),
						" ",
						t("next_season")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: t("next_season_note")
				})]
			}),
			others.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold",
					children: t("more_series")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-3 overflow-x-auto pb-2",
					children: others.map((s) => {
						const src = BUNDLED_POSTERS[s.slug];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dizi/$slug",
							params: { slug: s.slug },
							className: "w-32 shrink-0",
							children: [src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: s.title,
								width: 768,
								height: 1152,
								loading: "lazy",
								className: "aspect-[2/3] w-full rounded-2xl object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid aspect-[2/3] w-full place-items-center rounded-2xl bg-gradient-to-br from-primary/30 via-card to-accent/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-3 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground",
									children: s.title
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-2 text-xs font-semibold",
								children: s.title
							})]
						}, s.id);
					})
				})]
			})
		]
	});
}
//#endregion
export { Index as component, otherPublished };
