import neo from "@/assets/neo-genesis.jpg";
import cyber from "@/assets/cyber-glitch.jpg";
import hearts from "@/assets/neon-hearts.jpg";
import type { Lang } from "@/lib/i18n";

export type Category = "scifi" | "comedy" | "romance";
export const categories: Category[] = ["scifi", "comedy", "romance"];

/** Bir dildeki ses veya altyazı parçasının durumu. Yalnızca "ready" olanlar oynatılabilir. */
export type TrackStatus = "ready" | "planned" | "none";

export type Series = {
  id: string;
  title: string;
  category: Category;
  poster: string;
  text: Partial<Record<Lang, { tagline: string; description: string }>>;
  /** Tek görüntü dosyası üzerinde dil başına ses parçası durumu */
  audio: Partial<Record<Lang, TrackStatus>>;
  /** Dil başına altyazı durumu */
  subs: Partial<Record<Lang, TrackStatus>>;
  episodes: { n: number; title: Partial<Record<Lang, string>>; minutes: number }[];
};

const eps = (tr: string[], en: string[]) =>
  tr.map((t, i) => ({ n: i + 1, title: { tr: t, en: en[i] ?? t }, minutes: 2 + (i % 3) }));

// Henüz hiçbir bölümün videosu, dublajı veya altyazısı yayında değil.
// Pilot için Türkçe ve İngilizce seslendirme planlandı.
const pilotPlan = {
  audio: { tr: "planned", en: "planned" } as Partial<Record<Lang, TrackStatus>>,
  subs: { tr: "planned", en: "planned" } as Partial<Record<Lang, TrackStatus>>,
};

export const series: Series[] = [
  {
    id: "neo-genesis-2099",
    title: "Neo-Genesis: 2099",
    category: "scifi",
    poster: neo,
    ...pilotPlan,
    text: {
      tr: { tagline: "İnsanlığın son şansı, senin yüzünde saklı.", description: "2099'da hafızası silinmiş genç bir astronot, insanlığın yeniden doğuşunun anahtarının kendi DNA'sında olduğunu keşfeder." },
      en: { tagline: "Humanity's last chance is hidden in your face.", description: "In 2099, a young astronaut with an erased memory discovers that the key to humanity's rebirth lies in her own DNA." },
      de: { tagline: "Die letzte Chance der Menschheit steckt in deinem Gesicht.", description: "2099 entdeckt eine junge Astronautin ohne Erinnerung, dass der Schlüssel zur Wiedergeburt der Menschheit in ihrer eigenen DNA liegt." },
      fr: { tagline: "La dernière chance de l'humanité se cache dans ton visage.", description: "En 2099, une jeune astronaute sans mémoire découvre que la clé de la renaissance de l'humanité se trouve dans son propre ADN." },
      es: { tagline: "La última oportunidad de la humanidad está en tu rostro.", description: "En 2099, una joven astronauta sin memoria descubre que la clave del renacer de la humanidad está en su propio ADN." },
      pt: { tagline: "A última chance da humanidade está no seu rosto.", description: "Em 2099, uma jovem astronauta sem memória descobre que a chave para o renascimento da humanidade está no seu próprio DNA." },
      ar: { tagline: "فرصة البشرية الأخيرة مخبأة في وجهك.", description: "في عام 2099، تكتشف رائدة فضاء شابة فقدت ذاكرتها أن مفتاح ولادة البشرية من جديد يكمن في حمضها النووي." },
      hi: { tagline: "मानवता का आख़िरी मौका आपके चेहरे में छिपा है।", description: "2099 में, याददाश्त खो चुकी एक युवा अंतरिक्ष यात्री को पता चलता है कि मानवता के पुनर्जन्म की कुंजी उसके अपने DNA में है।" },
    },
    episodes: eps(["Uyanış", "Kayıp Sinyal", "Megakentin Kalbi", "Kod Adı: Genesis", "Son Geri Sayım"], ["Awakening", "Lost Signal", "Heart of the Megacity", "Codename: Genesis", "Final Countdown"]),
  },
  {
    id: "cyber-glitch-ro-buster",
    title: "Cyber-Glitch: Ro-Buster",
    category: "comedy",
    poster: cyber,
    audio: { tr: "none" },
    subs: {},
    text: {
      tr: { tagline: "Bir robot, bir hata ve sonsuz kahkaha.", description: "Şehrin en sakar temizlik robotu, bir yazılım hatasıyla kendini süper kahraman sanmaya başlar." },
      en: { tagline: "One robot, one bug, endless laughs.", description: "The city's clumsiest cleaning robot starts believing he's a superhero after a software glitch." },
      de: { tagline: "Ein Roboter, ein Fehler, endlos Lachen.", description: "Der tollpatschigste Putzroboter der Stadt hält sich nach einem Softwarefehler für einen Superhelden." },
      fr: { tagline: "Un robot, un bug, des fous rires.", description: "Le robot de ménage le plus maladroit de la ville se prend pour un super-héros après un bug." },
      es: { tagline: "Un robot, un fallo y risas sin fin.", description: "El robot de limpieza más torpe de la ciudad se cree superhéroe tras un fallo de software." },
      pt: { tagline: "Um robô, um bug e risadas sem fim.", description: "O robô de limpeza mais desastrado da cidade passa a se achar um super-herói depois de um bug." },
      ar: { tagline: "روبوت واحد، خلل واحد، وضحك بلا نهاية.", description: "أكثر روبوتات التنظيف ارتباكًا في المدينة يظن نفسه بطلًا خارقًا بعد خلل برمجي." },
      hi: { tagline: "एक रोबोट, एक गड़बड़ी, अनगिनत ठहाके।", description: "शहर का सबसे अनाड़ी सफ़ाई रोबोट एक सॉफ़्टवेयर गड़बड़ी के बाद ख़ुद को सुपरहीरो समझने लगता है।" },
    },
    episodes: eps(["Sistem Hatası", "Kahraman Modu", "Yanlış Alarm", "Robot Dansı", "Büyük Çöküş"], ["System Error", "Hero Mode", "False Alarm", "Robot Dance", "The Big Crash"]),
  },
  {
    id: "neon-hearts-virtual-pulse",
    title: "Neon Hearts: Virtual Pulse",
    category: "romance",
    poster: hearts,
    audio: { tr: "none" },
    subs: {},
    text: {
      tr: { tagline: "Gerçek aşk, sanal dünyada başlar mı?", description: "Farklı kıtalarda yaşayan iki yabancı sanal evrende tanışır ve gerçek dünyada birbirlerini bulmaya çalışır." },
      en: { tagline: "Can true love begin in a virtual world?", description: "Two strangers on different continents meet in a virtual universe and try to find each other in the real world." },
      de: { tagline: "Kann wahre Liebe virtuell beginnen?", description: "Zwei Fremde auf verschiedenen Kontinenten lernen sich virtuell kennen und suchen einander in der echten Welt." },
      fr: { tagline: "Le grand amour peut-il naître dans le virtuel ?", description: "Deux inconnus sur deux continents se rencontrent dans un univers virtuel et tentent de se retrouver dans la vraie vie." },
      es: { tagline: "¿Puede empezar el amor en un mundo virtual?", description: "Dos desconocidos de continentes distintos se conocen en un universo virtual e intentan encontrarse en el mundo real." },
      pt: { tagline: "O amor verdadeiro pode começar no mundo virtual?", description: "Dois desconhecidos de continentes diferentes se conhecem num universo virtual e tentam se encontrar no mundo real." },
      ar: { tagline: "هل يبدأ الحب الحقيقي في عالم افتراضي؟", description: "غريبان من قارتين مختلفتين يلتقيان في عالم افتراضي ويحاولان أن يجدا بعضهما في الواقع." },
      hi: { tagline: "क्या सच्चा प्यार आभासी दुनिया में शुरू हो सकता है?", description: "अलग-अलग महाद्वीपों के दो अजनबी आभासी दुनिया में मिलते हैं और असली दुनिया में एक-दूसरे को ढूँढने निकलते हैं।" },
    },
    episodes: eps(["İlk Bağlantı", "Sanal Yağmur", "Kopan Sinyal", "Gerçeğe Adım", "Tek Kalp Atışı"], ["First Connection", "Virtual Rain", "Broken Signal", "Step Into Reality", "One Heartbeat"]),
  },
];

export const seriesText = (s: Series, lang: Lang) => s.text[lang] ?? s.text.en!;

export const FREE_EPISODES = 2;
export const EPISODE_COST = 10;
