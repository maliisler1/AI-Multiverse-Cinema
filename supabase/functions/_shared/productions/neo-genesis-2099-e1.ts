import type { Production } from "./types.ts";

/**
 * Neo-Genesis: 2099 — Bölüm 1 "Uyanış" (180 sn).
 * Yıl 2300. AyShe, Kapsül 23'te hiçbir haritada olmayan Elyra kıtasında uyanır.
 * Senaryo: Claude Docs "Neo-Genesis — Bölüm 1: Uyanış (Senaryo)".
 */
export const neoGenesisE1: Production = {
  seriesSlug: "neo-genesis-2099",
  episode: 1,
  title: {
    tr: "Uyanış",
    en: "Awakening",
    de: "Erwachen",
    fr: "Éveil",
    es: "Despertar",
    pt: "Despertar",
    ar: "الصحوة",
    hi: "जागृति",
  },
  durationSec: 180,
  faceTag: "AyShe",
  characterLook:
    'a young woman of about twenty with a short blunt chin-length bob of dark chestnut hair, large hazel eyes, delicate features, light olive skin and a serious, curious expression, wearing a fitted white-silver spacesuit with a glowing blue "23" badge on the chest',
  characterShort:
    "young woman, short dark chestnut bob, hazel eyes, white-silver spacesuit with glowing blue 23 badge",
  style:
    "Cinematic science-fiction film still, violet, turquoise and gold color palette, volumetric light, anamorphic 35mm look, highly detailed, 16:9",
  speakers: {
    narrator: { name: "Anlatıcı", defaultVoice: "Vincent" },
    ayshe: { name: "AyShe", defaultVoice: "Maya" },
    pusula: { name: "Pusula", defaultVoice: "Serene" },
    taran: { name: "Bekçi Taran", defaultVoice: "Bernard" },
  },

  clips: [
    // Sahne 1 — Soğuk açılış (0:00–0:15)
    {
      key: "c01",
      scene: 1,
      duration: 10,
      face: false,
      keyframe:
        "A total black void with a few faint stars, a thin line of light beginning to form the number 2300 in the center",
      motion:
        "Stars slowly ignite one by one, glowing light draws the number 2300 in the center, slow push-in",
    },
    {
      key: "c02",
      scene: 1,
      duration: 5,
      face: false,
      keyframe:
        "Deep space nebula in violet and turquoise, a faint distant continent floating in the void between galaxies",
      motion: "Slow drift toward the floating continent, subtle shimmering light",
    },

    // Sahne 2 — Kapsül 23 (0:15–0:35)
    {
      key: "c03",
      scene: 2,
      duration: 10,
      face: true,
      keyframe:
        "lying asleep with eyes closed inside a frost-covered cryo capsule, the lid marked with a glowing blue number 23, close-up through frosted glass",
      motion: "Frost cracks across the glass, soft blue light pulses, her eyelids tremble",
    },
    {
      key: "c04",
      scene: 2,
      duration: 10,
      face: true,
      keyframe:
        "the cryo capsule lid opening in a cloud of cold vapor, she opens her eyes, a small display reads 201",
      motion:
        "The lid slides open, vapor pours out, she opens her eyes and takes a deep breath, gentle camera move",
    },

    // Sahne 3 — Pusula (0:35–0:55)
    {
      key: "c05",
      scene: 3,
      duration: 10,
      face: true,
      keyframe:
        "sitting up in an open cryo capsule in a dim futuristic chamber, a small floating turquoise orb of light hovering in front of her",
      motion:
        "The turquoise orb pulses gently as if speaking, she looks at it in wonder, shallow depth of field",
    },
    {
      key: "c06",
      scene: 3,
      duration: 10,
      face: true,
      keyframe:
        "standing up beside the capsule, the small turquoise orb floating at her shoulder, a glowing doorway behind her",
      motion: "She rises to her feet, the orb circles her once and drifts toward the doorway",
    },

    // Sahne 4 — Elyra (0:55–1:20)
    {
      key: "c07",
      scene: 4,
      duration: 10,
      face: true,
      keyframe:
        "stepping out of a crystal doorway onto an alien continent, two suns in a violet sky, waterfalls flowing upward, floating islands",
      motion:
        "She steps outside, camera pulls back slowly to reveal the vast landscape, her hair moves in the wind",
    },
    {
      key: "c08",
      scene: 4,
      duration: 10,
      face: true,
      keyframe:
        "standing small on a cliff edge in a wide epic shot of Elyra, upward-flowing waterfalls and floating islands under two suns",
      motion: "Slow aerial crane shot around her, waterfalls stream upward into the sky",
    },
    {
      key: "c09",
      scene: 4,
      duration: 5,
      face: false,
      keyframe:
        "A forest of tall crystal trees that are grey, dull and lifeless, dust in the air, two pale suns above",
      motion: "Slow dolly through the grey lifeless crystal forest, drifting dust",
    },

    // Sahne 5 — 23 sütunlu kapı (1:20–1:45)
    {
      key: "c10",
      scene: 5,
      duration: 10,
      face: true,
      keyframe:
        "walking into the center of a circle of 23 ancient stone pillars carved with glowing symbols",
      motion: "She walks slowly into the circle, camera orbits around her, symbols flicker",
    },
    {
      key: "c11",
      scene: 5,
      duration: 10,
      face: true,
      keyframe:
        "close-up of her raised left palm where a glowing blue number 23 appears, her amazed face behind it",
      motion:
        "The blue 23 on her palm brightens, light reflects on her face, symbols on the pillars light up one by one",
    },
    {
      key: "c12",
      scene: 5,
      duration: 5,
      face: false,
      keyframe:
        "A circle of 23 stone pillars with all symbols glowing, a column of white-gold light rising from the center into the sky",
      motion: "The pillars vibrate, a column of light bursts upward from the center",
    },

    // Sahne 6 — Bekçi Taran (1:45–2:15)
    {
      key: "c13",
      scene: 6,
      duration: 10,
      face: false,
      keyframe:
        "A tall ancient semi-transparent guardian with glowing golden eyes and a violet-silver robe that looks woven from crystal, emerging from a column of light",
      motion: "The guardian slowly materializes out of the light, robe shimmering, slow motion",
    },
    {
      key: "c14",
      scene: 6,
      duration: 10,
      face: true,
      keyframe:
        "looking up at a tall semi-transparent guardian with golden eyes, over-the-shoulder shot, mystical light between them",
      motion: "Subtle push-in on her face as she listens, light particles float between them",
    },
    {
      key: "c15",
      scene: 6,
      duration: 10,
      face: false,
      keyframe:
        "Close-up of the ancient semi-transparent guardian with glowing golden eyes, a faint holographic double helix of DNA turning beside him",
      motion: "The guardian speaks slowly, the glowing DNA helix rotates, gentle light shifts",
    },

    // Sahne 7 — Orman canlanıyor (2:15–2:45)
    {
      key: "c16",
      scene: 7,
      duration: 10,
      face: true,
      keyframe:
        "placing her palm on the trunk of a grey crystal tree, the blue 23 glowing on her hand",
      motion: "A wave of light spreads from her palm into the trunk and down into the roots",
    },
    {
      key: "c17",
      scene: 7,
      duration: 10,
      face: true,
      keyframe:
        "smiling with tears in her eyes as the crystal forest around her lights up in violet, turquoise and gold",
      motion:
        "Colors bloom across the crystals behind her, flowers open, she smiles with tears in her eyes",
    },
    {
      key: "c18",
      scene: 7,
      duration: 10,
      face: false,
      keyframe:
        "Wide shot of a crystal forest fully alive, glowing violet, turquoise and gold, flowers blooming, upward waterfalls sparkling",
      motion: "Sweeping aerial shot as the light wave races across the whole forest to the horizon",
    },

    // Sahne 8 — Final (2:45–3:00)
    {
      key: "c19",
      scene: 8,
      duration: 10,
      face: true,
      keyframe:
        "standing on a hilltop at sunset under two setting suns, the small turquoise orb beside her, 22 tiny lights on the far horizon",
      motion: "The 22 lights ignite one by one on the horizon, she smiles warmly",
    },
    {
      key: "c20",
      scene: 8,
      duration: 5,
      face: false,
      keyframe:
        "Silhouette of a young woman from behind on a hilltop, two suns setting, 22 small lights on the horizon",
      motion: "She turns her head as if hearing something, slow fade to darkness",
    },
  ],

  lines: [
    {
      key: "l01",
      scene: 1,
      speaker: "narrator",
      at: 3,
      text: {
        tr: "Yıl 2300. Haritalarda olmayan bir yer var. Hiçbir evrene ait değil. Adı... Elyra.",
        en: "The year is 2300. There is a place that appears on no map. It belongs to no universe. Its name... Elyra.",
        de: "Wir schreiben das Jahr 2300. Es gibt einen Ort, der auf keiner Karte steht. Er gehört zu keinem Universum. Sein Name... Elyra.",
        fr: "Nous sommes en 2300. Il existe un lieu qui ne figure sur aucune carte. Il n'appartient à aucun univers. Son nom... Elyra.",
        es: "Año 2300. Hay un lugar que no aparece en ningún mapa. No pertenece a ningún universo. Su nombre... Elyra.",
        pt: "Ano 2300. Existe um lugar que não aparece em nenhum mapa. Não pertence a nenhum universo. Seu nome... Elyra.",
        ar: "العام 2300. هناك مكان لا يظهر على أي خريطة. لا ينتمي إلى أي كون. اسمه... إليرا.",
        hi: "साल 2300। एक ऐसी जगह है जो किसी नक्शे पर नहीं है। वह किसी ब्रह्मांड का हिस्सा नहीं है। उसका नाम... एलीरा।",
      },
    },
    {
      key: "l02",
      scene: 2,
      speaker: "ayshe",
      at: 21,
      tag: "whispers",
      text: {
        tr: "Neredeyim? Ben... kimim?",
        en: "Where am I? Who... am I?",
        de: "Wo bin ich? Wer... bin ich?",
        fr: "Où suis-je ? Qui... suis-je ?",
        es: "¿Dónde estoy? ¿Quién... soy?",
        pt: "Onde estou? Quem... sou eu?",
        ar: "أين أنا؟ من... أنا؟",
        hi: "मैं कहाँ हूँ? मैं... कौन हूँ?",
      },
    },
    {
      key: "l03",
      scene: 2,
      speaker: "ayshe",
      at: 29,
      tag: "surprised",
      text: {
        tr: "İki yüz bir yıl mı?",
        en: "Two hundred and one years?",
        de: "Zweihundertein Jahre?",
        fr: "Deux cent un ans ?",
        es: "¿Doscientos un años?",
        pt: "Duzentos e um anos?",
        ar: "مئتان وعام واحد؟",
        hi: "दो सौ एक साल?",
      },
    },
    {
      key: "l04",
      scene: 3,
      speaker: "pusula",
      at: 37,
      tag: "warmly",
      text: {
        tr: "Günaydın AyShe. Ya da iyi geceler... Burada saatler biraz karışıktır.",
        en: "Good morning, AyShe. Or good night... Time gets a little confusing here.",
        de: "Guten Morgen, AyShe. Oder gute Nacht... Die Zeit ist hier etwas durcheinander.",
        fr: "Bonjour, AyShe. Ou bonne nuit... Ici, les heures sont un peu confuses.",
        es: "Buenos días, AyShe. O buenas noches... Aquí el tiempo es un poco confuso.",
        pt: "Bom dia, AyShe. Ou boa noite... Aqui as horas são meio confusas.",
        ar: "صباح الخير يا آيشه. أو تصبحين على خير... الوقت هنا مربك قليلًا.",
        hi: "सुप्रभात, आयशे। या शुभ रात्रि... यहाँ समय थोड़ा उलझा हुआ है।",
      },
    },
    {
      key: "l05",
      scene: 3,
      speaker: "ayshe",
      at: 43.5,
      tag: "confused",
      text: {
        tr: "AyShe... Benim adım bu mu?",
        en: "AyShe... Is that my name?",
        de: "AyShe... Ist das mein Name?",
        fr: "AyShe... C'est mon nom ?",
        es: "AyShe... ¿Ese es mi nombre?",
        pt: "AyShe... Esse é o meu nome?",
        ar: "آيشه... هل هذا اسمي؟",
        hi: "आयशे... क्या यह मेरा नाम है?",
      },
    },
    {
      key: "l06",
      scene: 3,
      speaker: "pusula",
      at: 47,
      text: {
        tr: "Evet. Ben Pusula. Seni 201 yıldır bekliyorum. Kalk hadi, sana göstermem gereken bir dünya var.",
        en: "Yes. I'm Compass. I've been waiting for you for 201 years. Come on, get up. There's a world I need to show you.",
        de: "Ja. Ich bin Kompass. Ich warte seit 201 Jahren auf dich. Komm, steh auf. Ich muss dir eine Welt zeigen.",
        fr: "Oui. Je suis Boussole. Je t'attends depuis 201 ans. Allez, lève-toi. J'ai un monde à te montrer.",
        es: "Sí. Soy Brújula. Te he esperado durante 201 años. Vamos, levántate. Tengo un mundo que mostrarte.",
        pt: "Sim. Eu sou Bússola. Espero por você há 201 anos. Vamos, levante-se. Tenho um mundo para te mostrar.",
        ar: "نعم. أنا البوصلة. أنتظرك منذ 201 عام. هيا انهضي، هناك عالم عليّ أن أريك إياه.",
        hi: "हाँ। मैं कंपास हूँ। मैं 201 साल से तुम्हारा इंतज़ार कर रही हूँ। चलो उठो, तुम्हें एक दुनिया दिखानी है।",
      },
    },
    {
      key: "l07",
      scene: 4,
      speaker: "ayshe",
      at: 62,
      tag: "awestruck",
      text: {
        tr: "Burası... Dünya değil.",
        en: "This... isn't Earth.",
        de: "Das hier... ist nicht die Erde.",
        fr: "Ce n'est... pas la Terre.",
        es: "Esto... no es la Tierra.",
        pt: "Isto... não é a Terra.",
        ar: "هذا... ليس كوكب الأرض.",
        hi: "यह... पृथ्वी नहीं है।",
      },
    },
    {
      key: "l08",
      scene: 4,
      speaker: "pusula",
      at: 65,
      text: {
        tr: "Aslında hiçbir yer değil. Elyra evrenlerin arasındaki boşlukta durur. Hiçbir haritada yoktur.",
        en: "It isn't anywhere, really. Elyra floats in the void between universes. It's on no map.",
        de: "Eigentlich ist es nirgendwo. Elyra schwebt in der Leere zwischen den Universen. Keine Karte zeigt es.",
        fr: "En fait, ce n'est nulle part. Elyra flotte dans le vide entre les univers. Aucune carte ne la montre.",
        es: "En realidad, no está en ningún lugar. Elyra flota en el vacío entre universos. No aparece en ningún mapa.",
        pt: "Na verdade, não é lugar nenhum. Elyra flutua no vazio entre universos. Não está em nenhum mapa.",
        ar: "في الحقيقة، إنه ليس أي مكان. تطفو إليرا في الفراغ بين الأكوان. لا توجد على أي خريطة.",
        hi: "असल में यह कहीं नहीं है। एलीरा ब्रह्मांडों के बीच के शून्य में तैरती है। यह किसी नक्शे पर नहीं है।",
      },
    },
    {
      key: "l09",
      scene: 4,
      speaker: "ayshe",
      at: 73,
      tag: "sad",
      text: {
        tr: "Peki neden her şey bu kadar... ölü?",
        en: "Then why does everything look so... dead?",
        de: "Aber warum ist hier alles so... tot?",
        fr: "Alors pourquoi tout est-il si... mort ?",
        es: "¿Y por qué todo parece tan... muerto?",
        pt: "Então por que tudo parece tão... morto?",
        ar: "إذن لماذا يبدو كل شيء... ميتًا هكذا؟",
        hi: "तो फिर सब कुछ इतना... बेजान क्यों है?",
      },
    },
    {
      key: "l10",
      scene: 4,
      speaker: "pusula",
      at: 77,
      tag: "softly",
      text: {
        tr: "Çünkü seni bekliyordu.",
        en: "Because it was waiting for you.",
        de: "Weil es auf dich gewartet hat.",
        fr: "Parce qu'il t'attendait.",
        es: "Porque te estaba esperando.",
        pt: "Porque estava esperando por você.",
        ar: "لأنه كان ينتظرك.",
        hi: "क्योंकि यह तुम्हारा इंतज़ार कर रहा था।",
      },
    },
    {
      key: "l11",
      scene: 5,
      speaker: "ayshe",
      at: 90,
      tag: "amazed",
      text: {
        tr: "Yirmi üç... Her yerde bu sayı var. Kapsülde, sütunlarda... şimdi de elimde.",
        en: "Twenty-three... This number is everywhere. On the capsule, on the pillars... and now, on my hand.",
        de: "Dreiundzwanzig... Diese Zahl ist überall. Auf der Kapsel, auf den Säulen... und jetzt auf meiner Hand.",
        fr: "Vingt-trois... Ce nombre est partout. Sur la capsule, sur les colonnes... et maintenant, dans ma main.",
        es: "Veintitrés... Este número está en todas partes. En la cápsula, en los pilares... y ahora, en mi mano.",
        pt: "Vinte e três... Esse número está em todo lugar. Na cápsula, nos pilares... e agora, na minha mão.",
        ar: "ثلاثة وعشرون... هذا الرقم في كل مكان. على الكبسولة، على الأعمدة... والآن، على يدي.",
        hi: "तेईस... यह संख्या हर जगह है। कैप्सूल पर, खंभों पर... और अब, मेरे हाथ पर।",
      },
    },
    {
      key: "l12",
      scene: 6,
      speaker: "taran",
      at: 108,
      tag: "slowly",
      text: {
        tr: "Sonunda geldin, yirmi üçüncü.",
        en: "At last, you have come, Twenty-Third.",
        de: "Endlich bist du gekommen, Dreiundzwanzigste.",
        fr: "Te voilà enfin, la vingt-troisième.",
        es: "Por fin has llegado, la vigesimotercera.",
        pt: "Enfim você chegou, a vigésima terceira.",
        ar: "أخيرًا جئتِ، أيتها الثالثة والعشرون.",
        hi: "आख़िरकार तुम आ गईं, तेईसवीं।",
      },
    },
    {
      key: "l13",
      scene: 6,
      speaker: "ayshe",
      at: 111.5,
      text: {
        tr: "Sen kimsin?",
        en: "Who are you?",
        de: "Wer bist du?",
        fr: "Qui es-tu ?",
        es: "¿Quién eres?",
        pt: "Quem é você?",
        ar: "من أنت؟",
        hi: "तुम कौन हो?",
      },
    },
    {
      key: "l14",
      scene: 6,
      speaker: "taran",
      at: 113.5,
      text: {
        tr: "Ben Taran, Elyra'nın bekçisi. 2099'da Dünya ölürken yirmi üç kişi uykuya yatırıldı. İnsanlığın yeniden doğuşu için.",
        en: "I am Taran, guardian of Elyra. In 2099, as Earth was dying, twenty-three people were put to sleep. For the rebirth of humanity.",
        de: "Ich bin Taran, der Wächter von Elyra. Im Jahr 2099, als die Erde starb, wurden dreiundzwanzig Menschen in den Schlaf versetzt. Für die Wiedergeburt der Menschheit.",
        fr: "Je suis Taran, le gardien d'Elyra. En 2099, alors que la Terre mourait, vingt-trois personnes ont été endormies. Pour la renaissance de l'humanité.",
        es: "Soy Taran, el guardián de Elyra. En 2099, mientras la Tierra moría, veintitrés personas fueron dormidas. Para el renacer de la humanidad.",
        pt: "Eu sou Taran, o guardião de Elyra. Em 2099, enquanto a Terra morria, vinte e três pessoas foram postas para dormir. Para o renascimento da humanidade.",
        ar: "أنا تاران، حارس إليرا. في عام 2099، بينما كانت الأرض تموت، وُضع ثلاثة وعشرون شخصًا في سبات. من أجل ولادة البشرية من جديد.",
        hi: "मैं तारन हूँ, एलीरा का रक्षक। 2099 में, जब पृथ्वी मर रही थी, तेईस लोगों को गहरी नींद में सुला दिया गया। मानवता के पुनर्जन्म के लिए।",
      },
    },
    {
      key: "l15",
      scene: 6,
      speaker: "ayshe",
      at: 124,
      text: {
        tr: "Neden ben?",
        en: "Why me?",
        de: "Warum ich?",
        fr: "Pourquoi moi ?",
        es: "¿Por qué yo?",
        pt: "Por que eu?",
        ar: "لماذا أنا؟",
        hi: "मैं ही क्यों?",
      },
    },
    {
      key: "l16",
      scene: 6,
      speaker: "taran",
      at: 126,
      text: {
        tr: "Her insanın içinde yirmi üç çift kromozom vardır. Ama seninkiler... hatırlıyor. Bu kıtayı uyandıracak olan sensin.",
        en: "Every human carries twenty-three pairs of chromosomes. But yours... remember. You are the one who will awaken this continent.",
        de: "Jeder Mensch trägt dreiundzwanzig Chromosomenpaare in sich. Aber deine... erinnern sich. Du bist diejenige, die diesen Kontinent erwecken wird.",
        fr: "Chaque être humain porte vingt-trois paires de chromosomes. Mais les tiens... se souviennent. C'est toi qui éveilleras ce continent.",
        es: "Todo ser humano lleva veintitrés pares de cromosomas. Pero los tuyos... recuerdan. Tú eres quien despertará este continente.",
        pt: "Todo ser humano carrega vinte e três pares de cromossomos. Mas os seus... se lembram. É você quem vai despertar este continente.",
        ar: "كل إنسان يحمل ثلاثة وعشرين زوجًا من الكروموسومات. لكن كروموسوماتك... تتذكر. أنتِ من سيوقظ هذه القارة.",
        hi: "हर इंसान में तेईस जोड़े गुणसूत्र होते हैं। लेकिन तुम्हारे... याद रखते हैं। इस महाद्वीप को जगाने वाली तुम ही हो।",
      },
    },
    {
      key: "l17",
      scene: 7,
      speaker: "ayshe",
      at: 152,
      tag: "emotional",
      text: {
        tr: "Canlanıyor...",
        en: "It's coming alive...",
        de: "Er wird lebendig...",
        fr: "Elle reprend vie...",
        es: "Está cobrando vida...",
        pt: "Está ganhando vida...",
        ar: "إنها تعود إلى الحياة...",
        hi: "यह जीवित हो रहा है...",
      },
    },
    {
      key: "l18",
      scene: 7,
      speaker: "pusula",
      at: 156,
      tag: "warmly",
      text: {
        tr: "Hayır AyShe. Uyanıyor. Tıpkı senin gibi.",
        en: "No, AyShe. It's waking up. Just like you.",
        de: "Nein, AyShe. Er erwacht. Genau wie du.",
        fr: "Non, AyShe. Elle s'éveille. Tout comme toi.",
        es: "No, AyShe. Está despertando. Igual que tú.",
        pt: "Não, AyShe. Está despertando. Assim como você.",
        ar: "لا يا آيشه. إنها تستيقظ. تمامًا مثلك.",
        hi: "नहीं, आयशे। यह जाग रहा है। बिल्कुल तुम्हारी तरह।",
      },
    },
    {
      key: "l19",
      scene: 8,
      speaker: "pusula",
      at: 168,
      text: {
        tr: "Yirmi iki kapsül daha uyanıyor.",
        en: "Twenty-two more capsules are waking up.",
        de: "Zweiundzwanzig weitere Kapseln erwachen.",
        fr: "Vingt-deux autres capsules s'éveillent.",
        es: "Otras veintidós cápsulas están despertando.",
        pt: "Mais vinte e duas cápsulas estão despertando.",
        ar: "اثنتان وعشرون كبسولة أخرى تستيقظ.",
        hi: "बाईस और कैप्सूल जाग रहे हैं।",
      },
    },
    {
      key: "l20",
      scene: 8,
      speaker: "ayshe",
      at: 171.5,
      tag: "smiling",
      text: {
        tr: "Demek yalnız değilim.",
        en: "So I'm not alone.",
        de: "Ich bin also nicht allein.",
        fr: "Alors je ne suis pas seule.",
        es: "Entonces no estoy sola.",
        pt: "Então eu não estou sozinha.",
        ar: "إذن لستُ وحدي.",
        hi: "तो मैं अकेली नहीं हूँ।",
      },
    },
    {
      key: "l21",
      scene: 8,
      speaker: "ayshe",
      at: 175,
      tag: "whispers",
      radio: true,
      text: {
        tr: "...beni duyan var mı...",
        en: "...can anyone hear me...",
        de: "...hört mich jemand...",
        fr: "...quelqu'un m'entend...",
        es: "...¿alguien me oye...?",
        pt: "...alguém me ouve...?",
        ar: "...هل يسمعني أحد...",
        hi: "...क्या कोई मुझे सुन रहा है...",
      },
    },
  ],

  captions: [
    {
      from: 177.5,
      to: 180,
      text: {
        tr: "Bölüm 2 — Kayıp Sinyal",
        en: "Episode 2 — Lost Signal",
        de: "Folge 2 — Verlorenes Signal",
        fr: "Épisode 2 — Signal perdu",
        es: "Episodio 2 — Señal perdida",
        pt: "Episódio 2 — Sinal perdido",
        ar: "الحلقة 2 — الإشارة المفقودة",
        hi: "एपिसोड 2 — खोया हुआ सिग्नल",
      },
    },
  ],
};
