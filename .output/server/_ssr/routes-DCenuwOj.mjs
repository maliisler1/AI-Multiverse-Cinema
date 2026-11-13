import "./offline-DXPmEaJz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DCenuwOj.js
/** Ana dizi: önce sabit slug, yoksa ilk yayımlanmış dizi, yoksa listedeki ilk dizi. */
function pickFeatured(all) {
	return all.find((s) => s.slug === "neo-genesis-2099") ?? all.find((s) => s.status === "published") ?? all[0];
}
//#endregion
export { pickFeatured as t };
