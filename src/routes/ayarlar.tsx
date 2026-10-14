import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TokenBadge } from "@/components/AppShell";
import { useAppState } from "@/lib/store";
import { useT, LANGS, LANG_NAMES, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/ayarlar")({
  head: () => ({
    meta: [
      { title: "Dil Ayarları — AI Multiverse Cinema" },
      { name: "description", content: "Uygulama, seslendirme ve altyazı dilini ayrı ayrı seç." },
      { property: "og:title", content: "Dil Ayarları — AI Multiverse Cinema" },
      { property: "og:description", content: "Uygulama, seslendirme ve altyazı dilini ayrı ayrı seç." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Settings,
});

function Picker({ label, value, onChange, allowOff, offLabel }: {
  label: string; value: string; onChange: (v: string) => void; allowOff?: boolean; offLabel?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
      >
        {allowOff && <option value="off">{offLabel}</option>}
        {LANGS.map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}
      </select>
    </label>
  );
}

function Settings() {
  const { state, update } = useAppState();
  const { t } = useT();
  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-xl font-bold">{t("settings_title")}</h1>
        <TokenBadge />
      </header>
      <p className="mt-2 px-5 text-sm text-muted-foreground">{t("settings_note")}</p>
      <div className="mt-6 space-y-5 px-5">
        <Picker label={t("ui_lang")} value={state.uiLang} onChange={(v) => update((s) => ({ ...s, uiLang: v as Lang, langChosen: true }))} />
        <Picker label={t("audio_lang")} value={state.audioLang} onChange={(v) => update((s) => ({ ...s, audioLang: v as Lang }))} />
        <Picker label={t("sub_lang")} value={state.subLang} allowOff offLabel={t("sub_off")} onChange={(v) => update((s) => ({ ...s, subLang: v as Lang | "off" }))} />
      </div>
    </AppShell>
  );
}
