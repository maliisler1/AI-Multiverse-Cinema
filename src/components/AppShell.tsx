import { Link } from "@tanstack/react-router";
import { Hop as Home, User, Coins, Languages, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAppState } from "@/lib/store";
import { useT, detectDeviceLang, LANG_NAMES, RTL, translate, type Lang } from "@/lib/i18n";

import { ads } from "@/lib/ads";

export function TokenBadge() {
  const { state, user, isAdmin } = useAppState();
  return (
    <div className="flex items-center gap-2">
      <Link to="/jeton" className="flex items-center gap-1.5 rounded-full glass border px-3 py-1.5 text-sm font-bold text-gold">
        <Coins className="h-4 w-4" /> {state.tokens}
      </Link>
      {isAdmin && (
        <Link to="/yonetim" className="rounded-full glass border p-2 text-primary" aria-label="Yönetim">
          <ShieldCheck className="h-4 w-4" />
        </Link>
      )}
      <Link to={user ? "/profil" : "/giris"} className="rounded-full glass border p-2" aria-label="Hesabım">
        <User className="h-4 w-4" />
      </Link>
    </div>
  );
}

function LanguageSuggestion() {
  const { state, update, ready } = useAppState();
  const [device, setDevice] = useState<Lang | null>(null);
  useEffect(() => setDevice(detectDeviceLang()), []);
  if (!ready || state.langChosen || !device) return null;
  const name = LANG_NAMES[device];
  const t = (k: string) => translate(device, k, { lang: name });
  const accept = () =>
    update((s) => ({ ...s, uiLang: device, audioLang: device, subLang: device, langChosen: true }));
  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-background/70 p-4 backdrop-blur-sm" dir={RTL.includes(device) ? "rtl" : "ltr"}>
      <div className="mx-auto w-full max-w-md rounded-3xl border bg-card p-6">
        <Languages className="h-6 w-6 text-primary" />
        <h2 className="mt-3 text-lg font-bold">{t("suggest_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("suggest_body")}</p>
        <button onClick={accept} className="mt-5 w-full rounded-full bg-neon py-3 text-sm font-bold text-primary-foreground shadow-neon">
          {t("suggest_yes")}
        </button>
        <Link
          to="/ayarlar"
          onClick={() => update((s) => ({ ...s, langChosen: true }))}
          className="mt-2 block w-full rounded-full bg-secondary py-3 text-center text-sm font-semibold"
        >
          {t("suggest_other")}
        </Link>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang } = useT();
  useEffect(() => { void ads.start(); }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  }, [lang]);
  const nav = [
    { to: "/", label: t("nav_home"), icon: Home },
    { to: "/profil", label: t("nav_star"), icon: User },
    { to: "/jeton", label: t("nav_tokens"), icon: Coins },
    { to: "/ayarlar", label: t("nav_settings"), icon: Languages },
  ] as const;
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background app-safe-top app-ad-space">
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md glass border-t app-safe-bottom app-ad-nav">
        <div className="grid grid-cols-4">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <LanguageSuggestion />
    </div>
  );
}
