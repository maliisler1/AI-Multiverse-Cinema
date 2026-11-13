import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Share as ShareIcon, RotateCcw, Play } from "lucide-react";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { AppShell } from "@/components/AppShell";
import { useT } from "@/lib/i18n";
import {
  ARCHETYPE_TEXT, AYSHE_CAPSULE, QUESTIONS, capsuleTitle, computeCapsule, loadCapsule, pick,
  saveCapsule, shareText, type CapsuleResult,
} from "@/lib/capsule";

export const Route = createFileRoute("/kapsul")({
  head: () => ({
    meta: [
      { title: "Senin kapsülün kaç? — The Human Code: 2300" },
      { name: "description", content: "Dünya'nın sonundan kurtarılan 23 kişiden hangisisin?" },
      { property: "og:title", content: "Senin kapsülün kaç? — The Human Code: 2300" },
    ],
  }),
  component: CapsuleQuiz,
});

async function shareResult(text: string, lang: string) {
  try {
    if (Capacitor.isNativePlatform()) { await Share.share({ text, dialogTitle: "The Human Code: 2300" }); return; }
    if (navigator.share) { await navigator.share({ text }); return; }
    await navigator.clipboard.writeText(text);
    toast.success(lang === "tr" ? "Kopyalandı, istediğin yere yapıştır." : "Copied — paste it anywhere.");
  } catch { /* kullanıcı iptal etti */ }
}

function CapsuleQuiz() {
  const { lang } = useT();
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<CapsuleResult | null>(() => loadCapsule());

  function answer(i: number) {
    const next = [...answers, i];
    if (next.length < QUESTIONS.length) { setAnswers(next); return; }
    const r = computeCapsule(next);
    saveCapsule(r);
    setResult(r);
    setAnswers([]);
  }

  if (result) {
    const a = ARCHETYPE_TEXT[result.archetype];
    const rare = result.capsule === AYSHE_CAPSULE;
    return (
      <AppShell>
        <div className="px-5 pt-10 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {lang === "tr" ? "Senin kapsülün" : "Your capsule"}
          </p>
          <div className={`mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-full border-4 ${rare ? "border-gold shadow-[0_0_40px_rgba(234,179,8,.6)]" : "border-primary shadow-[0_0_30px_rgba(45,212,191,.45)]"}`}>
            <span className="text-6xl font-black">{result.capsule}</span>
          </div>
          <h1 className="mt-5 text-2xl font-bold">{capsuleTitle(lang, result.capsule)}</h1>
          <p className="mt-1 text-lg font-semibold text-primary">{pick(lang, a.name)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{pick(lang, a.desc)}</p>
          {rare && (
            <p className="mt-3 text-sm font-semibold text-gold">
              {lang === "tr" ? "Çok nadir! Kullanıcıların yalnızca %2'si bu kapsülü alıyor." : "Very rare! Only 2% of people get this capsule."}
            </p>
          )}
          <button
            onClick={() => void shareResult(shareText(lang, result), lang)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground"
          >
            <ShareIcon className="h-4 w-4" /> {lang === "tr" ? "Arkadaşlarına sor: seninki kaç?" : "Ask friends: what's yours?"}
          </button>
          <Link to="/" className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold">
            <Play className="h-4 w-4" /> {lang === "tr" ? "Hikâyeyi izle" : "Watch the story"}
          </Link>
          <button onClick={() => setResult(null)} className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <RotateCcw className="h-3 w-3" /> {lang === "tr" ? "Testi tekrar çöz" : "Retake"}
          </button>
        </div>
      </AppShell>
    );
  }

  const q = QUESTIONS[answers.length]!;
  return (
    <AppShell>
      <div className="px-5 pt-10">
        <p className="text-xs text-muted-foreground">
          {answers.length + 1} / {QUESTIONS.length}
        </p>
        <div className="mt-2 h-1 rounded-full bg-secondary">
          <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${(answers.length / QUESTIONS.length) * 100}%` }} />
        </div>
        <h1 className="mt-6 text-xl font-bold">{pick(lang, q.q)}</h1>
        <div className="mt-5 space-y-3">
          {q.options.map((o, i) => (
            <button key={i} onClick={() => answer(i)} className="w-full rounded-2xl bg-card p-4 text-left text-sm font-medium active:scale-[.98]">
              {pick(lang, o)}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
