import { useAppState } from "@/lib/store";

export const LANGS = ["tr", "en", "de", "fr", "es", "pt", "ar", "hi"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_NAMES: Record<Lang, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
  ar: "العربية",
  hi: "हिन्दी",
};

export const RTL: Lang[] = ["ar"];

/** Cihazın tercih ettiği dillerden desteklenen ilkini bulur (ülkeye bakmaz). */
export function detectDeviceLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of list) {
    const base = l?.toLowerCase().split("-")[0] as Lang;
    if (LANGS.includes(base)) return base;
  }
  return "en";
}

type Dict = Record<string, string>;

const tr: Dict = {
  nav_home: "Ana Sayfa", nav_star: "Başrol Ol", nav_tokens: "Jetonlar", nav_settings: "Dil",
  cat_scifi: "Bilim Kurgu", cat_comedy: "Komedi", cat_romance: "Duygusal",
  watch_now: "Şimdi İzle", all_universes: "Tüm Evrenler", episodes: "Bölümler", episode: "Bölüm", min: "dk",
  playing: "{n}. bölüm oynatılıyor…", unlocked: "{n}. bölümün kilidi açıldı!", not_enough: "Yetersiz jeton. Lütfen jeton satın alın.",
  buy_q: "Jetonun mu bitti?", buy_cta: "Demo jetonu ekle", back: "Geri",
  lang_box: "Dil seçenekleri", audio: "Seslendirme", subtitles: "Altyazı",
  st_ready: "Hazır", st_planned: "Hazırlanıyor", st_none: "Henüz yok",
  dub_missing: "{lang} dublajı henüz hazır değil. Hazır olduğunda burada görünecek; bu sırada mevcut seslendirmeyle {lang} altyazı seçebilirsiniz.",
  sub_missing: "{lang} altyazı henüz hazır değil.",
  no_video: "Bu dizinin videoları henüz yayında değil. Bölüm listesi önizleme amaçlıdır.",
  settings_title: "Dil Ayarları", ui_lang: "Uygulama dili", audio_lang: "Seslendirme dili", sub_lang: "Altyazı dili",
  sub_off: "Kapalı",
  settings_note: "Üç dili ayrı ayrı seçebilirsiniz. Seçtiğiniz dilde dublaj yoksa, bunu açıkça gösterir ve altyazı seçeneği sunarız.",
  suggest_title: "Dil seçin", suggest_body: "Cihazınızın dili {lang}. Uygulamayı bu dilde kullanmak ister misiniz?",
  suggest_yes: "Evet, {lang}", suggest_other: "Başka dil seç",
  star_1: "Başrol", star_2: "Ol", star_sub: "Yüz fotoğrafını yükle, yapay zekâ seni dizilerin kahramanına dönüştürsün.",
  upload: "Fotoğraf Yükle", change: "Fotoğrafı Değiştir", delete_photo: "Fotoğrafı sil", char_name: "Karakter Adın",
  char_ph: "Örn: Kaptan Nova", preview: "Başrol Önizlemesi", you: "Sen", img_err: "Lütfen bir görsel dosyası seçin.",
  photo_ok: "Fotoğrafın yüklendi! Artık başrol sensin.",
  shop_1: "Jeton", shop_2: "Mağazası", shop_sub: "Her kilitli bölüm 12 demo jeton. Paketini seç, hikâyeye kesintisiz devam et.",
  popular: "POPÜLER", bonus: "bonus", perks: "Paket Avantajları",
  perk1: "Tüm dizilerde geçerli", perk2: "Jetonların süresi dolmaz", perk3: "Başrol Ol özelliğiyle uyumlu", perk4: "Güvenli ödeme",
  buy: "Satın Al", demo: "Demo modu: gerçek ödeme alınmaz.", added: "{n} jeton eklendi! (Demo)",
  pack_s: "Başlangıç", pack_m: "En Popüler", pack_l: "Evren Gezgini", pack_xl: "Multiverse VIP",
};

const en: Dict = {
  nav_home: "Home", nav_star: "Star in It", nav_tokens: "Tokens", nav_settings: "Language",
  cat_scifi: "Sci-Fi", cat_comedy: "Comedy", cat_romance: "Drama",
  watch_now: "Watch Now", all_universes: "All Universes", episodes: "Episodes", episode: "Episode", min: "min",
  playing: "Playing episode {n}…", unlocked: "Episode {n} unlocked!", not_enough: "Not enough tokens. Please buy more.",
  buy_q: "Out of tokens?", buy_cta: "Add demo tokens", back: "Back",
  lang_box: "Language options", audio: "Audio", subtitles: "Subtitles",
  st_ready: "Ready", st_planned: "In production", st_none: "Not yet",
  dub_missing: "{lang} dubbing isn't ready yet. It will appear here once it is; meanwhile you can watch with the available audio and {lang} subtitles.",
  sub_missing: "{lang} subtitles aren't ready yet.",
  no_video: "This series' videos aren't live yet. The episode list is a preview.",
  settings_title: "Language Settings", ui_lang: "App language", audio_lang: "Audio language", sub_lang: "Subtitle language",
  sub_off: "Off",
  settings_note: "You can choose all three separately. If dubbing isn't available in your language, we'll say so clearly and offer subtitles.",
  suggest_title: "Choose a language", suggest_body: "Your device language is {lang}. Use the app in this language?",
  suggest_yes: "Yes, {lang}", suggest_other: "Choose another",
  star_1: "Star", star_2: "in It", star_sub: "Upload a face photo and let AI turn you into the hero of the series.",
  upload: "Upload Photo", change: "Change Photo", delete_photo: "Delete photo", char_name: "Your Character Name",
  char_ph: "e.g. Captain Nova", preview: "Starring Preview", you: "You", img_err: "Please choose an image file.",
  photo_ok: "Photo uploaded! You're the star now.",
  shop_1: "Token", shop_2: "Store", shop_sub: "Each locked episode costs 10 tokens. Pick a pack and keep watching.",
  popular: "POPULAR", bonus: "bonus", perks: "Pack Benefits",
  perk1: "Valid on all series", perk2: "Tokens never expire", perk3: "Works with Star in It", perk4: "Secure payment",
  buy: "Buy", demo: "Demo mode: no real payment is taken.", added: "{n} tokens added! (Demo)",
  pack_s: "Starter", pack_m: "Most Popular", pack_l: "Universe Explorer", pack_xl: "Multiverse VIP",
};

const de: Dict = {
  nav_home: "Start", nav_star: "Hauptrolle", nav_tokens: "Token", nav_settings: "Sprache",
  cat_scifi: "Science-Fiction", cat_comedy: "Komödie", cat_romance: "Drama",
  watch_now: "Jetzt ansehen", all_universes: "Alle Universen", episodes: "Folgen", episode: "Folge", min: "Min.",
  playing: "Folge {n} wird abgespielt…", unlocked: "Folge {n} freigeschaltet!", not_enough: "Nicht genug Token. Bitte kaufe welche.",
  buy_q: "Keine Token mehr?", buy_cta: "Token kaufen", back: "Zurück",
  lang_box: "Sprachoptionen", audio: "Ton", subtitles: "Untertitel",
  st_ready: "Verfügbar", st_planned: "In Produktion", st_none: "Noch nicht",
  dub_missing: "Die {lang}-Synchronisation ist noch nicht fertig. Sobald sie verfügbar ist, erscheint sie hier; bis dahin kannst du mit dem vorhandenen Ton und {lang}-Untertiteln schauen.",
  sub_missing: "{lang}-Untertitel sind noch nicht fertig.",
  no_video: "Die Videos dieser Serie sind noch nicht online. Die Folgenliste ist eine Vorschau.",
  settings_title: "Spracheinstellungen", ui_lang: "App-Sprache", audio_lang: "Tonsprache", sub_lang: "Untertitelsprache",
  sub_off: "Aus",
  settings_note: "Du kannst alle drei getrennt wählen. Gibt es keine Synchronisation in deiner Sprache, sagen wir das klar und bieten Untertitel an.",
  suggest_title: "Sprache wählen", suggest_body: "Deine Gerätesprache ist {lang}. App in dieser Sprache nutzen?",
  suggest_yes: "Ja, {lang}", suggest_other: "Andere wählen",
  star_1: "Spiel die", star_2: "Hauptrolle", star_sub: "Lade ein Gesichtsfoto hoch und die KI macht dich zum Helden der Serie.",
  upload: "Foto hochladen", change: "Foto ändern", delete_photo: "Foto löschen", char_name: "Name deiner Figur",
  char_ph: "z. B. Captain Nova", preview: "Hauptrollen-Vorschau", you: "Du", img_err: "Bitte wähle eine Bilddatei.",
  photo_ok: "Foto hochgeladen! Jetzt bist du der Star.",
  shop_1: "Token-", shop_2: "Shop", shop_sub: "Jede gesperrte Folge kostet 10 Token. Wähle ein Paket und schau weiter.",
  popular: "BELIEBT", bonus: "Bonus", perks: "Paketvorteile",
  perk1: "Für alle Serien gültig", perk2: "Token verfallen nie", perk3: "Funktioniert mit Hauptrolle", perk4: "Sichere Zahlung",
  buy: "Kaufen", demo: "Demo-Modus: Es wird keine echte Zahlung durchgeführt.", added: "{n} Token hinzugefügt! (Demo)",
  pack_s: "Einsteiger", pack_m: "Am beliebtesten", pack_l: "Universums-Entdecker", pack_xl: "Multiverse VIP",
};

const fr: Dict = {
  nav_home: "Accueil", nav_star: "Premier rôle", nav_tokens: "Jetons", nav_settings: "Langue",
  cat_scifi: "Science-fiction", cat_comedy: "Comédie", cat_romance: "Drame",
  watch_now: "Regarder", all_universes: "Tous les univers", episodes: "Épisodes", episode: "Épisode", min: "min",
  playing: "Lecture de l'épisode {n}…", unlocked: "Épisode {n} débloqué !", not_enough: "Pas assez de jetons. Achetez-en.",
  buy_q: "Plus de jetons ?", buy_cta: "Acheter des jetons", back: "Retour",
  lang_box: "Options de langue", audio: "Audio", subtitles: "Sous-titres",
  st_ready: "Disponible", st_planned: "En production", st_none: "Pas encore",
  dub_missing: "Le doublage {lang} n'est pas encore prêt. Il apparaîtra ici dès qu'il le sera ; en attendant, regardez avec l'audio disponible et les sous-titres {lang}.",
  sub_missing: "Les sous-titres {lang} ne sont pas encore prêts.",
  no_video: "Les vidéos de cette série ne sont pas encore en ligne. La liste des épisodes est un aperçu.",
  settings_title: "Paramètres de langue", ui_lang: "Langue de l'app", audio_lang: "Langue audio", sub_lang: "Langue des sous-titres",
  sub_off: "Désactivés",
  settings_note: "Vous pouvez choisir les trois séparément. Si le doublage n'existe pas dans votre langue, nous l'indiquons clairement et proposons des sous-titres.",
  suggest_title: "Choisir une langue", suggest_body: "La langue de votre appareil est : {lang}. Utiliser l'app dans cette langue ?",
  suggest_yes: "Oui, {lang}", suggest_other: "Autre langue",
  star_1: "Premier", star_2: "rôle", star_sub: "Importez une photo de votre visage et l'IA fera de vous le héros de la série.",
  upload: "Importer une photo", change: "Changer la photo", delete_photo: "Supprimer la photo", char_name: "Nom de ton personnage",
  char_ph: "ex. Capitaine Nova", preview: "Aperçu du rôle", you: "Toi", img_err: "Veuillez choisir une image.",
  photo_ok: "Photo importée ! Tu es la star.",
  shop_1: "Boutique", shop_2: "de jetons", shop_sub: "Chaque épisode verrouillé coûte 10 jetons. Choisissez un pack et continuez.",
  popular: "POPULAIRE", bonus: "bonus", perks: "Avantages du pack",
  perk1: "Valable sur toutes les séries", perk2: "Les jetons n'expirent jamais", perk3: "Compatible avec Premier rôle", perk4: "Paiement sécurisé",
  buy: "Acheter", demo: "Mode démo : aucun paiement réel.", added: "{n} jetons ajoutés ! (Démo)",
  pack_s: "Débutant", pack_m: "Le plus populaire", pack_l: "Explorateur", pack_xl: "Multiverse VIP",
};

const es: Dict = {
  nav_home: "Inicio", nav_star: "Protagonista", nav_tokens: "Fichas", nav_settings: "Idioma",
  cat_scifi: "Ciencia ficción", cat_comedy: "Comedia", cat_romance: "Drama",
  watch_now: "Ver ahora", all_universes: "Todos los universos", episodes: "Episodios", episode: "Episodio", min: "min",
  playing: "Reproduciendo episodio {n}…", unlocked: "¡Episodio {n} desbloqueado!", not_enough: "No tienes fichas suficientes. Compra más.",
  buy_q: "¿Sin fichas?", buy_cta: "Comprar fichas", back: "Atrás",
  lang_box: "Opciones de idioma", audio: "Audio", subtitles: "Subtítulos",
  st_ready: "Disponible", st_planned: "En producción", st_none: "Aún no",
  dub_missing: "El doblaje en {lang} aún no está listo. Aparecerá aquí cuando lo esté; mientras tanto, puedes verlo con el audio disponible y subtítulos en {lang}.",
  sub_missing: "Los subtítulos en {lang} aún no están listos.",
  no_video: "Los vídeos de esta serie aún no están publicados. La lista de episodios es una vista previa.",
  settings_title: "Ajustes de idioma", ui_lang: "Idioma de la app", audio_lang: "Idioma del audio", sub_lang: "Idioma de subtítulos",
  sub_off: "Desactivados",
  settings_note: "Puedes elegir los tres por separado. Si no hay doblaje en tu idioma, te lo diremos claramente y te ofreceremos subtítulos.",
  suggest_title: "Elige un idioma", suggest_body: "El idioma de tu dispositivo es {lang}. ¿Usar la app en este idioma?",
  suggest_yes: "Sí, {lang}", suggest_other: "Elegir otro",
  star_1: "Sé el", star_2: "protagonista", star_sub: "Sube una foto de tu cara y la IA te convertirá en el héroe de la serie.",
  upload: "Subir foto", change: "Cambiar foto", delete_photo: "Eliminar foto", char_name: "Nombre de tu personaje",
  char_ph: "p. ej. Capitana Nova", preview: "Vista previa", you: "Tú", img_err: "Elige un archivo de imagen.",
  photo_ok: "¡Foto subida! Ahora eres la estrella.",
  shop_1: "Tienda", shop_2: "de fichas", shop_sub: "Cada episodio bloqueado cuesta 10 fichas. Elige un paquete y sigue viendo.",
  popular: "POPULAR", bonus: "extra", perks: "Ventajas del paquete",
  perk1: "Válido en todas las series", perk2: "Las fichas no caducan", perk3: "Compatible con Protagonista", perk4: "Pago seguro",
  buy: "Comprar", demo: "Modo demo: no se cobra dinero real.", added: "¡{n} fichas añadidas! (Demo)",
  pack_s: "Inicial", pack_m: "Más popular", pack_l: "Explorador", pack_xl: "Multiverse VIP",
};

const pt: Dict = {
  nav_home: "Início", nav_star: "Protagonista", nav_tokens: "Fichas", nav_settings: "Idioma",
  cat_scifi: "Ficção científica", cat_comedy: "Comédia", cat_romance: "Drama",
  watch_now: "Assistir", all_universes: "Todos os universos", episodes: "Episódios", episode: "Episódio", min: "min",
  playing: "Reproduzindo episódio {n}…", unlocked: "Episódio {n} desbloqueado!", not_enough: "Fichas insuficientes. Compre mais.",
  buy_q: "Sem fichas?", buy_cta: "Comprar fichas", back: "Voltar",
  lang_box: "Opções de idioma", audio: "Áudio", subtitles: "Legendas",
  st_ready: "Disponível", st_planned: "Em produção", st_none: "Ainda não",
  dub_missing: "A dublagem em {lang} ainda não está pronta. Ela aparecerá aqui quando estiver; enquanto isso, assista com o áudio disponível e legendas em {lang}.",
  sub_missing: "As legendas em {lang} ainda não estão prontas.",
  no_video: "Os vídeos desta série ainda não foram publicados. A lista de episódios é uma prévia.",
  settings_title: "Configurações de idioma", ui_lang: "Idioma do app", audio_lang: "Idioma do áudio", sub_lang: "Idioma da legenda",
  sub_off: "Desligadas",
  settings_note: "Você pode escolher os três separadamente. Se não houver dublagem no seu idioma, avisaremos claramente e ofereceremos legendas.",
  suggest_title: "Escolha um idioma", suggest_body: "O idioma do seu aparelho é {lang}. Usar o app neste idioma?",
  suggest_yes: "Sim, {lang}", suggest_other: "Escolher outro",
  star_1: "Seja o", star_2: "protagonista", star_sub: "Envie uma foto do seu rosto e a IA transforma você no herói da série.",
  upload: "Enviar foto", change: "Trocar foto", delete_photo: "Excluir foto", char_name: "Nome do seu personagem",
  char_ph: "ex.: Capitã Nova", preview: "Prévia do protagonista", you: "Você", img_err: "Escolha um arquivo de imagem.",
  photo_ok: "Foto enviada! Agora a estrela é você.",
  shop_1: "Loja", shop_2: "de fichas", shop_sub: "Cada episódio bloqueado custa 10 fichas. Escolha um pacote e continue assistindo.",
  popular: "POPULAR", bonus: "bônus", perks: "Vantagens do pacote",
  perk1: "Válido em todas as séries", perk2: "Fichas não expiram", perk3: "Compatível com Protagonista", perk4: "Pagamento seguro",
  buy: "Comprar", demo: "Modo demo: nenhum pagamento real é cobrado.", added: "{n} fichas adicionadas! (Demo)",
  pack_s: "Inicial", pack_m: "Mais popular", pack_l: "Explorador", pack_xl: "Multiverse VIP",
};

const ar: Dict = {
  nav_home: "الرئيسية", nav_star: "كن البطل", nav_tokens: "الرموز", nav_settings: "اللغة",
  cat_scifi: "خيال علمي", cat_comedy: "كوميديا", cat_romance: "دراما",
  watch_now: "شاهد الآن", all_universes: "كل العوالم", episodes: "الحلقات", episode: "الحلقة", min: "د",
  playing: "تشغيل الحلقة {n}…", unlocked: "تم فتح الحلقة {n}!", not_enough: "رموزك غير كافية. يرجى شراء المزيد.",
  buy_q: "نفدت رموزك؟", buy_cta: "اشترِ رموزًا", back: "رجوع",
  lang_box: "خيارات اللغة", audio: "الصوت", subtitles: "الترجمة",
  st_ready: "جاهز", st_planned: "قيد الإنتاج", st_none: "غير متوفر بعد",
  dub_missing: "الدبلجة بـ{lang} ليست جاهزة بعد. ستظهر هنا عند توفرها؛ حتى ذلك الحين يمكنك المشاهدة بالصوت المتاح مع ترجمة بـ{lang}.",
  sub_missing: "الترجمة بـ{lang} ليست جاهزة بعد.",
  no_video: "فيديوهات هذا المسلسل لم تُنشر بعد. قائمة الحلقات للمعاينة فقط.",
  settings_title: "إعدادات اللغة", ui_lang: "لغة التطبيق", audio_lang: "لغة الصوت", sub_lang: "لغة الترجمة",
  sub_off: "إيقاف",
  settings_note: "يمكنك اختيار الثلاثة بشكل منفصل. إذا لم تتوفر دبلجة بلغتك، سنوضح ذلك ونقدم لك الترجمة.",
  suggest_title: "اختر اللغة", suggest_body: "لغة جهازك هي {lang}. هل تريد استخدام التطبيق بهذه اللغة؟",
  suggest_yes: "نعم، {lang}", suggest_other: "اختر لغة أخرى",
  star_1: "كن", star_2: "البطل", star_sub: "ارفع صورة لوجهك ودع الذكاء الاصطناعي يجعلك بطل المسلسل.",
  upload: "رفع صورة", change: "تغيير الصورة", delete_photo: "حذف الصورة", char_name: "اسم شخصيتك",
  char_ph: "مثال: القبطان نوفا", preview: "معاينة البطولة", you: "أنت", img_err: "يرجى اختيار ملف صورة.",
  photo_ok: "تم رفع الصورة! أنت البطل الآن.",
  shop_1: "متجر", shop_2: "الرموز", shop_sub: "كل حلقة مقفلة بـ10 رموز. اختر باقتك وتابع المشاهدة.",
  popular: "الأكثر طلبًا", bonus: "إضافي", perks: "مزايا الباقة",
  perk1: "صالحة لكل المسلسلات", perk2: "الرموز لا تنتهي صلاحيتها", perk3: "متوافقة مع كن البطل", perk4: "دفع آمن",
  buy: "شراء", demo: "وضع تجريبي: لا يتم أي دفع حقيقي.", added: "تمت إضافة {n} رمز! (تجريبي)",
  pack_s: "البداية", pack_m: "الأكثر شعبية", pack_l: "مستكشف الكون", pack_xl: "Multiverse VIP",
};

const hi: Dict = {
  nav_home: "होम", nav_star: "हीरो बनें", nav_tokens: "टोकन", nav_settings: "भाषा",
  cat_scifi: "साइंस फ़िक्शन", cat_comedy: "कॉमेडी", cat_romance: "ड्रामा",
  watch_now: "अभी देखें", all_universes: "सभी ब्रह्मांड", episodes: "एपिसोड", episode: "एपिसोड", min: "मिनट",
  playing: "एपिसोड {n} चल रहा है…", unlocked: "एपिसोड {n} अनलॉक हो गया!", not_enough: "टोकन कम हैं। कृपया और खरीदें।",
  buy_q: "टोकन ख़त्म?", buy_cta: "टोकन खरीदें", back: "वापस",
  lang_box: "भाषा विकल्प", audio: "ऑडियो", subtitles: "सबटाइटल",
  st_ready: "उपलब्ध", st_planned: "तैयार हो रहा है", st_none: "अभी नहीं",
  dub_missing: "{lang} डबिंग अभी तैयार नहीं है। तैयार होते ही यहाँ दिखेगी; तब तक आप उपलब्ध ऑडियो और {lang} सबटाइटल के साथ देख सकते हैं।",
  sub_missing: "{lang} सबटाइटल अभी तैयार नहीं हैं।",
  no_video: "इस सीरीज़ के वीडियो अभी प्रकाशित नहीं हुए हैं। एपिसोड सूची केवल पूर्वावलोकन है।",
  settings_title: "भाषा सेटिंग", ui_lang: "ऐप की भाषा", audio_lang: "ऑडियो की भाषा", sub_lang: "सबटाइटल की भाषा",
  sub_off: "बंद",
  settings_note: "आप तीनों अलग-अलग चुन सकते हैं। अगर आपकी भाषा में डबिंग नहीं है, तो हम साफ़ बताएँगे और सबटाइटल देंगे।",
  suggest_title: "भाषा चुनें", suggest_body: "आपके डिवाइस की भाषा {lang} है। क्या ऐप इसी भाषा में इस्तेमाल करें?",
  suggest_yes: "हाँ, {lang}", suggest_other: "दूसरी भाषा चुनें",
  star_1: "हीरो", star_2: "बनें", star_sub: "अपने चेहरे की फ़ोटो अपलोड करें और AI आपको सीरीज़ का हीरो बना देगा।",
  upload: "फ़ोटो अपलोड करें", change: "फ़ोटो बदलें", delete_photo: "फ़ोटो हटाएँ", char_name: "आपके किरदार का नाम",
  char_ph: "जैसे: कैप्टन नोवा", preview: "हीरो पूर्वावलोकन", you: "आप", img_err: "कृपया एक इमेज फ़ाइल चुनें।",
  photo_ok: "फ़ोटो अपलोड हो गई! अब हीरो आप हैं।",
  shop_1: "टोकन", shop_2: "स्टोर", shop_sub: "हर लॉक एपिसोड 10 टोकन का है। पैक चुनें और देखते रहें।",
  popular: "लोकप्रिय", bonus: "बोनस", perks: "पैक के फ़ायदे",
  perk1: "सभी सीरीज़ में मान्य", perk2: "टोकन कभी ख़त्म नहीं होते", perk3: "हीरो बनें के साथ काम करता है", perk4: "सुरक्षित भुगतान",
  buy: "खरीदें", demo: "डेमो मोड: कोई असली भुगतान नहीं लिया जाता।", added: "{n} टोकन जोड़े गए! (डेमो)",
  pack_s: "स्टार्टर", pack_m: "सबसे लोकप्रिय", pack_l: "ब्रह्मांड यात्री", pack_xl: "Multiverse VIP",
};

const dicts: Record<Lang, Dict> = { tr, en, de, fr, es, pt, ar, hi };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>) {
  let s = dicts[lang]?.[key] ?? dicts.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

export function useT() {
  const { state } = useAppState();
  const lang = state.uiLang;
  return { lang, t: (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars) };
}

/** Üyelik ve oynatıcı için ek çeviriler (diğer diller İngilizce'ye düşer). */
const extra: Partial<Record<Lang, Dict>> = {
  tr: {
    sign_in: "Giriş Yap", sign_up: "Kayıt Ol", email: "E-posta", password: "Şifre", your_name: "Adınız",
    continue_google: "Google ile devam et", logout: "Çıkış Yap", account: "Hesabım",
    auth_title: "Hesabını aç", auth_sub: "Jetonların, yüz fotoğrafın ve izleme ilerlemen her cihazda seninle gelir.",
    have_account: "Hesabın var mı?", no_account: "Hesabın yok mu?", guest: "Misafir olarak devam et",
    guest_note: "Misafir modunda ilerlemen yalnızca bu cihazda saklanır.",
    email_sent: "Kaydın alındı. E-postandaki bağlantıya tıklayarak hesabını doğrula.",
    fill_fields: "E-posta ve şifre alanlarını doldurun.", weak_pass: "Şifre en az 6 karakter olmalı.",
    welcome: "Hoş geldin", loading: "Yükleniyor…",
    draft_ep: "Bu bölüm henüz taslak", draft_ep_note: "Videosu henüz hazır değil. Yayınlandığında burada oynatılacak.",
    resume: "Kaldığın yerden devam et", resume_from: "{n}. saniyeden devam ediliyor",
    next_in: "Sonraki bölüm {n} saniye içinde başlıyor", watch_now: "Hemen izle", cancel_next: "İptal",
    no_next: "Bu dizinin sonraki bölümü yok.", autoplay: "Sonraki bölüm otomatik başlatılsın",
    locked_ep: "Bu bölüm kilitli", need_tokens: "Açmak için {n} jeton gerekiyor.",
    free_ep: "İlk {n} bölüm ücretsiz", watch: "İzle",
    admin: "Yönetim", admin_title: "İçerik Yönetimi", admin_no: "Bu alana yalnızca yöneticiler girebilir.",
    series_tab: "Diziler", episodes_tab: "Bölümler", users_tab: "Kullanıcılar",
    video_file: "Video dosyası", upload: "Yükle", mark_ready: "Yayına al", mark_draft: "Taslağa al",
    poster_file: "Afiş", save: "Kaydet", saved: "Kaydedildi", added_tokens: "{n} jeton eklendi",
    status_ready: "Yayında", status_draft: "Taslak", no_video_yet: "Video yüklenmemiş",
    audio_track: "Ses parçası", sub_track: "Altyazı", track_ready: "Hazır", track_planned: "Hazırlanıyor",
    gen_tab: "Video Üret", gen_title: "Runway ile Video Üret", gen_sub: "Bölüm için AI video üret. Üretilen video otomatik depolamaya kaydedilir.",
    gen_prompt: "Sahne açıklaması (prompt)", gen_prompt_ph: "Örn: Genç bir astronot, altın yansımalarla aydınlık saçlarla, uzay istasyonunda uyanıyor…",
    gen_model: "Model", gen_duration: "Süre (sn)", gen_button: "Üretmeye Başla", gen_generating: "Üretiliyor…",
    gen_status_pending: "Bekliyor", gen_status_running: "Üretiliyor", gen_status_succeeded: "Tamamlandı", gen_status_failed: "Başarısız",
    gen_check: "Durumu Kontrol Et", gen_history: "Üretim Geçmişi", gen_no_history: "Henüz üretim yok.",
    gen_key_missing: "Runway API anahtarı ayarlanmamış.",
    gen_star_desc: "Başrol: Genç, aydınlık saçlar, altın yansımalar. Bazı bölümlerde saç toplu atkuyruğu.",
  },
  en: {
    sign_in: "Sign in", sign_up: "Sign up", email: "Email", password: "Password", your_name: "Your name",
    continue_google: "Continue with Google", logout: "Log out", account: "My account",
    auth_title: "Open your account", auth_sub: "Your tokens, face photo and progress follow you on every device.",
    have_account: "Already have an account?", no_account: "No account yet?", guest: "Continue as guest",
    guest_note: "In guest mode your progress is saved on this device only.",
    email_sent: "Account created. Confirm it through the link in your inbox.",
    fill_fields: "Fill in the email and password fields.", weak_pass: "Password must be at least 6 characters.",
    welcome: "Welcome", loading: "Loading…",
    draft_ep: "This episode is still a draft", draft_ep_note: "Its video is not ready yet. It will play here once published.",
    resume: "Resume where you left off", resume_from: "Resuming from {n} seconds",
    next_in: "Next episode starts in {n} seconds", watch_now: "Watch now", cancel_next: "Cancel",
    no_next: "No further episodes in this series.", autoplay: "Start the next episode automatically",
    locked_ep: "This episode is locked", need_tokens: "Unlocking it costs {n} tokens.",
    free_ep: "First {n} episodes are free", watch: "Watch",
    admin: "Admin", admin_title: "Content management", admin_no: "Only admins can open this area.",
    series_tab: "Series", episodes_tab: "Episodes", users_tab: "Users",
    video_file: "Video file", upload: "Upload", mark_ready: "Publish", mark_draft: "Move to drafts",
    poster_file: "Poster", save: "Save", saved: "Saved", added_tokens: "{n} tokens added",
    status_ready: "Published", status_draft: "Draft", no_video_yet: "No video uploaded",
    audio_track: "Audio track", sub_track: "Subtitle", track_ready: "Ready", track_planned: "In progress",
    gen_tab: "Generate", gen_title: "Generate Video with Runway", gen_sub: "Generate AI video for an episode. Result saved to storage automatically.",
    gen_prompt: "Scene prompt", gen_prompt_ph: "e.g. A young astronaut with bright golden-highlighted hair waking up in a space station…",
    gen_model: "Model", gen_duration: "Duration (sec)", gen_button: "Start Generating", gen_generating: "Generating…",
    gen_status_pending: "Pending", gen_status_running: "Generating", gen_status_succeeded: "Completed", gen_status_failed: "Failed",
    gen_check: "Check Status", gen_history: "Generation History", gen_no_history: "No generations yet.",
    gen_key_missing: "Runway API key not configured.",
    gen_star_desc: "Lead: Young, bright hair with golden highlights. Ponytail in some episodes.",
  },
};
for (const [l, d] of Object.entries(extra)) Object.assign(dicts[l as Lang], d);
