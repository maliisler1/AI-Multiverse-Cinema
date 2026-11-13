import { n as __exportAll } from "../../_runtime.mjs";
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/polyfill/globalthis.mjs
var globalthis_default = globalThis;
//#endregion
//#region node_modules/.pnpm/@capacitor+core@8.5.2/node_modules/@capacitor/core/dist/index.js
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var ExceptionCode;
(function(ExceptionCode) {
	/**
	* API is not implemented.
	*
	* This usually means the API can't be used because it is not implemented for
	* the current platform.
	*/
	ExceptionCode["Unimplemented"] = "UNIMPLEMENTED";
	/**
	* API is not available.
	*
	* This means the API can't be used right now because:
	*   - it is currently missing a prerequisite, such as network connectivity
	*   - it requires a particular platform or browser version
	*/
	ExceptionCode["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
var CapacitorException = class extends Error {
	constructor(message, code, data) {
		super(message);
		this.message = message;
		this.code = code;
		this.data = data;
	}
};
var getPlatformId = (win) => {
	var _a, _b;
	if (win === null || win === void 0 ? void 0 : win.androidBridge) return "android";
	else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) return "ios";
	else return "web";
};
var createCapacitor = (win) => {
	const capCustomPlatform = win.CapacitorCustomPlatform || null;
	const cap = win.Capacitor || {};
	const Plugins = cap.Plugins = cap.Plugins || {};
	const getPlatform = () => {
		return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
	};
	const isNativePlatform = () => getPlatform() !== "web";
	const isPluginAvailable = (pluginName) => {
		const plugin = registeredPlugins.get(pluginName);
		if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) return true;
		if (getPluginHeader(pluginName)) return true;
		return false;
	};
	const getPluginHeader = (pluginName) => {
		var _a;
		return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
	};
	const handleError = (err) => win.console.error(err);
	const registeredPlugins = /* @__PURE__ */ new Map();
	const registerPlugin = (pluginName, jsImplementations = {}) => {
		const registeredPlugin = registeredPlugins.get(pluginName);
		if (registeredPlugin) {
			console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
			return registeredPlugin.proxy;
		}
		const platform = getPlatform();
		const pluginHeader = getPluginHeader(pluginName);
		let jsImplementation;
		const loadPluginImplementation = async () => {
			if (!jsImplementation && platform in jsImplementations) jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
			else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
			return jsImplementation;
		};
		const createPluginMethod = (impl, prop) => {
			var _a, _b;
			if (pluginHeader) {
				const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
				if (methodHeader) if (methodHeader.rtype === "promise") return (options) => cap.nativePromise(pluginName, prop.toString(), options);
				else return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
				else if (impl) return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
			} else if (impl) return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
			else throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
		};
		const createPluginMethodWrapper = (prop) => {
			let remove;
			const wrapper = (...args) => {
				const p = loadPluginImplementation().then((impl) => {
					const fn = createPluginMethod(impl, prop);
					if (fn) {
						const p = fn(...args);
						remove = p === null || p === void 0 ? void 0 : p.remove;
						return p;
					} else throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
				});
				if (prop === "addListener") p.remove = async () => remove();
				return p;
			};
			wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
			Object.defineProperty(wrapper, "name", {
				value: prop,
				writable: false,
				configurable: false
			});
			return wrapper;
		};
		const addListener = createPluginMethodWrapper("addListener");
		const removeListener = createPluginMethodWrapper("removeListener");
		const addListenerNative = (eventName, callback) => {
			const call = addListener({ eventName }, callback);
			const remove = async () => {
				const callbackId = await call;
				removeListener({
					eventName,
					callbackId
				}, callback);
			};
			const p = new Promise((resolve) => call.then(() => resolve({ remove })));
			p.remove = async () => {
				console.warn(`Using addListener() without 'await' is deprecated.`);
				await remove();
			};
			return p;
		};
		const proxy = new Proxy({}, { get(_, prop) {
			switch (prop) {
				case "$$typeof": return;
				case "toJSON": return () => ({});
				case "addListener": return pluginHeader ? addListenerNative : addListener;
				case "removeListener": return removeListener;
				default: return createPluginMethodWrapper(prop);
			}
		} });
		Plugins[pluginName] = proxy;
		registeredPlugins.set(pluginName, {
			name: pluginName,
			proxy,
			platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
		});
		return proxy;
	};
	if (!cap.convertFileSrc) cap.convertFileSrc = (filePath) => filePath;
	cap.getPlatform = getPlatform;
	cap.handleError = handleError;
	cap.isNativePlatform = isNativePlatform;
	cap.isPluginAvailable = isPluginAvailable;
	cap.registerPlugin = registerPlugin;
	cap.Exception = CapacitorException;
	cap.DEBUG = !!cap.DEBUG;
	cap.isLoggingEnabled = !!cap.isLoggingEnabled;
	return cap;
};
var initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
var Capacitor = /*#__PURE__*/ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof globalthis_default !== "undefined" ? globalthis_default : {});
var registerPlugin = Capacitor.registerPlugin;
/**
* Base class web plugins should extend.
*/
var WebPlugin = class {
	constructor() {
		this.listeners = {};
		this.retainedEventArguments = {};
		this.windowListeners = {};
	}
	addListener(eventName, listenerFunc) {
		let firstListener = false;
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
			firstListener = true;
		}
		this.listeners[eventName].push(listenerFunc);
		const windowListener = this.windowListeners[eventName];
		if (windowListener && !windowListener.registered) this.addWindowListener(windowListener);
		if (firstListener) this.sendRetainedArgumentsForEvent(eventName);
		const remove = async () => this.removeListener(eventName, listenerFunc);
		return Promise.resolve({ remove });
	}
	async removeAllListeners() {
		this.listeners = {};
		for (const listener in this.windowListeners) this.removeWindowListener(this.windowListeners[listener]);
		this.windowListeners = {};
	}
	notifyListeners(eventName, data, retainUntilConsumed) {
		const listeners = this.listeners[eventName];
		if (!listeners) {
			if (retainUntilConsumed) {
				let args = this.retainedEventArguments[eventName];
				if (!args) args = [];
				args.push(data);
				this.retainedEventArguments[eventName] = args;
			}
			return;
		}
		listeners.forEach((listener) => listener(data));
	}
	hasListeners(eventName) {
		var _a;
		return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
	}
	registerWindowListener(windowEventName, pluginEventName) {
		this.windowListeners[pluginEventName] = {
			registered: false,
			windowEventName,
			pluginEventName,
			handler: (event) => {
				this.notifyListeners(pluginEventName, event);
			}
		};
	}
	unimplemented(msg = "not implemented") {
		return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
	}
	unavailable(msg = "not available") {
		return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
	}
	async removeListener(eventName, listenerFunc) {
		const listeners = this.listeners[eventName];
		if (!listeners) return;
		const index = listeners.indexOf(listenerFunc);
		if (index !== -1) this.listeners[eventName].splice(index, 1);
		if (!this.listeners[eventName].length) this.removeWindowListener(this.windowListeners[eventName]);
	}
	addWindowListener(handle) {
		window.addEventListener(handle.windowEventName, handle.handler);
		handle.registered = true;
	}
	removeWindowListener(handle) {
		if (!handle) return;
		window.removeEventListener(handle.windowEventName, handle.handler);
		handle.registered = false;
	}
	sendRetainedArgumentsForEvent(eventName) {
		const args = this.retainedEventArguments[eventName];
		if (!args) return;
		delete this.retainedEventArguments[eventName];
		args.forEach((arg) => {
			this.notifyListeners(eventName, arg);
		});
	}
};
/******** END WEB VIEW PLUGIN ********/
/******** COOKIES PLUGIN ********/
/**
* Safely web encode a string value (inspired by js-cookie)
* @param str The string value to encode
*/
var encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
/**
* Safely web decode a string value (inspired by js-cookie)
* @param str The string value to decode
*/
var decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
var CapacitorCookiesPluginWeb = class extends WebPlugin {
	async getCookies() {
		const cookies = document.cookie;
		const cookieMap = {};
		cookies.split(";").forEach((cookie) => {
			if (cookie.length <= 0) return;
			let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
			key = decode(key).trim();
			value = decode(value).trim();
			cookieMap[key] = value;
		});
		return cookieMap;
	}
	async setCookie(options) {
		try {
			const encodedKey = encode(options.key);
			const encodedValue = encode(options.value);
			const expires = options.expires ? `; expires=${options.expires.replace("expires=", "")}` : "";
			const path = (options.path || "/").replace("path=", "");
			const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
			document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async deleteCookie(options) {
		try {
			document.cookie = `${options.key}=; Max-Age=0`;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async clearCookies() {
		try {
			const cookies = document.cookie.split(";") || [];
			for (const cookie of cookies) document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async clearAllCookies() {
		try {
			await this.clearCookies();
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
registerPlugin("CapacitorCookies", { web: () => new CapacitorCookiesPluginWeb() });
/**
* Read in a Blob value and return it as a base64 string
* @param blob The blob value to convert to a base64 string
*/
var readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => {
		const base64String = reader.result;
		resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
	};
	reader.onerror = (error) => reject(error);
	reader.readAsDataURL(blob);
});
/**
* Normalize an HttpHeaders map by lowercasing all of the values
* @param headers The HttpHeaders object to normalize
*/
var normalizeHttpHeaders = (headers = {}) => {
	const originalKeys = Object.keys(headers);
	return Object.keys(headers).map((k) => k.toLocaleLowerCase()).reduce((acc, key, index) => {
		acc[key] = headers[originalKeys[index]];
		return acc;
	}, {});
};
/**
* Builds a string of url parameters that
* @param params A map of url parameters
* @param shouldEncode true if you should encodeURIComponent() the values (true by default)
*/
var buildUrlParams = (params, shouldEncode = true) => {
	if (!params) return null;
	return Object.entries(params).reduce((accumulator, entry) => {
		const [key, value] = entry;
		let encodedValue;
		let item;
		if (Array.isArray(value)) {
			item = "";
			value.forEach((str) => {
				encodedValue = shouldEncode ? encodeURIComponent(str) : str;
				item += `${key}=${encodedValue}&`;
			});
			item.slice(0, -1);
		} else {
			encodedValue = shouldEncode ? encodeURIComponent(value) : value;
			item = `${key}=${encodedValue}`;
		}
		return `${accumulator}&${item}`;
	}, "").substr(1);
};
/**
* Build the RequestInit object based on the options passed into the initial request
* @param options The Http plugin options
* @param extra Any extra RequestInit values
*/
var buildRequestInit = (options, extra = {}) => {
	const output = Object.assign({
		method: options.method || "GET",
		headers: options.headers
	}, extra);
	const type = normalizeHttpHeaders(options.headers)["content-type"] || "";
	if (typeof options.data === "string") output.body = options.data;
	else if (type.includes("application/x-www-form-urlencoded")) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(options.data || {})) params.set(key, value);
		output.body = params.toString();
	} else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
		const form = new FormData();
		if (options.data instanceof FormData) options.data.forEach((value, key) => {
			form.append(key, value);
		});
		else for (const key of Object.keys(options.data)) form.append(key, options.data[key]);
		output.body = form;
		const headers = new Headers(output.headers);
		headers.delete("content-type");
		output.headers = headers;
	} else if (type.includes("application/json") || typeof options.data === "object") output.body = JSON.stringify(options.data);
	return output;
};
var CapacitorHttpPluginWeb = class extends WebPlugin {
	/**
	* Perform an Http request given a set of options
	* @param options Options to build the HTTP request
	*/
	async request(options) {
		const requestInit = buildRequestInit(options, options.webFetchExtra);
		const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
		const url = urlParams ? `${options.url}?${urlParams}` : options.url;
		const response = await fetch(url, requestInit);
		const contentType = response.headers.get("content-type") || "";
		let { responseType = "text" } = response.ok ? options : {};
		if (contentType.includes("application/json")) responseType = "json";
		let data;
		let blob;
		switch (responseType) {
			case "arraybuffer":
			case "blob":
				blob = await response.blob();
				data = await readBlobAsBase64(blob);
				break;
			case "json":
				data = await response.json();
				break;
			default: data = await response.text();
		}
		const headers = {};
		response.headers.forEach((value, key) => {
			headers[key] = value;
		});
		return {
			data,
			headers,
			status: response.status,
			url: response.url
		};
	}
	/**
	* Perform an Http GET request given a set of options
	* @param options Options to build the HTTP request
	*/
	async get(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
	}
	/**
	* Perform an Http POST request given a set of options
	* @param options Options to build the HTTP request
	*/
	async post(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
	}
	/**
	* Perform an Http PUT request given a set of options
	* @param options Options to build the HTTP request
	*/
	async put(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
	}
	/**
	* Perform an Http PATCH request given a set of options
	* @param options Options to build the HTTP request
	*/
	async patch(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
	}
	/**
	* Perform an Http DELETE request given a set of options
	* @param options Options to build the HTTP request
	*/
	async delete(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
	}
};
registerPlugin("CapacitorHttp", { web: () => new CapacitorHttpPluginWeb() });
/******** END HTTP PLUGIN ********/
/******** SYSTEM BARS PLUGIN ********/
/**
* Available status bar styles.
*/
var SystemBarsStyle;
(function(SystemBarsStyle) {
	/**
	* Light system bar content on a dark background.
	*
	* @since 8.0.0
	*/
	SystemBarsStyle["Dark"] = "DARK";
	/**
	* For dark system bar content on a light background.
	*
	* @since 8.0.0
	*/
	SystemBarsStyle["Light"] = "LIGHT";
	/**
	* The style is based on the device appearance or the underlying content.
	* If the device is using Dark mode, the system bars content will be light.
	* If the device is using Light mode, the system bars content will be dark.
	*
	* @since 8.0.0
	*/
	SystemBarsStyle["Default"] = "DEFAULT";
})(SystemBarsStyle || (SystemBarsStyle = {}));
/**
* Available system bar types.
*/
var SystemBarType;
(function(SystemBarType) {
	/**
	* The top status bar on both Android and iOS.
	*
	* @since 8.0.0
	*/
	SystemBarType["StatusBar"] = "StatusBar";
	/**
	* The navigation bar (or gesture bar on iOS) on both Android and iOS.
	*
	* @since 8.0.0
	*/
	SystemBarType["NavigationBar"] = "NavigationBar";
})(SystemBarType || (SystemBarType = {}));
var SystemBarsPluginWeb = class extends WebPlugin {
	async setStyle() {
		this.unavailable("not available for web");
	}
	async setAnimation() {
		this.unavailable("not available for web");
	}
	async show() {
		this.unavailable("not available for web");
	}
	async hide() {
		this.unavailable("not available for web");
	}
};
registerPlugin("SystemBars", { web: () => new SystemBarsPluginWeb() });
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/definitions.js
var MaxAdContentRating;
(function(MaxAdContentRating) {
	/**
	* Content suitable for general audiences, including families.
	*/
	MaxAdContentRating["General"] = "General";
	/**
	* Content suitable for most audiences with parental guidance.
	*/
	MaxAdContentRating["ParentalGuidance"] = "ParentalGuidance";
	/**
	* Content suitable for teen and older audiences.
	*/
	MaxAdContentRating["Teen"] = "Teen";
	/**
	* Content suitable only for mature audiences.
	*/
	MaxAdContentRating["MatureAudience"] = "MatureAudience";
})(MaxAdContentRating || (MaxAdContentRating = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-plugin-events.enum.js
var BannerAdPluginEvents;
(function(BannerAdPluginEvents) {
	/**
	* Emits when the displayed banner size changes.
	*/
	BannerAdPluginEvents["SizeChanged"] = "bannerAdSizeChanged";
	/**
	* Emits when a banner ad has loaded.
	*/
	BannerAdPluginEvents["Loaded"] = "bannerAdLoaded";
	/**
	* Emits when a banner ad fails to load.
	*/
	BannerAdPluginEvents["FailedToLoad"] = "bannerAdFailedToLoad";
	/**
	* Emits when a banner opens an overlay after the user taps it.
	*/
	BannerAdPluginEvents["Opened"] = "bannerAdOpened";
	/**
	* Emits when the banner overlay is closed.
	*/
	BannerAdPluginEvents["Closed"] = "bannerAdClosed";
	/**
	* Emits when an impression is recorded for the banner ad.
	*/
	BannerAdPluginEvents["AdImpression"] = "bannerAdImpression";
	/**
	* Emits impression-level ad revenue data when a paid event is recorded.
	*/
	BannerAdPluginEvents["AdPaid"] = "bannerAdPaid";
})(BannerAdPluginEvents || (BannerAdPluginEvents = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-position.enum.js
/**
* @see https://developer.android.com/reference/android/widget/LinearLayout#attr_android:gravity
*/
var BannerAdPosition;
(function(BannerAdPosition) {
	/**
	* Positions the banner at the top center of the screen.
	*/
	BannerAdPosition["TOP_CENTER"] = "TOP_CENTER";
	/**
	* Positions the banner at the center of the screen.
	*/
	BannerAdPosition["CENTER"] = "CENTER";
	/**
	* Positions the banner at the bottom center of the screen.
	*/
	BannerAdPosition["BOTTOM_CENTER"] = "BOTTOM_CENTER";
})(BannerAdPosition || (BannerAdPosition = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-size.enum.js
/**
*  For more information:
*  https://developers.google.com/admob/ios/banner#banner_sizes
*  https://developers.google.com/android/reference/com/google/android/gms/ads/AdSize
*
* */
var BannerAdSize;
(function(BannerAdSize) {
	/**
	* Mobile Marketing Association (MMA)
	* banner ad size (320x50 density-independent pixels).
	*/
	BannerAdSize["BANNER"] = "BANNER";
	/**
	* Interactive Advertising Bureau (IAB)
	* full banner ad size (468x60 density-independent pixels).
	*/
	BannerAdSize["FULL_BANNER"] = "FULL_BANNER";
	/**
	* Large banner ad size (320x100 density-independent pixels).
	*/
	BannerAdSize["LARGE_BANNER"] = "LARGE_BANNER";
	/**
	* Interactive Advertising Bureau (IAB)
	* medium rectangle ad size (300x250 density-independent pixels).
	*/
	BannerAdSize["MEDIUM_RECTANGLE"] = "MEDIUM_RECTANGLE";
	/**
	* Interactive Advertising Bureau (IAB)
	* leaderboard ad size (728x90 density-independent pixels).
	*/
	BannerAdSize["LEADERBOARD"] = "LEADERBOARD";
	/**
	* A dynamically sized banner that is full-width and auto-height.
	*/
	BannerAdSize["ADAPTIVE_BANNER"] = "ADAPTIVE_BANNER";
	/**
	* A legacy smart banner sized to the screen width.
	* Retained for compatibility; use `ADAPTIVE_BANNER` for new integrations.
	*
	* @deprecated Use `ADAPTIVE_BANNER` instead.
	*/
	BannerAdSize["SMART_BANNER"] = "SMART_BANNER";
})(BannerAdSize || (BannerAdSize = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/interstitial/interstitial-ad-plugin-events.enum.js
var InterstitialAdPluginEvents;
(function(InterstitialAdPluginEvents) {
	/**
	* Emits when an interstitial ad has loaded and is ready to show.
	*/
	InterstitialAdPluginEvents["Loaded"] = "interstitialAdLoaded";
	/**
	* Emits when an interstitial ad fails to load.
	*/
	InterstitialAdPluginEvents["FailedToLoad"] = "interstitialAdFailedToLoad";
	/**
	* Emits when an interstitial ad is shown.
	*/
	InterstitialAdPluginEvents["Showed"] = "interstitialAdShowed";
	/**
	* Emits when a loaded interstitial ad fails to show.
	*/
	InterstitialAdPluginEvents["FailedToShow"] = "interstitialAdFailedToShow";
	/**
	* Emits when an interstitial ad is dismissed.
	*/
	InterstitialAdPluginEvents["Dismissed"] = "interstitialAdDismissed";
	/**
	* Emits impression-level ad revenue data when a paid event is recorded.
	*/
	InterstitialAdPluginEvents["AdImpression"] = "interstitialAdImpression";
})(InterstitialAdPluginEvents || (InterstitialAdPluginEvents = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-ad-plugin-events.enum.js
var RewardInterstitialAdPluginEvents;
(function(RewardInterstitialAdPluginEvents) {
	/**
	* Emits when a rewarded interstitial ad has loaded and is ready to show.
	*/
	RewardInterstitialAdPluginEvents["Loaded"] = "onRewardedInterstitialAdLoaded";
	/**
	* Emits when a rewarded interstitial ad fails to load.
	*/
	RewardInterstitialAdPluginEvents["FailedToLoad"] = "onRewardedInterstitialAdFailedToLoad";
	/**
	* Emits when a rewarded interstitial ad is shown.
	*/
	RewardInterstitialAdPluginEvents["Showed"] = "onRewardedInterstitialAdShowed";
	/**
	* Emits when a loaded rewarded interstitial ad fails to show.
	*/
	RewardInterstitialAdPluginEvents["FailedToShow"] = "onRewardedInterstitialAdFailedToShow";
	/**
	* Emits when a rewarded interstitial ad is dismissed.
	*
	* This event does not indicate whether the user earned a reward. Listen for
	* `Rewarded` separately before granting the reward.
	*/
	RewardInterstitialAdPluginEvents["Dismissed"] = "onRewardedInterstitialAdDismissed";
	/**
	* Emits when the user earns the advertised reward.
	*/
	RewardInterstitialAdPluginEvents["Rewarded"] = "onRewardedInterstitialAdReward";
	/**
	* Emits impression-level ad revenue data when a paid event is recorded.
	*/
	RewardInterstitialAdPluginEvents["AdImpression"] = "onRewardedInterstitialAdImpression";
})(RewardInterstitialAdPluginEvents || (RewardInterstitialAdPluginEvents = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-ad-plugin-events.enum.js
var RewardAdPluginEvents;
(function(RewardAdPluginEvents) {
	/**
	* Emits when the SDK records a click on a rewarded ad.
	*/
	RewardAdPluginEvents["adClicked"] = "onRewardedVideoAdClicked";
	/**
	* Emits when a rewarded ad has loaded and is ready to show.
	*/
	RewardAdPluginEvents["Loaded"] = "onRewardedVideoAdLoaded";
	/**
	* Emits when a rewarded ad fails to load.
	*/
	RewardAdPluginEvents["FailedToLoad"] = "onRewardedVideoAdFailedToLoad";
	/**
	* Emits when a rewarded ad is shown.
	*/
	RewardAdPluginEvents["Showed"] = "onRewardedVideoAdShowed";
	/**
	* Emits when a loaded rewarded ad fails to show.
	*/
	RewardAdPluginEvents["FailedToShow"] = "onRewardedVideoAdFailedToShow";
	/**
	* Emits when a rewarded ad is dismissed.
	*
	* This event does not indicate whether the user earned a reward. Listen for
	* `Rewarded` separately before granting the reward.
	*/
	RewardAdPluginEvents["Dismissed"] = "onRewardedVideoAdDismissed";
	/**
	* Emits when the user earns the advertised reward.
	*/
	RewardAdPluginEvents["Rewarded"] = "onRewardedVideoAdReward";
	/**
	* Emits impression-level ad revenue data when a paid event is recorded.
	*/
	RewardAdPluginEvents["AdImpression"] = "onRewardedVideoAdImpression";
})(RewardAdPluginEvents || (RewardAdPluginEvents = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-status.enum.js
/**
*  For more information:
*  https://developers.google.com/admob/unity/reference/namespace/google-mobile-ads/ump/api#consentstatus
*
* */
var AdmobConsentStatus;
(function(AdmobConsentStatus) {
	/**
	* User consent not required.
	*/
	AdmobConsentStatus["NOT_REQUIRED"] = "NOT_REQUIRED";
	/**
	* User consent already obtained.
	*/
	AdmobConsentStatus["OBTAINED"] = "OBTAINED";
	/**
	* User consent required but not yet obtained.
	*/
	AdmobConsentStatus["REQUIRED"] = "REQUIRED";
	/**
	* Unknown consent status, AdsConsent.requestInfoUpdate needs to be called to update it.
	*/
	AdmobConsentStatus["UNKNOWN"] = "UNKNOWN";
})(AdmobConsentStatus || (AdmobConsentStatus = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-debug-geography.enum.js
/**
*  For more information:
*  https://developers.google.com/admob/unity/reference/namespace/google-mobile-ads/ump/api#debuggeography
*
* */
var AdmobConsentDebugGeography;
(function(AdmobConsentDebugGeography) {
	/**
	* Debug geography disabled.
	*/
	AdmobConsentDebugGeography[AdmobConsentDebugGeography["DISABLED"] = 0] = "DISABLED";
	/**
	* Geography appears as in EEA for debug devices.
	*/
	AdmobConsentDebugGeography[AdmobConsentDebugGeography["EEA"] = 1] = "EEA";
	/**
	* Geography appears as not in EEA for debug devices.
	* @deprecated
	*/
	AdmobConsentDebugGeography[AdmobConsentDebugGeography["NOT_EEA"] = 2] = "NOT_EEA";
	/**
	* Geography appears as in regulated US state for debug devices.
	*/
	AdmobConsentDebugGeography[AdmobConsentDebugGeography["US"] = 3] = "US";
	/**
	* Geography appears as OTHER state for debug devices.
	*/
	AdmobConsentDebugGeography[AdmobConsentDebugGeography["OTHER"] = 4] = "OTHER";
})(AdmobConsentDebugGeography || (AdmobConsentDebugGeography = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/shared/ad-mob-revenue-data.interface.js
/**
* The precision of an impression-level ad value.
*/
var AdValuePrecision;
(function(AdValuePrecision) {
	/**
	* The ad value precision is unknown.
	*/
	AdValuePrecision[AdValuePrecision["Unknown"] = 0] = "Unknown";
	/**
	* The ad value is estimated from aggregated data.
	*/
	AdValuePrecision[AdValuePrecision["Estimated"] = 1] = "Estimated";
	/**
	* The ad value was provided by the publisher.
	*/
	AdValuePrecision[AdValuePrecision["PublisherProvided"] = 2] = "PublisherProvided";
	/**
	* The ad value is the precise value paid for this ad.
	*/
	AdValuePrecision[AdValuePrecision["Precise"] = 3] = "Precise";
})(AdValuePrecision || (AdValuePrecision = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/app-open/app-open-ad-plugin-events.enum.js
var AppOpenAdPluginEvents;
(function(AppOpenAdPluginEvents) {
	/**
	* Emits when an App Open ad has loaded.
	*/
	AppOpenAdPluginEvents["Loaded"] = "appOpenAdLoaded";
	/**
	* Emits when an App Open ad fails to load.
	*/
	AppOpenAdPluginEvents["FailedToLoad"] = "appOpenAdFailedToLoad";
	/**
	* Emits when an App Open ad is shown.
	*/
	AppOpenAdPluginEvents["Opened"] = "appOpenAdOpened";
	/**
	* Emits when an App Open ad is dismissed.
	*/
	AppOpenAdPluginEvents["Closed"] = "appOpenAdClosed";
	/**
	* Emits when a loaded App Open ad fails to show.
	*/
	AppOpenAdPluginEvents["FailedToShow"] = "appOpenAdFailedToShow";
	/**
	* Emits impression-level ad revenue data when a paid event is recorded.
	*/
	AppOpenAdPluginEvents["AdImpression"] = "appOpenAdImpression";
})(AppOpenAdPluginEvents || (AppOpenAdPluginEvents = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/index.js
var AdMob = registerPlugin("AdMob", { web: () => Promise.resolve().then(() => web_exports).then((m) => new m.AdMobWeb()) });
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/consent/privacy-options-requirement-status.enum.js
/**
*  For more information:
*  https://developers.google.com/admob/unity/reference/namespace/google-mobile-ads/ump/api#privacyoptionsrequirementstatus
*
* */
var PrivacyOptionsRequirementStatus;
(function(PrivacyOptionsRequirementStatus) {
	/**
	* Privacy options entry point is not required.
	*/
	PrivacyOptionsRequirementStatus["NOT_REQUIRED"] = "NOT_REQUIRED";
	/**
	* Privacy options entry point is required.
	*/
	PrivacyOptionsRequirementStatus["REQUIRED"] = "REQUIRED";
	/**
	* Privacy options requirement status is unknown.
	*/
	PrivacyOptionsRequirementStatus["UNKNOWN"] = "UNKNOWN";
})(PrivacyOptionsRequirementStatus || (PrivacyOptionsRequirementStatus = {}));
//#endregion
//#region node_modules/.pnpm/@capacitor-community+admob@8.2.0/node_modules/@capacitor-community/admob/dist/esm/web.js
var web_exports = /* @__PURE__ */ __exportAll({ AdMobWeb: () => AdMobWeb });
var AdMobWeb = class extends WebPlugin {
	async initialize() {
		console.log("initialize");
	}
	async requestTrackingAuthorization() {
		console.log("requestTrackingAuthorization");
	}
	async trackingAuthorizationStatus() {
		return { status: "authorized" };
	}
	async requestConsentInfo(options) {
		console.log("requestConsentInfo", options);
		return {
			status: AdmobConsentStatus.REQUIRED,
			isConsentFormAvailable: true,
			canRequestAds: true,
			privacyOptionsRequirementStatus: PrivacyOptionsRequirementStatus.REQUIRED
		};
	}
	async showPrivacyOptionsForm() {
		console.log("showPrivacyOptionsForm");
	}
	async showConsentForm() {
		console.log("showConsentForm");
		return {
			status: AdmobConsentStatus.REQUIRED,
			canRequestAds: true,
			privacyOptionsRequirementStatus: PrivacyOptionsRequirementStatus.REQUIRED
		};
	}
	async resetConsentInfo() {
		console.log("resetConsentInfo");
	}
	async setApplicationMuted(options) {
		console.log("setApplicationMuted", options);
	}
	async setApplicationVolume(options) {
		console.log("setApplicationVolume", options);
	}
	async showBanner(options) {
		console.log("showBanner", options);
	}
	async hideBanner() {
		console.log("hideBanner");
	}
	async resumeBanner() {
		console.log("resumeBanner");
	}
	async removeBanner() {
		console.log("removeBanner");
	}
	async prepareInterstitial(options) {
		console.log("prepareInterstitial", options);
		return { adUnitId: options.adId };
	}
	async showInterstitial(options) {
		console.log("showInterstitial", options);
	}
	async prepareRewardVideoAd(options) {
		console.log("prepareRewardVideoAd", options);
		return { adUnitId: options.adId };
	}
	async showRewardVideoAd(options) {
		console.log("showRewardVideoAd", options);
		return {
			type: "",
			amount: 0
		};
	}
	async prepareRewardInterstitialAd(options) {
		console.log("prepareRewardInterstitialAd", options);
		return { adUnitId: options.adId };
	}
	async showRewardInterstitialAd(options) {
		console.log("showRewardInterstitialAd", options);
		return {
			type: "",
			amount: 0
		};
	}
	async loadAppOpen(options) {
		console.log("loadAppOpen", options);
		return { adUnitId: options.adId };
	}
	async showAppOpen(options) {
		console.log("showAppOpen", options);
	}
	async isAppOpenLoaded() {
		return { value: false };
	}
	addListener(eventName, listenerFunc) {
		console.log("addListener", eventName);
		return Promise.resolve({ remove: () => Promise.resolve() });
	}
};
//#endregion
export { BannerAdSize as a, Capacitor as c, registerPlugin as d, globalthis_default as f, InterstitialAdPluginEvents as i, WebPlugin as l, AdmobConsentStatus as n, BannerAdPosition as o, RewardAdPluginEvents as r, BannerAdPluginEvents as s, AdMob as t, buildRequestInit as u };
