import { createFileRoute, notFound } from "@tanstack/react-router";
import { SeriesView } from "@/components/SeriesView";
import { episodeListQuery, seriesListQuery } from "@/lib/catalog";

export const Route = createFileRoute("/dizi/$slug")({
  loader: async ({ context, params }) => {
    const list = await context.queryClient.ensureQueryData(seriesListQuery);
    const s = list.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    await context.queryClient.ensureQueryData(episodeListQuery(s.id, s.slug));
    return { id: s.id, slug: s.slug };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.slug} — AI Multiverse Cinema` },
          { property: "og:title", content: loaderData.slug },
          { property: "og:type", content: "video.tv_show" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Dizi bulunamadı" }, { name: "robots", content: "noindex" }],
  }),
  component: Detail,
});

function Detail() {
  const { id, slug } = Route.useLoaderData();
  return <SeriesView id={id} slug={slug} />;
}
