import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Crown, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TokenBadge } from "@/components/AppShell";
import { useAppState } from "@/lib/store";
import { season } from "@/lib/season";
import { useT } from "@/lib/i18n";

// Adres /jeton olarak kaldı (eski bağlantılar bozulmasın); sayfa artık "Sezonu Satın Al".
export const Route = createFileRoute("/jeton")({
  head: () => ({
    meta: [
      { title: "Sezonu Satın Al — The Human Code: 2300" },
      { name: "description", content: "Tüm bölümleri reklamsız ve internetsiz izle." },
      { property: "og:title", content: "Sezonu Satın Al — The Human Code: 2300" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SeasonShop,
});

function SeasonShop() {
  const { state, update } = useAppState();
  const { t } = useT();
  const [price, setPrice] = useState<string | null>(null);
  const [canBuy, setCanBuy] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    void season.available().then((ok) => {
      if (live) setCanBuy(ok);
    });
    void season.price().then((p) => {
      if (live) setPrice(p);
    });
    return () => {
      live = false;
    };
  }, []);

  const buy = async () => {
    setBusy(true);
    try {
      const ok = await season.buy();
      if (ok) {
        update((s) => ({ ...s, seasonOwned: true }));
        toast.success(t("season_thanks"));
      }
    } catch {
      toast.error(t("season_error"));
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    const owned = await season.check();
    setBusy(false);
    if (owned === null) {
      toast.error(t("season_error"));
      return;
    }
    update((s) => ({ ...s, seasonOwned: owned }));
    if (owned) toast.success(t("season_restored"));
    else toast.info(t("season_none"));
  };

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-xl font-bold">{t("season_title")}</h1>
        <TokenBadge />
      </header>

      <div className="mx-5 mt-6 rounded-3xl border-2 border-primary bg-card p-5 shadow-neon">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Crown className="h-4 w-4 text-gold" /> The Human Code: 2300 · {t("season_1")}
        </p>
        <p className="mt-3 font-display text-3xl font-bold text-gold">
          {state.seasonOwned ? t("season_owned") : (price ?? "5 USD")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{t("season_once")}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {["season_perk1", "season_perk2", "season_perk3", "season_perk4"].map((k) => (
            <li key={k} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              {t(k)}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-5 pt-6">
        {!state.seasonOwned && (
          <button
            onClick={() => void buy()}
            disabled={busy || canBuy !== true}
            className="w-full rounded-full bg-neon py-4 text-sm font-bold text-primary-foreground shadow-neon disabled:opacity-60"
          >
            {busy ? "…" : t("season_buy")}
          </button>
        )}
        {canBuy === false && (
          <p className="mt-3 text-center text-xs text-muted-foreground">{t("season_play_only")}</p>
        )}
        <button
          onClick={() => void restore()}
          disabled={busy || canBuy !== true}
          className="mx-auto mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" /> {t("season_restore")}
        </button>
      </div>
    </AppShell>
  );
}
