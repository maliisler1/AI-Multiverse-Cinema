import { n as __exportAll } from "../_runtime.mjs";
import { d as registerPlugin, l as WebPlugin } from "./@capacitor-community/admob+[...].mjs";
//#region node_modules/.pnpm/@capacitor+share@8.0.3_@capacitor+core@8.5.2/node_modules/@capacitor/share/dist/esm/index.js
var Share = registerPlugin("Share", { web: () => Promise.resolve().then(() => web_exports).then((m) => new m.ShareWeb()) });
//#endregion
//#region node_modules/.pnpm/@capacitor+share@8.0.3_@capacitor+core@8.5.2/node_modules/@capacitor/share/dist/esm/web.js
var web_exports = /* @__PURE__ */ __exportAll({ ShareWeb: () => ShareWeb });
var ShareWeb = class extends WebPlugin {
	async canShare() {
		if (typeof navigator === "undefined" || !navigator.share) return { value: false };
		else return { value: true };
	}
	async share(options) {
		if (typeof navigator === "undefined" || !navigator.share) throw this.unavailable("Share API not available in this browser");
		await navigator.share({
			title: options.title,
			text: options.text,
			url: options.url
		});
		return {};
	}
};
//#endregion
export { Share as t };
