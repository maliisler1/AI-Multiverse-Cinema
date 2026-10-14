import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import { Mail, Lock, User, Chromium as Chrome, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/giris")({
  head: () => ({
    meta: [
      { title: "Giriş / Kayıt — AI Multiverse Cinema" },
      { name: "description", content: "Hesabını aç; jetonların, fotoğrafın ve ilerlemen her cihazda seninle gelsin." },
      { property: "og:title", content: "Hesabını aç — AI Multiverse Cinema" },
      { property: "og:description", content: "Jetonların, yüz fotoğrafın ve izleme ilerlemen her cihazda seninle gelir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { t } = useT();
  const nav = useNavigate();
  const { signIn, signUp, signInGoogle, user } = useAppState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <AppShell>
        <div className="px-5 pt-10 text-center">
          <p className="text-sm text-muted-foreground">{t("welcome")}</p>
          <p className="mt-1 break-all font-bold">{user.email}</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-neon px-6 py-3 text-sm font-bold text-primary-foreground shadow-neon">
            {t("nav_home")}
          </Link>
        </div>
      </AppShell>
    );
  }

  const submit = async () => {
    if (!email.trim() || !password) {
      toast.error(t("fill_fields"));
      return;
    }
    if (mode === "up" && password.length < 6) {
      toast.error(t("weak_pass"));
      return;
    }
    setBusy(true);
    const err = mode === "in" ? await signIn(email.trim(), password) : await signUp(email.trim(), password, name.trim());
    setBusy(false);
    if (err) {
      toast.error(err);
      return;
    }
    if (mode === "up") toast.info(t("email_sent"));
    nav({ to: "/" });
  };

  return (
    <AppShell>
      <header className="flex items-center gap-3 px-5 pt-6">
        <Link to="/" className="rounded-full glass p-2" aria-label={t("back")}>
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{t("auth_title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth_sub")}</p>
        </div>
      </header>

      <div className="mx-5 mt-6 space-y-3 rounded-3xl bg-card p-5">
        {mode === "up" && (
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">{t("your_name")}</span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-background px-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" placeholder="Örn: Kaptan Nova" />
            </div>
          </label>
        )}
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">{t("email")}</span>
          <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-background px-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" className="w-full bg-transparent py-3 text-sm outline-none" placeholder="ornek@eposta.com" />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">{t("password")}</span>
          <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-background px-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} className="w-full bg-transparent py-3 text-sm outline-none" placeholder="••••••" />
          </div>
        </label>

        <button onClick={submit} disabled={busy} className="w-full rounded-full bg-neon py-3.5 text-sm font-bold text-primary-foreground shadow-neon disabled:opacity-60">
          {busy ? t("loading") : mode === "in" ? t("sign_in") : t("sign_up")}
        </button>

        {!Capacitor.isNativePlatform() && <button
          onClick={async () => {
            const err = await signInGoogle();
            if (err) toast.error(err);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full border bg-background py-3 text-sm font-semibold"
        >
          <Chrome className="h-4 w-4" /> {t("continue_google")}
        </button>}

        <p className="pt-1 text-center text-sm text-muted-foreground">
          {mode === "in" ? t("no_account") : t("have_account")}{" "}
          <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="font-bold text-primary">
            {mode === "in" ? t("sign_up") : t("sign_in")}
          </button>
        </p>
      </div>

      <p className="mx-5 mt-4 text-center text-[11px] text-muted-foreground">{t("guest_note")}</p>
    </AppShell>
  );
}
