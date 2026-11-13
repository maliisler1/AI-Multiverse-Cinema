globalThis.__nitro_main__ = import.meta.url;
import { n as defineLazyEventHandler, r as HTTPError, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { t as FastResponse } from "./_libs/srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-11-13T16:19:22.034Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-11-13T16:19:22.034Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/sample-2.mp4": {
		"type": "video/mp4",
		"etag": "\"24b16-olx72nkNW9aTCqIV6DOio3NopIo\"",
		"mtime": "2026-11-13T16:19:22.034Z",
		"size": 150294,
		"path": "../public/sample-2.mp4"
	},
	"/sample-3.mp4": {
		"type": "video/mp4",
		"etag": "\"24aee-t2s9k/rJ3zq2kGCqXL8uAWcw40Y\"",
		"mtime": "2026-11-13T16:19:22.033Z",
		"size": 150254,
		"path": "../public/sample-3.mp4"
	},
	"/sample.mp4": {
		"type": "video/mp4",
		"etag": "\"24aff-Q+DztEX+I/bDuOtsICNk2tATObw\"",
		"mtime": "2026-11-13T16:19:22.034Z",
		"size": 150271,
		"path": "../public/sample.mp4"
	},
	"/assets/AppShell-prMBUbLk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"475bf-YOKc4m87MyLH4geZkoM5KTtAtAQ\"",
		"mtime": "2026-11-13T16:19:21.069Z",
		"size": 292287,
		"path": "../public/assets/AppShell-prMBUbLk.js"
	},
	"/assets/SeriesView-BMp3k-Y4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21bf-ckXc8ggW4TWe7kEJCGRIBrx9/a0\"",
		"mtime": "2026-11-13T16:19:21.069Z",
		"size": 8639,
		"path": "../public/assets/SeriesView-BMp3k-Y4.js"
	},
	"/assets/arrow-left-7OEYdYMD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-TmAQ6p6QXaPM4VgrgY/ocC59TAg\"",
		"mtime": "2026-11-13T16:19:21.069Z",
		"size": 306,
		"path": "../public/assets/arrow-left-7OEYdYMD.js"
	},
	"/assets/ayarlar-Cw00S85f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53b-THiWedJC2Lots8dZ/qFG4z6Hq9s\"",
		"mtime": "2026-11-13T16:19:21.069Z",
		"size": 1339,
		"path": "../public/assets/ayarlar-Cw00S85f.js"
	},
	"/assets/catalog-B5Peoq5v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f05-DLujTiN0ex5m2oi89Mj3riF8Us0\"",
		"mtime": "2026-11-13T16:19:21.069Z",
		"size": 24325,
		"path": "../public/assets/catalog-B5Peoq5v.js"
	},
	"/assets/check-C2Ln0Cjs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"74-hMobW+MdQcCNVa5bUAhOusMqvMc\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 116,
		"path": "../public/assets/check-C2Ln0Cjs.js"
	},
	"/assets/consent-status.enum-CdMsqkrY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-f7mNDLrn7fU4RSxdOIgH02URjzQ\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 138,
		"path": "../public/assets/consent-status.enum-CdMsqkrY.js"
	},
	"/assets/cyber-glitch-4kcr8HGD.jpg": {
		"type": "image/jpeg",
		"etag": "\"34a46-ns2qNbw1wJYOqXsXqm4zEQ9TFRA\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 215622,
		"path": "../public/assets/cyber-glitch-4kcr8HGD.jpg"
	},
	"/assets/definitions-DlpntO5o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"160-gk2Jgrzju8JYD6bZzmdG3StLjzM\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 352,
		"path": "../public/assets/definitions-DlpntO5o.js"
	},
	"/assets/dist-B4QiFnYP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e54-ULvBovtlC9yGo6Bi5MsfT0A3Tys\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 7764,
		"path": "../public/assets/dist-B4QiFnYP.js"
	},
	"/assets/dizi._slug-ESgqAyY9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-5bULbwKpNpB6tFiP7sykvy6Gp1g\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 242,
		"path": "../public/assets/dizi._slug-ESgqAyY9.js"
	},
	"/assets/dizi._slug-k6ZgHHuF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1641-B/UpPqSEyFGfbtWSVnBRVRsd28s\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 5697,
		"path": "../public/assets/dizi._slug-k6ZgHHuF.js"
	},
	"/assets/film-BZpYlLGD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18f-MmFpTXKZGjxzrlgn7IEptzA59Is\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 399,
		"path": "../public/assets/film-BZpYlLGD.js"
	},
	"/assets/giris-YHhSj7mC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"119b-TTHXonautN2S51cQ2fqKoxmh6ng\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 4507,
		"path": "../public/assets/giris-YHhSj7mC.js"
	},
	"/assets/index-CRm1Tn0E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bac2-VBie8vrdLT4qTPhYclepzApIOZM\"",
		"mtime": "2026-11-13T16:19:21.067Z",
		"size": 375490,
		"path": "../public/assets/index-CRm1Tn0E.js"
	},
	"/assets/jeton-DXNSGYCl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ac-9ocGSlBB/egzRsIKbd73FAjOcXM\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 2476,
		"path": "../public/assets/jeton-DXNSGYCl.js"
	},
	"/assets/kapsul-UoyG6yGh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b37-ADY6f2ziuAV8RVks5ED4xSjuDV0\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 6967,
		"path": "../public/assets/kapsul-UoyG6yGh.js"
	},
	"/assets/lock-CBZEZjjZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c6-4SgMqlPbNcINsdpqT2mfdax7TCk\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 198,
		"path": "../public/assets/lock-CBZEZjjZ.js"
	},
	"/assets/neo-genesis-BgzmjZr5.jpg": {
		"type": "image/jpeg",
		"etag": "\"27d84-fTYmKZ1R2W8LPVGM8oZcrd/8a3E\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 163204,
		"path": "../public/assets/neo-genesis-BgzmjZr5.jpg"
	},
	"/assets/neon-hearts-BQnfDn9D.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a709-gzPZfapoYdblobU3KVP7DlRQEdU\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 173833,
		"path": "../public/assets/neon-hearts-BQnfDn9D.jpg"
	},
	"/assets/offline-T39WrNOk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9a-rvpgBFxFMUFq4oRvz3ImGTw9Ouk\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 2714,
		"path": "../public/assets/offline-T39WrNOk.js"
	},
	"/assets/play-DkVKOc9r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6-hhZf67qj3dDk6E72JvX6Bn7ILc4\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 182,
		"path": "../public/assets/play-DkVKOc9r.js"
	},
	"/assets/profil-CJRSJzOc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12bd1-nvvjoNtiKU7tjVMTT5BovaGAvEU\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 76753,
		"path": "../public/assets/profil-CJRSJzOc.js"
	},
	"/assets/rotate-ccw-D2qp39HQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c0-Vqd/Uvs1HyPG4QO3Fy+7HwHRcig\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 192,
		"path": "../public/assets/rotate-ccw-D2qp39HQ.js"
	},
	"/assets/routes-3ZqPaagD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4f-wUaIivhiOPCYeLmggpET+gEpOZY\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 3663,
		"path": "../public/assets/routes-3ZqPaagD.js"
	},
	"/assets/sparkles-6k5Z536d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6-z3rNtRB51GFYzeLlFwvo7qyB6Q4\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 486,
		"path": "../public/assets/sparkles-6k5Z536d.js"
	},
	"/assets/styles-RWJlcwaA.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13452-I0uzm3Qunni2hR0x4ulKu9GHOk4\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 78930,
		"path": "../public/assets/styles-RWJlcwaA.css"
	},
	"/assets/web-B-btVXBu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"740-cblSYaIe3SspQaSVj3gHuFY+9kM\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 1856,
		"path": "../public/assets/web-B-btVXBu.js"
	},
	"/assets/web-D9r0k8fk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d3-OvnYjDqB2hA1Cepm51ExcJhwkIk\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 2003,
		"path": "../public/assets/web-D9r0k8fk.js"
	},
	"/assets/web-FgFFxa6A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2128-vymlNGfEYboGkUHgfTHCS7wW+pU\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 8488,
		"path": "../public/assets/web-FgFFxa6A.js"
	},
	"/assets/web-kP70mRRB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16c-fnKZDr1U3fqOi/ZE+fyF5wyucmY\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 364,
		"path": "../public/assets/web-kP70mRRB.js"
	},
	"/assets/yonetim-Bsg1OLs5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8331-SDymGy9WfUm4KL2Tx1bmsC8Ed8Q\"",
		"mtime": "2026-11-13T16:19:21.070Z",
		"size": 33585,
		"path": "../public/assets/yonetim-Bsg1OLs5.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_drizzle-orm@0.45.4_postgres@3.4.9__jiti@2.7.0_vite@8.1.5_@types+n_9b7cb23e6c314be60587609f460b891b/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_1DEepl = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_1DEepl
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_drizzle-orm@0.45.4_postgres@3.4.9__jiti@2.7.0_vite@8.1.5_@types+n_9b7cb23e6c314be60587609f460b891b/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_drizzle-orm@0.45.4_postgres@3.4.9__jiti@2.7.0_vite@8.1.5_@types+n_9b7cb23e6c314be60587609f460b891b/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_drizzle-orm@0.45.4_postgres@3.4.9__jiti@2.7.0_vite@8.1.5_@types+n_9b7cb23e6c314be60587609f460b891b/node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_drizzle-orm@0.45.4_postgres@3.4.9__jiti@2.7.0_vite@8.1.5_@types+n_9b7cb23e6c314be60587609f460b891b/node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
