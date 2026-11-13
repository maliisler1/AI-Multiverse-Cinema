/**
 * "Senin kapsülün kaç?" testi. 5 soru × 4 cevap; cevaplardan 1–23 arası
 * kapsül ve bir karakter tipi çıkar. 23 AyShe'nin kapsülüdür ve en nadir
 * sonuçtur (~%2). 7 Leon'un kapsülüdür.
 */
export type Archetype = "explorer" | "guardian" | "sage" | "healer";
const ARCHETYPES: Archetype[] = ["explorer", "guardian", "sage", "healer"];
export const AYSHE_CAPSULE = 23;
export const LEON_CAPSULE = 7;

type L = { tr: string; en: string };
export type Question = { q: L; options: [L, L, L, L] };

/** Her sorunun i. cevabı ARCHETYPES[i] tipine puan verir. */
export const QUESTIONS: Question[] = [
  {
    q: { tr: "Dünya'nın son günü. Yanına tek bir şey alabilirsin:", en: "Earth's last day. You can take one thing:" },
    options: [
      { tr: "Bir harita", en: "A map" },
      { tr: "Ailemin fotoğrafı", en: "My family's photo" },
      { tr: "Bir kitap", en: "A book" },
      { tr: "Bir avuç toprak ve tohum", en: "A handful of soil and seeds" },
    ],
  },
  {
    q: { tr: "Kapsülün açıldı, etraf karanlık. İlk ne yaparsın?", en: "Your capsule opens, it's dark. What do you do first?" },
    options: [
      { tr: "Işığa doğru yürürüm", en: "Walk toward the light" },
      { tr: "Diğer kapsülleri kontrol ederim", en: "Check the other capsules" },
      { tr: "Durup sesleri dinlerim", en: "Stop and listen" },
      { tr: "Yaralı var mı diye bakarım", en: "Look for anyone injured" },
    ],
  },
  {
    q: { tr: "Maskeli bir yabancı yardım teklif ediyor:", en: "A masked stranger offers help:" },
    options: [
      { tr: "Peşinden giderim, risk alırım", en: "I follow, I take the risk" },
      { tr: "Önce grubumu korurum", en: "I protect my group first" },
      { tr: "Ona sorular sorarım", en: "I ask questions" },
      { tr: "Elini tutarım, belki o da korkuyordur", en: "I take its hand — maybe it's scared too" },
    ],
  },
  {
    q: { tr: "Yeni gezegende ilk görevin ne olsun?", en: "Your first job on the new planet?" },
    options: [
      { tr: "Bilinmeyen toprakları keşfetmek", en: "Explore unknown lands" },
      { tr: "Herkes için güvenli bir kamp kurmak", en: "Build a safe camp for all" },
      { tr: "Uzaylıların dilini çözmek", en: "Decode the aliens' language" },
      { tr: "İlk bahçeyi ekmek", en: "Plant the first garden" },
    ],
  },
  {
    q: { tr: "İnsanlığı kurtaracak olan nedir?", en: "What will save humanity?" },
    options: [
      { tr: "Cesaret", en: "Courage" },
      { tr: "Sadakat", en: "Loyalty" },
      { tr: "Bilgi", en: "Knowledge" },
      { tr: "Umut", en: "Hope" },
    ],
  },
];

export const ARCHETYPE_TEXT: Record<Archetype, { name: L; desc: L }> = {
  explorer: {
    name: { tr: "Kâşif", en: "Explorer" },
    desc: { tr: "Yeni gezegene ilk adımı sen atacaksın.", en: "You'll take the first step on the new world." },
  },
  guardian: {
    name: { tr: "Koruyucu", en: "Guardian" },
    desc: { tr: "Leon gibi: önce başkalarını düşünürsün.", en: "Like Leon: you put others first." },
  },
  sage: {
    name: { tr: "Bilge", en: "Sage" },
    desc: { tr: "Taran'ın sırlarını çözecek olan sensin.", en: "You're the one who'll crack Taran's secrets." },
  },
  healer: {
    name: { tr: "Şifacı", en: "Healer" },
    desc: { tr: "İnsanlığın yaralarını sen saracaksın.", en: "You'll heal humanity's wounds." },
  },
};

export type CapsuleResult = { capsule: number; archetype: Archetype };

export function computeCapsule(answers: number[]): CapsuleResult {
  if (answers.length !== QUESTIONS.length || answers.some((a) => !Number.isInteger(a) || a < 0 || a > 3)) {
    throw new Error("invalid answers");
  }
  const counts = [0, 0, 0, 0];
  for (const a of answers) counts[a]!++;
  const max = Math.max(...counts);
  // Eşitlikte son sorunun ("insanlığı ne kurtarır") cevabı belirler.
  const last = answers[answers.length - 1]!;
  const idx = counts[last] === max ? last : counts.indexOf(max);
  const archetype = ARCHETYPES[idx]!;

  const code = answers.reduce((acc, a, i) => acc + a * 4 ** i, 0); // 0..1023
  const capsule = code % 47 === 0 ? AYSHE_CAPSULE : ((code * 7 + 3) % 22) + 1;
  return { capsule, archetype };
}

export function pick(lang: string, l: L) {
  return lang === "tr" ? l.tr : l.en;
}

export function capsuleTitle(lang: string, capsule: number) {
  if (capsule === AYSHE_CAPSULE) return lang === "tr" ? "AyShe'nin kapsülü!" : "AyShe's capsule!";
  if (capsule === LEON_CAPSULE) return lang === "tr" ? "Leon'un kapsülü!" : "Leon's capsule!";
  return lang === "tr" ? `Kapsül ${capsule}` : `Capsule ${capsule}`;
}

export function shareText(lang: string, r: CapsuleResult) {
  const type = pick(lang, ARCHETYPE_TEXT[r.archetype].name);
  return lang === "tr"
    ? `Dünya'nın sonundan kurtarılan 23 kişiden biriyim: Kapsül ${r.capsule} · ${type} 🚀 Seninki kaç? The Human Code: 2300`
    : `I'm one of the 23 saved from Earth's end: Capsule ${r.capsule} · ${type} 🚀 What's yours? The Human Code: 2300`;
}

const KEY = "amc-capsule";
export function loadCapsule(): CapsuleResult | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null") as CapsuleResult | null;
    return v && typeof v.capsule === "number" && v.archetype in ARCHETYPE_TEXT ? v : null;
  } catch {
    return null;
  }
}
export function saveCapsule(r: CapsuleResult) {
  try { localStorage.setItem(KEY, JSON.stringify(r)); } catch { /* yok say */ }
}
