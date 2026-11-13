import { c as lazyRouteComponent, l as createFileRoute, m as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as seriesListQuery, t as episodeListQuery } from "./catalog-BLKtVYzb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dizi._slug-DxRHPgfE.js
var $$splitComponentImporter = () => import("./dizi._slug-BYOCp9H8.mjs");
var Route = createFileRoute("/dizi/$slug")({
	loader: async ({ context, params }) => {
		const s = (await context.queryClient.ensureQueryData(seriesListQuery)).find((x) => x.slug === params.slug);
		if (!s) throw notFound();
		await context.queryClient.ensureQueryData(episodeListQuery(s.id, s.slug));
		return {
			id: s.id,
			slug: s.slug
		};
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.slug} — The Human Code: 2300` },
		{
			property: "og:title",
			content: loaderData.slug
		},
		{
			property: "og:type",
			content: "video.tv_show"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] : [{ title: "Dizi bulunamadı" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
