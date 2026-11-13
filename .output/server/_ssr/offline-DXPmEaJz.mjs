import { r as __toESM } from "../_runtime.mjs";
import { p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Capacitor } from "../_libs/@capacitor-community/admob+[...].mjs";
import { n as Directory, t as Filesystem } from "../_libs/@capacitor/filesystem+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/offline-DXPmEaJz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var neo_genesis_default = "/assets/neo-genesis-BgzmjZr5.jpg";
var cyber_glitch_default = "/assets/cyber-glitch-4kcr8HGD.jpg";
var neon_hearts_default = "/assets/neon-hearts-BQnfDn9D.jpg";
var eps = (tr, en) => tr.map((t, i) => ({
	n: i + 1,
	title: {
		tr: t,
		en: en[i] ?? t
	},
	minutes: 2 + i % 3
}));
eps([
	"Uyanış",
	"Kayıp Sinyal",
	"Megakentin Kalbi",
	"Kod Adı: Genesis",
	"Son Geri Sayım"
], [
	"Awakening",
	"Lost Signal",
	"Heart of the Megacity",
	"Codename: Genesis",
	"Final Countdown"
]), eps([
	"Sistem Hatası",
	"Kahraman Modu",
	"Yanlış Alarm",
	"Robot Dansı",
	"Büyük Çöküş"
], [
	"System Error",
	"Hero Mode",
	"False Alarm",
	"Robot Dance",
	"The Big Crash"
]), eps([
	"İlk Bağlantı",
	"Sanal Yağmur",
	"Kopan Sinyal",
	"Gerçeğe Adım",
	"Tek Kalp Atışı"
], [
	"First Connection",
	"Virtual Rain",
	"Broken Signal",
	"Step Into Reality",
	"One Heartbeat"
]);
var KEY = "amc-offline-v1";
var subs = /* @__PURE__ */ new Set();
var cache = null;
function read() {
	if (cache) return cache;
	try {
		cache = JSON.parse(localStorage.getItem(KEY) ?? "{}");
	} catch {
		cache = {};
	}
	return cache;
}
function write(next) {
	cache = next;
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {}
	subs.forEach((fn) => fn());
}
async function fetchTo(url, path) {
	await Filesystem.downloadFile({
		url,
		path,
		directory: Directory.Data,
		recursive: true
	});
	return (await Filesystem.getUri({
		path,
		directory: Directory.Data
	})).uri;
}
var offline = {
	supported: () => Capacitor.isNativePlatform(),
	get: (episodeId) => read()[episodeId],
	/** Cihazdaki dosyayı oynatıcının açabileceği adrese çevirir. */
	src: (fileUri) => Capacitor.convertFileSrc(fileUri),
	async download(episodeId, videoUrl, audio) {
		const entry = { video: await fetchTo(videoUrl, `episodes/${episodeId}.mp4`) };
		if (audio) {
			entry.audio = await fetchTo(audio.url, `episodes/${episodeId}.${audio.lang}.audio`);
			entry.audioLang = audio.lang;
		}
		write({
			...read(),
			[episodeId]: entry
		});
	},
	async remove(episodeId) {
		const entry = read()[episodeId];
		if (!entry) return;
		for (const uri of [entry.video, entry.audio]) if (uri) await Filesystem.deleteFile({ path: uri }).catch(() => {});
		const { [episodeId]: _drop, ...rest } = read();
		write(rest);
	},
	subscribe(fn) {
		subs.add(fn);
		return () => {
			subs.delete(fn);
		};
	}
};
/** İndirilmiş bölümler değiştikçe bileşeni yeniler. */
function useOffline() {
	return (0, import_react.useSyncExternalStore)(offline.subscribe, read, () => ({}));
}
//#endregion
export { useOffline as a, offline as i, neo_genesis_default as n, neon_hearts_default as r, cyber_glitch_default as t };
