import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clapperboard, Sparkles, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SeriesView } from "@/components/SeriesView";
import { episodeListQuery, seriesListQuery, type SeriesRow } from "@/lib/catalog";
import { FEATURED_SLUG } from "@/lib/data";
import { BUNDLED_POSTERS } from "@/lib/posters";
import { useT } from "@/lib/i18n";

/** Ana dizi: önce sabit slug, yoksa ilk yayımlanmış dizi, yoksa listedeki ilk dizi. */
export function pickFeatured(all: SeriesRow[]): SeriesRow | undefined {
  return all.find((s) => s.slug === FEATURED_SLUG) ?? all.find((s) => s.status === "published") ?? all[0];
}

/** Ana dizi dışında yalnızca yayımlanmış diziler gösterilir; yeni dizi yayımlanınca kendiliğinden belirir. */
export function otherPublished(all: SeriesRow[], featured: SeriesRow | undefined): SeriesRow[] {
  return all.filter((s) => s.id !== featured?.id && s.status === "published");
}

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const all = await context.queryClient.ensureQueryData(seriesListQuery);
    const f = pickFeatured(all);
    if (f) await context.queryClient.ensureQueryData(episodeListQuery(f.id, f.slug));
    return null;
  },
  head: () => ({
    meta: [
      { title: "The Human Code: 2300" },
      { name: "description", content: "The Human Code: 2300 dizisinin tüm bölümlerini izle." },
      { property: "og:title", content: "The Human Code: 2300" },
      { property: "og:description", content: "İnsanlığın kurtuluşu DNA'nda yazılı." },
      { property: "og:type", content: "video.tv_show" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: all } = useSuspenseQuery(seriesListQuery);
  const { t } = useT();
  const featured = pickFeatured(all);
  if (!featured) return <AppShell><p className="px-5 pt-10 text-sm text-muted-foreground">{t("loading")}</p></AppShell>;
  const others = otherPublished(all, featured);

  return (
    <SeriesView id={featured.id} slug={featured.slug} home>
      <section className="mt-8">
        <h2 className="text-sm font-bold">{t("extras")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4">
            <UserRound className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-semibold">{t("extra_cast")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("coming_soon")}</p>
          </div>
          <div className="rounded-2xl bg-card p-4">
            <Clapperboard className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-semibold">{t("extra_bts")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("coming_soon")}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-dashed p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Sparkles className="h-4 w-4 text-gold" /> {t("next_season")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{t("next_season_note")}</p>
      </section>

      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold">{t("more_series")}</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {others.map((s) => {
              const src = BUNDLED_POSTERS[s.slug];
              return (
                <Link key={s.id} to="/dizi/$slug" params={{ slug: s.slug }} className="w-32 shrink-0">
                  {src ? (
                    <img src={src} alt={s.title} width={768} height={1152} loading="lazy" className="aspect-[2/3] w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="grid aspect-[2/3] w-full place-items-center rounded-2xl bg-gradient-to-br from-primary/30 via-card to-accent/20">
                      <span className="px-3 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.title}</span>
                    </div>
                  )}
                  <p className="mt-2 line-clamp-2 text-xs font-semibold">{s.title}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </SeriesView>
  );
}
