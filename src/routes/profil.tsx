import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { AppShell, TokenBadge } from "@/components/AppShell";
import { LocalPrivacy } from "@/components/LocalPrivacy";
import { useAppState } from "@/lib/store";

// Hesap sayfası. "Başrol Ol" (yüz fotoğrafı yükleme ve afiş önizlemesi) uygulamadan kaldırıldı.
export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Hesabım — AI Multiverse Cinema" },
      { name: "description", content: "AI Multiverse Cinema hesabın." },
      { property: "og:title", content: "Hesabım — AI Multiverse Cinema" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, signOut } = useAppState();

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-xl font-bold">Hesabım</h1>
        <TokenBadge />
      </header>

      <div className="mx-5 mt-8 rounded-3xl bg-card p-5">
        {user ? (
          <>
            <p className="text-xs text-muted-foreground">Hesabın</p>
            <p className="mt-1 break-all text-sm font-semibold">{user.email}</p>
            <button
              onClick={() => void signOut()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold"
            >
              <LogOut className="h-4 w-4" /> Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold">Hesabın yok</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Misafir modunda ilerlemen yalnızca bu cihazda saklanır.
            </p>
            <Link
              to="/giris"
              className="mt-4 block rounded-full bg-neon py-3 text-center text-sm font-bold text-primary-foreground shadow-neon"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          </>
        )}
      </div>
      <LocalPrivacy />
    </AppShell>
  );
}
