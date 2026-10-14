import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Coins, Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TokenBadge } from "@/components/AppShell";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/jeton")({
  head: () => ({
    meta: [
      { title: "Demo Jetonlar — AI Multiverse Cinema" },
      { name: "description", content: "Kilitli bölümleri açmak için jeton paketlerinden birini seç." },
      { property: "og:title", content: "Jeton Paketleri — AI Multiverse Cinema" },
      { property: "og:description", content: "Kilitli bölümleri açmak için jeton satın al." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Shop,
});

const packs = [
  { id: "s", tokens: 50, bonus: 0, price: "Ücretsiz demo", label: "Başlangıç" },
  { id: "m", tokens: 150, bonus: 30, price: "Ücretsiz demo", label: "En Popüler", hot: true },
  { id: "l", tokens: 400, bonus: 120, price: "Ücretsiz demo", label: "Evren Gezgini" },
  { id: "xl", tokens: 1000, bonus: 400, price: "Ücretsiz demo", label: "Multiverse VIP" },
];

function Shop() {
  const { buyPack, user } = useAppState();
  const [sel, setSel] = useState("m");
  const [busy, setBusy] = useState(false);
  const pack = packs.find((p) => p.id === sel)!;

  const buy = async () => {
    setBusy(true);
    const err = await buyPack(pack.id, pack.tokens + pack.bonus, pack.price);
    setBusy(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success(`${pack.tokens + pack.bonus} jeton eklendi! (Demo)`);
  };

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-xl font-bold">Jeton <span className="text-neon">Mağazası</span></h1>
        <TokenBadge />
      </header>
      <p className="mt-2 px-5 text-sm text-muted-foreground">Her kilitli bölüm 12 demo jeton. Paketini seç, hikâyeye kesintisiz devam et.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 px-5">
        {packs.map((p) => (
          <button
            key={p.id}
            onClick={() => setSel(p.id)}
            className={`relative rounded-3xl border-2 bg-card p-4 text-left transition ${sel === p.id ? "border-primary shadow-neon" : "border-transparent"}`}
          >
            {p.hot && <span className="absolute -top-2 right-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">POPÜLER</span>}
            <p className="text-xs text-muted-foreground">{p.label}</p>
            <p className="mt-2 flex items-center gap-1.5 font-display text-2xl font-bold text-gold"><Coins className="h-5 w-5" />{p.tokens}</p>
            {p.bonus > 0 && <p className="text-xs font-semibold text-primary">+{p.bonus} bonus</p>}
            <p className="mt-3 text-sm font-bold">{p.price}</p>
          </button>
        ))}
      </div>

      <div className="mx-5 mt-6 rounded-3xl bg-card p-5">
        <p className="flex items-center gap-2 text-sm font-bold"><Crown className="h-4 w-4 text-gold" /> Paket Avantajları</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {["Tüm dizilerde geçerli", "Jetonların süresi dolmaz", "Başrol Ol özelliğiyle uyumlu", "Gerçek ödeme alınmaz"].map((t) => (
            <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{t}</li>
          ))}
        </ul>
      </div>

      {!user && (
        <p className="mx-5 mt-4 rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
          Jetonların hesabına kalıcı yazılması için{" "}
          <Link to="/giris" className="font-bold text-primary">hesabını aç</Link>.
        </p>
      )}

      <div className="px-5 pt-6">
        <button onClick={buy} disabled={busy} className="w-full rounded-full bg-neon py-4 text-sm font-bold text-primary-foreground shadow-neon disabled:opacity-60">
          {busy ? "…" : "Ücretsiz demo jetonu ekle"}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Demo modu: gerçek ödeme alınmaz.</p>
      </div>
    </AppShell>
  );
}
