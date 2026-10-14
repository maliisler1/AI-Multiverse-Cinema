import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play } from "lucide-react";
import { AppShell, TokenBadge } from "@/components/AppShell";
import { seriesListQuery, seriesTextOf, type SeriesRow } from "@/lib/catalog";
import { categories, type Category } from "@/lib/data";
import { BUNDLED_POSTERS } from "@/lib/posters";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(seriesListQuery),
  head: () => ({
    meta: [
      { title: "AI Multiverse Cinema — Fütüristik Mini Diziler" },
      { name: "description", content: "Bilim kurgu, komedi ve duygusal fütüristik mini dizileri izle, başrolde sen ol." },
      { property: "og:title", content: "AI Multiverse Cinema" },
      { property: "og:description", content: "Fütüristik mini dizilerde başrolde sen ol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Poster({ s, className }: { s: SeriesRow; className?: string }) {
  const src = BUNDLED_POSTERS[s.slug];
  if (src) return <img src={src} alt={s.title} width={768} height={1152} loading="lazy" className={className} />;
  return (
    <div className={`${className} grid place-items-center bg-gradient-to-br from-primary/30 via-card to-accent/20`}>
      <span className="px-3 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.title}</span>
    </div>
  );
}

function Index() {
  const { data: all } = useSuspenseQuery(seriesListQuery);
  const { t, lang } = useT();
  const [cat, setCat] = useState<Category>("scifi");
  const featured = all.find((s) => s.category === cat) ?? all[0];
  if (!featured) return <AppShell><p className="px-5 pt-10 text-sm text-muted-foreground">{t("loading")}</p></AppShell>;
  const tx = seriesTextOf(featured, lang);

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI Multiverse</p>
          <h1 className="text-xl font-bold text-neon">Cinema</h1>
        </div>
        <TokenBadge />
      </header>

      <div className="mt-5 flex gap-2 overflow-x-auto px-5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              c === cat ? "bg-neon text-primary-foreground shadow-neon" : "bg-secondary text-muted-foreground"
            }`}
          >
            {t(`cat_${c}`)}
          </button>
        ))}
      </div>

      <Link to="/dizi/$slug" params={{ slug: featured.slug }} className="relative mx-5 mt-5 block overflow-hidden rounded-3xl shadow-neon animate-in fade-in" key={featured.id}>
        <Poster s={featured} className="aspect-[3/4] w-full object-cover" />
        <div className="absolute inset-0 bg-fade" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-accent-foreground">{t(`cat_${featured.category}`)}</span>
          <h2 className="mt-3 text-2xl font-bold">{featured.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tx.tagline}</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            <Play className="h-4 w-4 fill-current" /> {t("watch_now")}
          </span>
        </div>
      </Link>

      <section className="mt-8 px-5">
        <h3 className="text-sm font-bold">{t("all_universes")}</h3>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {all.map((s) => (
            <Link key={s.id} to="/dizi/$slug" params={{ slug: s.slug }} className="w-32 shrink-0">
              <Poster s={s} className="aspect-[2/3] w-full rounded-2xl object-cover" />
              <p className="mt-2 line-clamp-2 text-xs font-semibold">{s.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
