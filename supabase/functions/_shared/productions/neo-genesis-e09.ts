/**
 * Neo-Genesis: 2300 — Bölüm 9 "Kod Adı: Genesis" (180 sn).
 * AyShe sönmüş Pusula'yı 23 sütunlu taş çembere götürür. Bekçi Taran onu yeniden uyandırmayı öğretir.
 * Pusula'nın çekirdeği açılır: 2099'da AyShe, Genesis Projesi'nin genç tasarımcısıdır; Pusula'yı o yazmış
 * ve anılarını içine saklamıştır. Vael o zaman onun ekip arkadaşıdır. Pusula geri döner.
 * Son: Taran gri ölümün kuzeyden ormana yayıldığını gösterir.
 */
import { MEMORY_GRADE, NIL, PUSULA, TARAN, episode, t } from "./neo-genesis-cast.ts";

const YOUNG_VAEL = "a young man of about twenty with short dark hair and pale grey eyes in a white lab coat";

export const neoGenesisE9 = episode({
  episode: 9,
  title: t("Kod Adı: Genesis", "Codename: Genesis", "Codename: Genesis", "Nom de code : Genesis", "Nombre clave: Genesis", "Codinome: Genesis", "الاسم الرمزي: جينيسيس", "कोडनेम: जेनेसिस"),
  clips: [
    // Sahne 1 — Taş çember (0:00–0:20)
    [1, 10, true,
      `exhausted but determined expression, walking into a circle of tall ancient stone pillars at dusk holding a dark glass orb, ${NIL} beside her`,
      "They walk slowly into the circle, the carved symbols on the pillars flicker faintly, camera tracks alongside"],
    [1, 10, false,
      "A circle of tall ancient stone pillars carved with symbols at dusk, a column of white-gold light rising from its center",
      "The symbols light up one by one, a column of light bursts upward, camera slowly circles"],

    // Sahne 2 — Taran (0:20–0:45)
    [2, 10, false,
      `${TARAN} stepping out of a column of white-gold light, robe shimmering`,
      "He steps forward out of the light, robe rippling like water"],
    [2, 5, false,
      `${NIL} hiding behind a stone pillar and peeking out, wide-eyed, golden light on her face`,
      "She peeks out slowly from behind the pillar, mouth open"],
    [2, 10, true,
      `pleading expression, holding out a dark glass orb toward ${TARAN} in golden light`,
      "She lifts the orb toward him with both hands, golden particles drift between them"],

    // Sahne 3 — Uyandırma (0:45–1:05)
    [3, 10, true,
      "concentrated expression, eyes closed, kneeling in the center of a stone circle with both palms on a dark glass orb on the ground",
      "Blue light flows from her palms into the orb, the pillars around her glow brighter"],
    [3, 10, false,
      "Close-up of a dark cracked glass orb on stone filling with swirling light, the cracks sealing",
      "The cracks glow and seal one by one, swirling light fills the orb"],

    // Sahne 4 — 2099 laboratuvar (1:05–1:35)
    [4, 10, false,
      `A large futuristic laboratory with rows of white cryo capsules, red sky visible through tall windows, ${MEMORY_GRADE}`,
      "Slow dolly between the rows of capsules toward the red windows"],
    [4, 10, true,
      `focused, young expression, wearing a white lab coat, shaping a small turquoise orb of light between her hands over a lab table, ${MEMORY_GRADE}`,
      "The orb of light forms and brightens between her hands, she smiles faintly in wonder"],
    [4, 10, false,
      `${YOUNG_VAEL} watching from a lab doorway with tired worried eyes, ${MEMORY_GRADE}`,
      "He leans on the doorframe and watches, then slowly walks in"],

    // Sahne 5 — Tartışma (1:35–1:50)
    [5, 10, false,
      `${YOUNG_VAEL} standing at a tall window looking out at a burning red sky, ${MEMORY_GRADE}`,
      "Embers drift past the window, he presses his fist against the glass"],
    [5, 5, true,
      `serious, gentle expression, wearing a white lab coat, standing beside a window with a red sky, ${MEMORY_GRADE}`,
      "She turns her head toward him and answers softly"],

    // Sahne 6 — Saklanan anılar (1:50–2:15)
    [6, 10, true,
      `emotional expression, wearing a white lab coat, holding a small turquoise orb close to her face and speaking to it, ${MEMORY_GRADE}`,
      "She whispers to the orb, its light pulses as if listening"],
    [6, 10, false,
      `Threads of warm golden light flowing from a young woman's forehead into a small turquoise orb, ${MEMORY_GRADE}`,
      "Golden threads stream into the orb, it glows brighter and brighter"],
    [6, 5, false,
      `A white cryo capsule lid closing over a sleeping figure, ${MEMORY_GRADE}`,
      "The lid slides shut and frost spreads across the glass"],

    // Sahne 7 — Pusula döndü (2:15–2:40)
    [7, 10, false,
      `${PUSULA} bursting back to life above a stone circle at night, shining brighter than ever`,
      "The orb flares with light and spins up into the air, sparks of light spiral out"],
    [7, 10, true,
      "tears streaming down her face, a gentle closed-lip smile, no teeth, looking up at a glowing orb in a stone circle at night",
      "She laughs softly through tears and reaches up, the orb drifts down into her hands"],
    [7, 5, false,
      `${NIL} running into a hug at night in a stone circle, glowing turquoise light around`,
      "She runs in and throws her arms around someone's waist"],

    // Sahne 8 — Gri ölüm (2:40–3:00)
    [8, 10, false,
      "A glowing crystal forest at night slowly turning grey and dull from the far side, the grey spreading like frost",
      "The grey creeps toward the camera tree by tree, the colors drain away"],
    [8, 10, true,
      `grim, determined expression, standing in a stone circle at night beside ${TARAN}, looking at a dying grey forest`,
      "She clenches her fist, the blue mark on her palm glows, camera pulls back high above, fade to dark"],
  ],

  lines: [
    { scene: 1, speaker: "narrator", at: 3, text: t(
      "Her şeyin başladığı yer. Yirmi üç taş. Yirmi üç uyuyan.",
      "The place where it all began. Twenty-three stones. Twenty-three sleepers.",
      "Der Ort, an dem alles begann. Dreiundzwanzig Steine. Dreiundzwanzig Schläfer.",
      "Le lieu où tout a commencé. Vingt-trois pierres. Vingt-trois dormeurs.",
      "El lugar donde todo empezó. Veintitrés piedras. Veintitrés durmientes.",
      "O lugar onde tudo começou. Vinte e três pedras. Vinte e três adormecidos.",
      "المكان الذي بدأ فيه كل شيء. ثلاثة وعشرون حجرًا. ثلاثة وعشرون نائمًا.",
      "वह जगह जहाँ सब शुरू हुआ था। तेईस पत्थर। तेईस सोए हुए लोग।") },
    { scene: 2, speaker: "taran", at: 23, text: t(
      "Yirmi üçüncü. Döndün. Ve kırık bir yıldız getirdin.",
      "Twenty-third. You've returned. And you've brought a broken star.",
      "Dreiundzwanzigste. Du bist zurück. Und du bringst einen zerbrochenen Stern.",
      "Vingt-troisième. Tu es revenue. Et tu as apporté une étoile brisée.",
      "Vigésimo tercera. Has vuelto. Y has traído una estrella rota.",
      "Vigésima terceira. Você voltou. E trouxe uma estrela quebrada.",
      "أيتها الثالثة والعشرون. لقد عدتِ. وأحضرتِ نجمة مكسورة.",
      "तेईसवीं। तुम लौट आईं। और एक टूटा हुआ तारा लाई हो।") },
    { scene: 2, speaker: "ayshe", at: 36, tag: "pleading", text: t(
      "Onu kurtar. Lütfen. Anılarım onun içinde.",
      "Save her. Please. My memories are inside her.",
      "Rette sie. Bitte. Meine Erinnerungen sind in ihr.",
      "Sauve-la. S'il te plaît. Mes souvenirs sont en elle.",
      "Sálvala. Por favor. Mis recuerdos están dentro de ella.",
      "Salva ela. Por favor. Minhas lembranças estão dentro dela.",
      "أنقذها. أرجوك. ذكرياتي في داخلها.",
      "उसे बचा लो। प्लीज़। मेरी यादें उसके अंदर हैं।") },
    { scene: 3, speaker: "taran", at: 47, text: t(
      "Ben değil, sen kurtaracaksın. Onu yaratan elle dokun.",
      "Not me. You will save her. Touch her with the hand that created her.",
      "Nicht ich. Du wirst sie retten. Berühre sie mit der Hand, die sie erschaffen hat.",
      "Pas moi. C'est toi qui la sauveras. Touche-la avec la main qui l'a créée.",
      "Yo no. La salvarás tú. Tócala con la mano que la creó.",
      "Não eu. Você vai salvá-la. Toque nela com a mão que a criou.",
      "لستُ أنا. أنتِ من سينقذها. المسيها باليد التي صنعتها.",
      "मैं नहीं। तुम उसे बचाओगी। उसे उस हाथ से छुओ जिसने उसे बनाया था।") },
    { scene: 4, speaker: "narrator", at: 66, text: t(
      "2099. Dünya'nın son yazı.",
      "2099. Earth's last summer.",
      "2099. Der letzte Sommer der Erde.",
      "2099. Le dernier été de la Terre.",
      "2099. El último verano de la Tierra.",
      "2099. O último verão da Terra.",
      "2099. الصيف الأخير للأرض.",
      "2099। धरती की आख़िरी गर्मी।") },
    { scene: 4, speaker: "ayshe", at: 76, tag: "softly", text: t(
      "Merhaba küçük şey. Senin adın Pusula olsun. Kaybolursam beni bulursun.",
      "Hello, little one. Your name will be Compass. If I get lost, you'll find me.",
      "Hallo, Kleines. Dein Name soll Kompass sein. Wenn ich mich verliere, findest du mich.",
      "Bonjour, petite chose. Tu t'appelleras Boussole. Si je me perds, tu me retrouveras.",
      "Hola, pequeña. Te llamarás Brújula. Si me pierdo, me encontrarás.",
      "Oi, pequena. Seu nome vai ser Bússola. Se eu me perder, você me encontra.",
      "مرحبًا يا صغيرة. سيكون اسمكِ البوصلة. إن ضعتُ، ستجدينني.",
      "नमस्ते, नन्ही। तुम्हारा नाम कंपास होगा। अगर मैं खो जाऊँ, तो तुम मुझे ढूँढ लेना।") },
    { scene: 4, speaker: "vael", at: 87, tag: "tired", text: t(
      "Hâlâ çalışıyorsun, AyShe? Kod adı Genesis'in uyuması gerek.",
      "Still working, AyShe? Codename Genesis needs her sleep.",
      "Arbeitest du immer noch, AyShe? Codename Genesis braucht Schlaf.",
      "Tu travailles encore, AyShe ? Le nom de code Genesis a besoin de dormir.",
      "¿Sigues trabajando, AyShe? Nombre clave Genesis necesita dormir.",
      "Ainda trabalhando, AyShe? A codinome Genesis precisa dormir.",
      "ما زلتِ تعملين يا AyShe؟ صاحبة الاسم الرمزي جينيسيس تحتاج إلى النوم.",
      "अब भी काम कर रही हो, AyShe? कोडनेम जेनेसिस को नींद चाहिए।") },
    { scene: 5, speaker: "vael", at: 96, tag: "bitter", text: t(
      "İnsanlık bu acıyı unutmadıkça asla iyileşmeyecek.",
      "Humanity will never heal unless it forgets this pain.",
      "Die Menschheit wird nie heilen, solange sie diesen Schmerz nicht vergisst.",
      "L'humanité ne guérira jamais tant qu'elle n'oubliera pas cette douleur.",
      "La humanidad nunca sanará a menos que olvide este dolor.",
      "A humanidade nunca vai se curar se não esquecer essa dor.",
      "البشرية لن تُشفى أبدًا ما لم تنسَ هذا الألم.",
      "जब तक इंसानियत ये दर्द नहीं भूलती, वह कभी ठीक नहीं होगी।") },
    { scene: 5, speaker: "ayshe", at: 104, tag: "gently", text: t(
      "Acıyı unutan, sevgiyi de unutur, Vael.",
      "Whoever forgets the pain forgets the love too, Vael.",
      "Wer den Schmerz vergisst, vergisst auch die Liebe, Vael.",
      "Qui oublie la douleur oublie aussi l'amour, Vael.",
      "Quien olvida el dolor también olvida el amor, Vael.",
      "Quem esquece a dor também esquece o amor, Vael.",
      "من ينسى الألم ينسى الحب أيضًا يا فايل.",
      "जो दर्द भूल जाता है, वह प्यार भी भूल जाता है, वेल।") },
    { scene: 6, speaker: "ayshe", at: 112, tag: "whispers", text: t(
      "Eğer bir gün hafızamı kaybedersem, Pusula, her şeyi bana sen geri ver.",
      "If I ever lose my memory, Compass, you give it all back to me.",
      "Falls ich je mein Gedächtnis verliere, Kompass, gib du mir alles zurück.",
      "Si un jour je perds la mémoire, Boussole, rends-moi tout.",
      "Si algún día pierdo la memoria, Brújula, devuélvemelo todo.",
      "Se um dia eu perder a memória, Bússola, me devolve tudo.",
      "إن فقدتُ ذاكرتي يومًا يا بوصلة، أعيدي إليّ كل شيء.",
      "अगर कभी मेरी याददाश्त चली जाए, कंपास, तो सब कुछ मुझे तुम लौटाना।") },
    { scene: 7, speaker: "pusula", at: 137, tag: "joyful", text: t(
      "AyShe! Seni hatırlıyorum. Hepsini. Ve şimdi sen de hatırlayacaksın.",
      "AyShe! I remember you. All of it. And now you will remember too.",
      "AyShe! Ich erinnere mich an dich. An alles. Und jetzt wirst auch du dich erinnern.",
      "AyShe ! Je me souviens de toi. De tout. Et maintenant, toi aussi tu vas te souvenir.",
      "¡AyShe! Te recuerdo. Todo. Y ahora tú también recordarás.",
      "AyShe! Eu lembro de você. De tudo. E agora você também vai lembrar.",
      "AyShe! أتذكّركِ. كل شيء. والآن ستتذكرين أنتِ أيضًا.",
      "AyShe! मुझे तुम याद हो। सब कुछ। और अब तुम्हें भी याद आएगा।") },
    { scene: 7, speaker: "ayshe", at: 150, tag: "crying, laughing", text: t(
      "Seni ben yapmışım... Hoş geldin, küçük şey.",
      "I made you... Welcome back, little one.",
      "Ich habe dich erschaffen... Willkommen zurück, Kleines.",
      "C'est moi qui t'ai créée... Bon retour, petite chose.",
      "Yo te creé... Bienvenida, pequeña.",
      "Fui eu que te criei... Bem-vinda de volta, pequena.",
      "أنا من صنعتكِ... أهلًا بعودتكِ يا صغيرة.",
      "मैंने तुम्हें बनाया था... वापसी मुबारक, नन्ही।") },
    { scene: 8, speaker: "taran", at: 162, tag: "grave", text: t(
      "Elyra anılarla yaşar. Kule onları yuttukça kıta ölüyor. Zamanımız az.",
      "Elyra lives on memories. As the Tower devours them, the continent dies. We have little time.",
      "Elyra lebt von Erinnerungen. Während der Turm sie verschlingt, stirbt der Kontinent. Uns bleibt wenig Zeit.",
      "Elyra vit de souvenirs. À mesure que la Tour les dévore, le continent meurt. Le temps presse.",
      "Elyra vive de recuerdos. Mientras la Torre los devora, el continente muere. Nos queda poco tiempo.",
      "Elyra vive de lembranças. Enquanto a Torre as devora, o continente morre. Temos pouco tempo.",
      "إليرا تحيا بالذكريات. وكلما التهمها البرج، يموت هذا العالم. وقتنا قليل.",
      "एलीरा यादों से ज़िंदा है। टावर जितना उन्हें निगलता है, यह महाद्वीप उतना मरता है। हमारे पास वक़्त कम है।") },
    { scene: 8, speaker: "ayshe", at: 173, tag: "determined", text: t(
      "O zaman Rün'ü geri almaya gidiyorum.",
      "Then I'm going to get Rün back.",
      "Dann hole ich Rün zurück.",
      "Alors je vais chercher Rün.",
      "Entonces voy a recuperar a Rün.",
      "Então eu vou buscar o Rün.",
      "إذن سأذهب لأستعيد رون.",
      "तो मैं रून को वापस लाने जा रही हूँ।") },
  ],
  next: { n: 10, title: t("Kırık Bağ", "Broken Bond", "Zerbrochenes Band", "Le Lien brisé", "Lazo roto", "Laço partido", "الرابط المكسور", "टूटा बंधन") },
});
