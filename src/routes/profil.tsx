import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Camera, Sparkles, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TokenBadge } from "@/components/AppShell";
import { LocalPrivacy } from "@/components/LocalPrivacy";
import { useAppState } from "@/lib/store";
import { seriesListQuery } from "@/lib/catalog";
import { BUNDLED_POSTERS } from "@/lib/posters";

export const Route = createFileRoute("/profil")({
  loader: ({ context }) => context.queryClient.ensureQueryData(seriesListQuery),
  head: () => ({
    meta: [
      { title: "Başrol Ol — AI Multiverse Cinema" },
      { name: "description", content: "Yüz fotoğrafını yükle, fütüristik dizilerde başrol sen ol." },
      { property: "og:title", content: "Başrol Ol — AI Multiverse Cinema" },
      { property: "og:description", content: "Yüz fotoğrafını yükle, başrol sen ol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { data: all } = useSuspenseQuery(seriesListQuery);
  const { state, update, uploadPhoto, user, signOut } = useAppState();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    const err = await uploadPhoto(f);
    setBusy(false);
    if (err) toast.error(err);
    else toast.success("Fotoğrafın afiş önizlemesine eklendi.");
  };

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-xl font-bold">Başrol <span className="text-neon">Ol</span></h1>
        <TokenBadge />
      </header>
      <p className="mt-2 px-5 text-sm text-muted-foreground">Fotoğrafını ve adını afiş önizlemesinde gör. Videoya yüz yerleştirme henüz hazır değil.</p>

      <div className="mt-8 flex flex-col items-center">
        <button onClick={() => input.current?.click()} className="relative rounded-full bg-neon p-1 shadow-neon">
          <div className="grid h-40 w-40 place-items-center overflow-hidden rounded-full bg-card">
            {state.photo ? (
              <img src={state.photo} alt="Profil fotoğrafı" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <span className="absolute bottom-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Camera className="h-5 w-5" />
          </span>
        </button>
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
        <div className="mt-5 flex gap-2">
          <button onClick={() => input.current?.click()} disabled={busy} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {busy ? "…" : state.photo ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
          </button>
          {state.photo && !user && (
            <button onClick={() => update((s) => ({ ...s, photo: null }))} className="rounded-full bg-secondary p-2.5" aria-label="Fotoğrafı sil">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-5 mt-8">
        <label className="text-xs font-semibold text-muted-foreground">Karakter Adın</label>
        <input
          value={state.name.slice(0, 40)}
          maxLength={40}
          onChange={(e) => update((s) => ({ ...s, name: e.target.value.slice(0, 40) }))}
          placeholder="Örn: Kaptan Nova"
          className="mt-2 w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">{Math.min(state.name.length, 40)}/40</p>
      </div>

      <section className="mx-5 mt-8">
        <h2 className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-accent" /> Başrol Önizlemesi</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {all.slice(0, 3).map((s) => (
            <div key={s.id} className="relative overflow-hidden rounded-2xl">
              {BUNDLED_POSTERS[s.slug] ? (
                <img src={BUNDLED_POSTERS[s.slug]} alt={s.title} loading="lazy" width={768} height={1152} className="aspect-[2/3] w-full object-cover" />
              ) : (
                <div className="aspect-[2/3] w-full bg-gradient-to-br from-primary/30 via-card to-accent/20" />
              )}
              <div className="absolute inset-0 bg-fade" />
              {state.photo && (
                <img src={state.photo} alt="" className="absolute left-1/2 top-1/3 h-12 w-12 -translate-x-1/2 rounded-full border-2 border-primary object-cover" />
              )}
              <p className="absolute inset-x-1 bottom-1 text-center text-[9px] font-bold">{state.name || "Sen"}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-5 mt-8 rounded-3xl bg-card p-5">
        {user ? (
          <>
            <p className="text-xs text-muted-foreground">Hesabın</p>
            <p className="mt-1 break-all text-sm font-semibold">{user.email}</p>
            <button onClick={() => void signOut()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold">
              <LogOut className="h-4 w-4" /> Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold">Hesabın yok</p>
            <p className="mt-1 text-xs text-muted-foreground">Misafir modunda ilerlemen yalnızca bu cihazda saklanır.</p>
            <Link to="/giris" className="mt-4 block rounded-full bg-neon py-3 text-center text-sm font-bold text-primary-foreground shadow-neon">
              Giriş Yap / Kayıt Ol
            </Link>
          </>
        )}
      </div>
      <LocalPrivacy />
    </AppShell>
  );
}
