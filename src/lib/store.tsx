import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LANGS, type Lang } from "./i18n";

export const EPISODE_COST = 12;

export type State = {
  tokens: number;
  unlocked: string[];
  lastWatched: { slug: string; n: number } | null;
  resume: Record<string, number>;
  photo: string | null;
  name: string;
  uiLang: Lang;
  audioLang: Lang;
  subLang: Lang | "off";
  langChosen: boolean;
};

const KEY = "amc-…e-v3";
const DEFAULT_UI: Lang = "tr";

const initial: State = {
  tokens: 60,
  unlocked: [],
  lastWatched: null,
  resume: {},
  photo: null,
  name: "",
  uiLang: DEFAULT_UI,
  audioLang: DEFAULT_UI,
  subLang: DEFAULT_UI,
  langChosen: false,
};

const isLang = (v: unknown): v is Lang => typeof v === "string" && (LANGS as readonly string[]).includes(v);

function readLocal(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial, ...(JSON.parse(raw) as Partial<State>) };
  } catch {
    /* ignore */
  }
  return initial;
}

function save(s: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/** Özel kovadaki yüz fotoğrafı için kısa süreli erişim bağlantısı. */
async function signFace(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("faces").createSignedUrl(path, 60 * 60 * 24 * 7);
  return error ? null : data.signedUrl;
}

type Ctx = {
  state: State;
  ready: boolean;
  signedIn: boolean;
  isAdmin: boolean;
  user: { id: string; email: string | null } | null;
  update: (patch: Partial<State> | ((s: State) => State)) => void;
  buyPack: (packId: string, tokens: number, amount: string) => Promise<string | null>;
  unlockEpisode: (episodeId: string, cost: number) => Promise<string | null>;
  uploadPhoto: (file: File) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signInGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
  clearLocal: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<Ctx["user"]>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const userRef = useRef<Ctx["user"]>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  /** Sunucudaki (veritabanı) hesap kopyasını yerel kopyanın önüne geçirir. */
  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, photo_url, tokens, ui_lang, audio_lang, sub_lang, lang_chosen, email")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return;
    const patch: Partial<State> = {
      tokens: data.tokens ?? 0,
      name: data.display_name ?? "",
      langChosen: !!data.lang_chosen,
    };
    if (isLang(data.ui_lang)) patch.uiLang = data.ui_lang;
    if (isLang(data.audio_lang)) patch.audioLang = data.audio_lang;
    if (isLang(data.sub_lang)) patch.subLang = data.sub_lang;
    else if (data.sub_lang === "off") patch.subLang = "off";
    const { data: unlocked } = await supabase.from("unlocked_episodes").select("episode_id").eq("user_id", userId);
    if (unlocked) patch.unlocked = unlocked.map((row) => row.episode_id);
    const stored = typeof data.photo_url === "string" ? data.photo_url : null;
    patch.photo = stored ? (stored.startsWith("http") ? stored : await signFace(stored)) : null;
    userRef.current = { id: userId, email: data.email ?? null };
    const next = { ...stateRef.current, ...patch };
    setState(next);
    save(next);
  }, []);

  const checkAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
    setIsAdmin(data?.role === "admin");
  }, []);

  useEffect(() => {
    let alive = true;
    const apply = async (session: { user: { id: string; email?: string } } | null) => {
      if (!alive) return;
      if (session?.user) {
        const u = { id: session.user.id, email: session.user.email ?? null };
        userRef.current = u;
        setUser(u);
        await loadProfile(session.user.id);
        await checkAdmin(session.user.id);
      } else {
        userRef.current = null;
        setUser(null);
        setIsAdmin(false);
        setState(readLocal());
      }
    };
    const boot = async () => {
      setState(readLocal());
      const { data } = await supabase.auth.getSession();
      await apply(data.session);
      if (alive) setReady(true);
    };
    void boot();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => { if (alive) void apply(session); }, 0);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile, checkAdmin]);

  /** Yerel kopyayı her zaman güncel tutar; giriş yapıldıysa değişen alanları sunucuya da yazar. */
  const update = useCallback((patch: Partial<State> | ((s: State) => State)) => {
    const prev = stateRef.current;
    const part = typeof patch === "function" ? patch(prev) : patch;
    const next = { ...prev, ...part };
    stateRef.current = next;
    setState(next);
    save(next);
    const uid = userRef.current?.id;
    if (!uid) return;
    const cols: {
      tokens?: number;
      display_name?: string;
      ui_lang?: string;
      audio_lang?: string;
      sub_lang?: string;
      lang_chosen?: boolean;
      photo_url?: string | null;
    } = {};
    if (next.tokens !== prev.tokens) cols.tokens = next.tokens;
    if (next.name !== prev.name) cols.display_name = next.name;
    if (next.uiLang !== prev.uiLang) cols.ui_lang = next.uiLang;
    if (next.audioLang !== prev.audioLang) cols.audio_lang = next.audioLang;
    if (next.subLang !== prev.subLang) cols.sub_lang = next.subLang;
    if (next.langChosen !== prev.langChosen) cols.lang_chosen = next.langChosen;
    if (part.photo === null) cols.photo_url = null;
    if (Object.keys(cols).length) void supabase.from("profiles").update(cols).eq("user_id", uid);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return error.message;
      if (data.session?.user) await loadProfile(data.session.user.id);
      return null;
    },
    [loadProfile],
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } });
      if (error) return error.message;
      if (data.session?.user) {
        await loadProfile(data.session.user.id);
        return null;
      }
      return "E-posta onayı gerekiyor: gelen kutunuzu kontrol edin.";
    },
    [loadProfile],
  );

  const signInGoogle = useCallback(async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) return String(res.error);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const buyPack = useCallback(
    async (packId: string, tokens: number, amount: string) => {
      const uid = userRef.current?.id;
      if (!uid) {
        update({ tokens: stateRef.current.tokens + tokens });
        return null;
      }
      const { error } = await supabase.rpc("buy_pack", { p_pack_id: packId, p_tokens: tokens, p_amount: amount });
      if (error) return error.message;
      await loadProfile(uid);
      return null;
    },
    [update, loadProfile],
  );

  const unlockEpisode = useCallback(
    async (episodeId: string, cost: number) => {
      if (stateRef.current.unlocked.includes(episodeId)) return null;
      const uid = userRef.current?.id;
      if (!uid) {
        update({ tokens: stateRef.current.tokens - cost, unlocked: [...stateRef.current.unlocked, episodeId] });
        return null;
      }
      const { error } = await supabase.rpc("unlock_episode", { p_episode_id: episodeId, p_cost: cost });
      if (error) return error.message;
      await loadProfile(uid);
      return null;
    },
    [update, loadProfile],
  );

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return "Lütfen bir görsel dosyası seçin.";
      const uid = userRef.current?.id;
      if (!uid) {
        const blob = await toSquareJpeg(file);
        const photo = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Fotoğraf okunamadı"));
          reader.readAsDataURL(blob);
        });
        update({ photo });
        return null;
      }
      const path = `${uid}/face.jpg`;
      const blob = await toSquareJpeg(file);
      const { error } = await supabase.storage.from("faces").upload(path, blob, { upsert: true, contentType: "image/jpeg" });
      if (error) return error.message;
      const { error: pe } = await supabase.from("profiles").update({ photo_url: path }).eq("user_id", uid);
      if (pe) return pe.message;
      update({ photo: await signFace(path) });
      return null;
    },
    [update],
  );

  const clearLocal = useCallback(async () => {
    if (stateRef.current.photo?.startsWith("blob:")) URL.revokeObjectURL(stateRef.current.photo);
    await supabase.auth.signOut({ scope: "local" });
    localStorage.removeItem(KEY);
    const reset = { ...initial, uiLang: stateRef.current.uiLang, langChosen: true };
    userRef.current = null;
    stateRef.current = reset;
    setUser(null);
    setIsAdmin(false);
    setState(reset);
    save(reset);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      ready,
      signedIn: !!user,
      isAdmin,
      user,
      update,
      buyPack,
      unlockEpisode,
      uploadPhoto,
      signIn,
      signUp,
      signInGoogle,
      signOut,
      clearLocal,
    }),
    [state, ready, user, isAdmin, update, buyPack, unlockEpisode, uploadPhoto, signIn, signUp, signInGoogle, signOut, clearLocal],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useAppState(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useAppState, AppStateProvider içinde kullanılmalıdır");
  return ctx;
}

/** Yüklenen fotoğrafı 1:1 kare kesip küçük JPEG'e çevirir (deposu şişirmemek için). */
async function toSquareJpeg(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const sx = (bmp.width - side) / 2;
  const sy = (bmp.height - side) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 720;
  const g = canvas.getContext("2d");
  if (!g) return file;
  g.drawImage(bmp, sx, sy, side, side, 0, 0, 720, 720);
  bmp.close();
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.85);
  });
}
