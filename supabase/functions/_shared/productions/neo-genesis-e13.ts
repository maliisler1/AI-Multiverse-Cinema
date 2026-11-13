/**
 * Neo-Genesis: 2300 — Bölüm 13 "Son Geri Sayım" (180 sn).
 * Silgi'ye dönüştürülmüş Rün, AyShe'ye saldırır; AyShe ona karşı savaşmaz. Nil ninniyi söyler, AyShe
 * Rün'ün çalınan anısını geri verir. Rün kız kardeşini ve AyShe'yi hatırlar. İki güneş birleşmek üzere.
 * Rün ve Mera Silgileri durdururken AyShe Pusula ile Kule'nin tepesine yükselir.
 * Son: kapılar açılır, Vael çekirdekte bekliyor.
 */
import { MEMORY_GRADE, MERA, NIL, PUSULA, SILGI, VAEL, episode, t } from "./neo-genesis-cast.ts";

const RUN_SILGI =
  "a handsome young man of about twenty with short messy dark-blond hair, bright green eyes and a small scar on his left eyebrow, wearing a long hooded white coat";

export const neoGenesisE13 = episode({
  episode: 13,
  title: t("Son Geri Sayım", "Final Countdown", "Letzter Countdown", "Compte à rebours final", "Cuenta atrás final", "Contagem regressiva final", "العد التنازلي الأخير", "आख़िरी उलटी गिनती"),
  clips: [
    // Sahne 1 — Saldırı (0:00–0:20)
    [1, 10, false,
      `${RUN_SILGI}, with an empty stare, raising his palm and firing a beam of cold white light inside a glass tower`,
      "He raises his hand and a white beam shoots toward the camera"],
    [1, 10, true,
      "fast, alert expression, diving sideways across a glass floor as a white beam blasts past her, rivers of light behind",
      "She dives and rolls, the beam scorches the floor where she stood"],

    // Sahne 2 — Kavga (0:20–0:45)
    [2, 10, false,
      `${MERA} swinging her arms as thick vines burst from the floor and wrap two ${SILGI} against a glass wall`,
      "Vines erupt and slam the figures against the wall, glass cracks"],
    [2, 5, false,
      `${PUSULA} zipping in circles around a masked figure's head, dazzling it with flashes`,
      "The orb whirls around fast flashing light, the figure swats at it"],
    [2, 10, true,
      "backing away with open empty hands, refusing to fight, at the edge of a narrow glass bridge, rivers of light below",
      "She steps back slowly, her heel reaches the edge, camera pushes past her to the drop below"],

    // Sahne 3 — Ninni (0:45–1:05)
    [3, 10, false,
      `${NIL} stepping in front of a raised glowing hand on a glass bridge and singing, arms spread wide`,
      "She plants herself and sings, her small arms stretched out"],
    [3, 10, false,
      `${RUN_SILGI} freezing with his glowing hand raised, his empty eyes flickering, glass tower`,
      "His hand trembles, the white light in his palm sputters and fades"],

    // Sahne 4 — Anı geri dönüyor (1:05–1:35)
    [4, 10, true,
      "tender, focused expression, stepping forward and placing her glowing palm on someone's forehead on a glass bridge",
      "Blue light flows from her palm, a thread of golden light descends from above into his forehead"],
    [4, 10, false,
      `A little girl with two braids running through a golden sunflower field away from the camera, laughing, ${MEMORY_GRADE}`,
      "She runs and spins through the sunflowers, the camera follows behind her"],
    [4, 10, false,
      `${RUN_SILGI} falling to his knees on a glass bridge, color returning to his eyes, tears streaming`,
      "He drops to his knees, gasps, and covers his face with his hands"],

    // Sahne 5 — Rün döndü (1:35–1:50)
    [5, 10, true,
      "kneeling and holding someone's shoulders on a glass bridge, eyes wet, a small relieved closed-lip smile, no teeth",
      "She grips his shoulders, he lifts his head and looks at her, camera slowly circles"],
    [5, 5, false,
      `${RUN_SILGI} tearing off his white coat and throwing it away, standing up with fire in his eyes`,
      "He rips off the coat, throws it aside and rises to his feet"],

    // Sahne 6 — Güneşler (1:50–2:15)
    [6, 10, false,
      "Two suns almost touching each other low above a frozen horizon, seen through a curved glass wall, the sky turning deep red",
      "The two suns slide closer together, red light floods across the glass"],
    [6, 10, false,
      "The inside of a hollow glass tower shaking, cracks running up the walls, rivers of light swirling faster",
      "The tower trembles, cracks race upward, the light rivers spin faster"],
    [6, 5, true,
      "urgent expression, looking up at a shaking glass tower as dust falls around her",
      "She looks up sharply as dust rains down"],

    // Sahne 7 — Siz gidin (2:15–2:40)
    [7, 10, false,
      `Four ${SILGI} advancing in a line across a glass hall toward the camera, red light behind them`,
      "They march forward in step, coats sweeping, red light pulses"],
    [7, 10, false,
      `${MERA} and a young man with dark-blond hair standing side by side facing masked figures, vines rising behind them, red light`,
      "Vines rise behind them like a wall, they plant their feet and raise their hands"],
    [7, 5, true,
      `torn expression, stepping backward into a glowing elevator of light with ${PUSULA}, looking back`,
      "She steps back into the light, still looking back at her friends"],

    // Sahne 8 — Tepe (2:40–3:00)
    [8, 10, true,
      `steeling herself, standing alone inside a column of light rising swiftly up a glass tower, ${PUSULA} at her shoulder`,
      "The light carries her upward fast, floors flash past, wind lifts her hair"],
    [8, 10, false,
      `Glass doors sliding open onto a round chamber at the top of a tower full of swirling light, ${VAEL} standing at the center with his back turned`,
      "The doors part slowly, Vael turns his head, slow push-in, cut to black"],
  ],

  lines: [
    { scene: 1, speaker: "ayshe", at: 4, tag: "shouts", text: t(
      "Rün, benim! AyShe!",
      "Rün, it's me! AyShe!",
      "Rün, ich bin's! AyShe!",
      "Rün, c'est moi ! AyShe !",
      "¡Rün, soy yo! ¡AyShe!",
      "Rün, sou eu! AyShe!",
      "رون، إنها أنا! AyShe!",
      "रून, मैं हूँ! AyShe!") },
    { scene: 1, speaker: "run", at: 13, tag: "flat, cold", text: t(
      "Seni tanımıyorum. Vael sessizliği korumamı istedi.",
      "I don't know you. Vael asked me to protect the silence.",
      "Ich kenne dich nicht. Vael hat mich gebeten, die Stille zu schützen.",
      "Je ne te connais pas. Vael m'a demandé de protéger le silence.",
      "No te conozco. Vael me pidió que protegiera el silencio.",
      "Eu não te conheço. O Vael me pediu pra proteger o silêncio.",
      "لا أعرفكِ. طلب مني فايل أن أحمي الصمت.",
      "मैं तुम्हें नहीं जानता। वेल ने मुझसे ख़ामोशी की रक्षा करने को कहा है।") },
    { scene: 2, speaker: "mera", at: 22, tag: "shouts", text: t(
      "AyShe, ona saldır! Başka yolu yok!",
      "AyShe, fight him! There's no other way!",
      "AyShe, kämpf gegen ihn! Es gibt keinen anderen Weg!",
      "AyShe, bats-toi ! Il n'y a pas d'autre moyen !",
      "¡AyShe, lucha contra él! ¡No hay otra forma!",
      "AyShe, luta com ele! Não tem outro jeito!",
      "AyShe، قاتليه! لا توجد طريقة أخرى!",
      "AyShe, उससे लड़ो! और कोई रास्ता नहीं!") },
    { scene: 2, speaker: "ayshe", at: 37, tag: "firm", text: t(
      "Hayır. Onu buz yarığından çıkardım. Şimdi bırakmayacağım.",
      "No. I pulled him out of the ice crevasse. I'm not letting go now.",
      "Nein. Ich habe ihn aus der Gletscherspalte gezogen. Ich lasse ihn jetzt nicht los.",
      "Non. Je l'ai sorti de la crevasse. Je ne le lâcherai pas maintenant.",
      "No. Lo saqué de la grieta de hielo. No voy a soltarlo ahora.",
      "Não. Eu tirei ele da fenda de gelo. Não vou soltar agora.",
      "لا. أخرجته من الشق الجليدي. لن أتركه الآن.",
      "नहीं। मैंने उसे बर्फ़ की दरार से निकाला था। अब नहीं छोड़ूँगी।") },
    { scene: 3, speaker: "nil", at: 46, tag: "sings, trembling", text: t(
      "Uyu küçük yıldız, gökyüzü seni bekler...",
      "Sleep, little star, the sky is waiting for you...",
      "Schlaf, kleiner Stern, der Himmel wartet auf dich...",
      "Dors, petite étoile, le ciel t'attend...",
      "Duerme, estrellita, el cielo te espera...",
      "Dorme, estrelinha, o céu está te esperando...",
      "نامي يا نجمتي الصغيرة، السماء تنتظركِ...",
      "सो जा नन्हे तारे, आसमान तेरा इंतज़ार करता है...") },
    { scene: 3, speaker: "run", at: 58, tag: "confused whisper", text: t(
      "Bu şarkı... Biri bunu bana söylerdi...",
      "That song... Someone used to sing it to me...",
      "Dieses Lied... Jemand hat es mir vorgesungen...",
      "Cette chanson... Quelqu'un me la chantait...",
      "Esa canción... Alguien me la cantaba...",
      "Essa música... Alguém cantava ela pra mim...",
      "هذه الأغنية... كان أحدهم يغنيها لي...",
      "ये गीत... कोई मुझे ये सुनाया करता था...") },
    { scene: 4, speaker: "ayshe", at: 67, tag: "softly", text: t(
      "Bu senin, Rün. Al onu geri.",
      "This is yours, Rün. Take it back.",
      "Das gehört dir, Rün. Nimm es zurück.",
      "C'est à toi, Rün. Reprends-le.",
      "Esto es tuyo, Rün. Recupéralo.",
      "Isso é seu, Rün. Pega de volta.",
      "هذا لك يا رون. استعده.",
      "ये तुम्हारा है, रून। इसे वापस ले लो।") },
    { scene: 4, speaker: "run", at: 86, tag: "sobbing", text: t(
      "Kahkahası... Ela. Adı Ela'ydı. Hatırlıyorum.",
      "Her laugh... Ela. Her name was Ela. I remember.",
      "Ihr Lachen... Ela. Sie hieß Ela. Ich erinnere mich.",
      "Son rire... Ela. Elle s'appelait Ela. Je me souviens.",
      "Su risa... Ela. Se llamaba Ela. Lo recuerdo.",
      "A risada dela... Ela. O nome dela era Ela. Eu lembro.",
      "ضحكتها... إيلا. كان اسمها إيلا. أتذكّر.",
      "उसकी हँसी... एला। उसका नाम एला था। मुझे याद है।") },
    { scene: 5, speaker: "run", at: 97, tag: "emotional", text: t(
      "Acıtıyor, AyShe. Ama benim. Kimsenin onu benden almasına izin vermeyeceğim.",
      "It hurts, AyShe. But it's mine. I won't let anyone take it from me.",
      "Es tut weh, AyShe. Aber es gehört mir. Ich lasse es mir von niemandem nehmen.",
      "Ça fait mal, AyShe. Mais c'est à moi. Je ne laisserai personne me le prendre.",
      "Duele, AyShe. Pero es mío. No dejaré que nadie me lo quite.",
      "Dói, AyShe. Mas é meu. Não vou deixar ninguém tirar isso de mim.",
      "إنه يؤلم يا AyShe. لكنه لي. لن أسمح لأحد أن يأخذه مني.",
      "दर्द होता है, AyShe। पर ये मेरा है। मैं किसी को इसे मुझसे छीनने नहीं दूँगा।") },
    { scene: 6, speaker: "pusula", at: 112, tag: "urgent", text: t(
      "Güneşler birleşiyor! Kule tüm anıları aynı anda yutacak. On dakikamız var!",
      "The suns are meeting! The Tower will swallow every memory at once. We have ten minutes!",
      "Die Sonnen treffen sich! Der Turm wird alle Erinnerungen auf einmal verschlingen. Wir haben zehn Minuten!",
      "Les soleils se rejoignent ! La Tour va avaler tous les souvenirs d'un coup. On a dix minutes !",
      "¡Los soles se unen! La Torre se tragará todos los recuerdos de golpe. ¡Tenemos diez minutos!",
      "Os sóis estão se encontrando! A Torre vai engolir todas as lembranças de uma vez. Temos dez minutos!",
      "الشمسان تلتقيان! سيبتلع البرج كل الذكريات دفعة واحدة. لدينا عشر دقائق!",
      "सूरज मिल रहे हैं! टावर एक साथ सारी यादें निगल जाएगा। हमारे पास दस मिनट हैं!") },
    { scene: 6, speaker: "ayshe", at: 131, text: t(
      "Çekirdek tepede. Oraya çıkmalıyım.",
      "The core is at the top. I have to get up there.",
      "Der Kern ist ganz oben. Ich muss da hinauf.",
      "Le cœur est au sommet. Je dois monter là-haut.",
      "El núcleo está arriba. Tengo que subir.",
      "O núcleo fica no topo. Eu preciso subir lá.",
      "النواة في القمة. يجب أن أصعد إلى هناك.",
      "कोर सबसे ऊपर है। मुझे वहाँ पहुँचना होगा।") },
    { scene: 7, speaker: "run", at: 146, tag: "shouts", text: t(
      "Git, AyShe! Biz onları tutarız!",
      "Go, AyShe! We'll hold them off!",
      "Geh, AyShe! Wir halten sie auf!",
      "Va, AyShe ! On les retient !",
      "¡Ve, AyShe! ¡Nosotros los contenemos!",
      "Vai, AyShe! A gente segura eles!",
      "اذهبي يا AyShe! سنصدّهم!",
      "जाओ, AyShe! हम इन्हें रोक लेंगे!") },
    { scene: 7, speaker: "mera", at: 152, tag: "fierce", text: t(
      "Bu sefer kimse kimseyi unutmuyor.",
      "This time, nobody forgets anybody.",
      "Diesmal vergisst niemand niemanden.",
      "Cette fois, personne n'oublie personne.",
      "Esta vez nadie olvida a nadie.",
      "Dessa vez, ninguém esquece ninguém.",
      "هذه المرة، لن ينسى أحدٌ أحدًا.",
      "इस बार कोई किसी को नहीं भूलेगा।") },
    { scene: 8, speaker: "pusula", at: 163, tag: "quietly", text: t(
      "Ne olursa olsun, yanındayım. Beni sen yaptın, unutma.",
      "Whatever happens, I'm with you. You made me, remember.",
      "Was auch passiert, ich bin bei dir. Du hast mich erschaffen, vergiss das nicht.",
      "Quoi qu'il arrive, je suis avec toi. C'est toi qui m'as créée, souviens-toi.",
      "Pase lo que pase, estoy contigo. Tú me creaste, recuérdalo.",
      "Aconteça o que acontecer, estou com você. Foi você que me criou, lembra.",
      "مهما حدث، أنا معكِ. أنتِ من صنعتني، تذكّري.",
      "जो भी हो, मैं तुम्हारे साथ हूँ। तुमने मुझे बनाया है, याद रखना।") },
    { scene: 8, speaker: "vael", at: 173, tag: "calm", text: t(
      "Hoş geldin, Genesis.",
      "Welcome, Genesis.",
      "Willkommen, Genesis.",
      "Bienvenue, Genesis.",
      "Bienvenida, Genesis.",
      "Bem-vinda, Genesis.",
      "أهلًا بكِ يا جينيسيس.",
      "स्वागत है, जेनेसिस।") },
  ],
  next: { n: 14, title: t("Yüz Yüze", "Face to Face", "Von Angesicht zu Angesicht", "Face à face", "Cara a cara", "Cara a cara", "وجهًا لوجه", "आमने-सामने") },
});
