import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/i18n", () => ({ useT: () => ({ lang: "tr", t: (k: string) => k }) }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getSession: async () => ({ data: { session: { access_token: "tok" } } }) },
    storage: {
      from: () => ({
        createSignedUrl: async () => ({ data: { signedUrl: "https://example.test/face.jpg" } }),
        upload: async () => ({ error: null }),
      }),
    },
  },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

import { ProductionPanel } from "@/components/ProductionPanel";

const overview = (over: Record<string, unknown> = {}) => ({
  title: { tr: "Uyanış", en: "Awakening" },
  durationSec: 180,
  hasReference: true,
  referencePath: "productions/neo-genesis-2099/e1/ref/face.jpg",
  runwayConfigured: true,
  creditBalance: 1923,
  speakers: { ayshe: { name: "AyShe", defaultVoice: "Maya" } },
  voicePresets: ["Maya", "Katie"],
  ttsModels: ["eleven_v3", "eleven_multilingual_v2"],
  langs: ["tr", "en"],
  clips: [{ key: "c01", scene: 1, duration: 10, face: false, motion: "m" }],
  lines: [{ key: "l01", scene: 1, speaker: "ayshe", at: 3, text: "Yıl 2300." }],
  steps: [
    { step: "keyframes", total: 1, succeeded: 0, inFlight: 0, failed: 0, nextCredits: 8 },
    { step: "clips", total: 1, succeeded: 0, inFlight: 0, failed: 0, nextCredits: 0 },
    { step: "voices", total: 2, succeeded: 0, inFlight: 0, failed: 0, nextCredits: 2 },
  ],
  jobs: [],
  ...over,
});

type Call = { action: string; [k: string]: unknown };
let calls: Call[] = [];
let respond: (c: Call) => { status: number; body: unknown };

beforeEach(() => {
  calls = [];
  respond = () => ({ status: 200, body: overview() });
  vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
    const c = JSON.parse(String(init.body)) as Call;
    calls.push(c);
    const r = respond(c);
    return new Response(JSON.stringify(r.body), { status: r.status });
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Bölüm üretimi paneli", () => {
  it("bölümü, krediyi ve adımları gösterir", async () => {
    render(<ProductionPanel />);
    expect(await screen.findByText(/Bölüm 1: Uyanış/)).toBeVisible();
    expect(screen.getByText("1923")).toBeVisible();
    expect(screen.getByText("1. Başlangıç kareleri")).toBeVisible();
    expect(screen.getByRole("button", { name: /Üret · ≈8 kredi/ })).toBeEnabled();
    expect(calls[0]).toMatchObject({ action: "overview", seriesSlug: "neo-genesis-2099", episode: 1 });
  });

  it("onay vermeden üretim başlamaz; onayla sunucunun tutarı gönderilir", async () => {
    respond = (c) =>
      c.action === "start" && c["expectedCredits"] === -1
        ? { status: 409, body: { error: "onay", credits: 8 } }
        : c.action === "start"
          ? { status: 200, body: { queued: 1, credits: 8, submitted: 1, dailyLimit: false } }
          : { status: 200, body: overview() };
    render(<ProductionPanel />);
    fireEvent.click(await screen.findByRole("button", { name: /Üret · ≈8 kredi/ }));
    expect(await screen.findByText(/yaklaşık 8 Runway kredisi/)).toBeVisible();
    expect(calls.filter((c) => c.action === "start")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Onayla ve başlat" }));
    await waitFor(() =>
      expect(calls.at(-2)).toMatchObject({ action: "start", step: "keyframes", expectedCredits: 8 }),
    );
  });

  it("fotoğraf yoksa kare üretimi kilitli", async () => {
    respond = () => ({ status: 200, body: overview({ hasReference: false }) });
    render(<ProductionPanel />);
    expect(await screen.findByText("Önce başrol fotoğrafını yükleyin.")).toBeVisible();
    expect(screen.queryByRole("button", { name: /Üret · ≈8 kredi/ })).toBeNull();
  });

  it("sunucu hatasını gösterir", async () => {
    respond = () => ({ status: 403, body: { error: "Bu işlem yalnızca yöneticiler içindir" } });
    render(<ProductionPanel />);
    expect(await screen.findByText("Bu işlem yalnızca yöneticiler içindir")).toBeVisible();
  });
});
