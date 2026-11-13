/**
 * Neo-Genesis: 2300 — Bölüm 14 "Yüz Yüze" (180 sn).
 * Kule'nin çekirdeğinde AyShe ve Vael karşı karşıya. Vael 2099'da kızını kaybettiğini, kırk yıl tek başına
 * acıyla yaşadığını anlatır; herkesi korumuş ama kendi acısını hiç silmemiştir. Vael AyShe'yi silmeye çalışır,
 * Pusula onu korurken çatlar. AyShe anılarını çekirdeğe akıtır, anı nehirleri ters döner.
 * Son: AyShe yere yığılır, avucundaki işaret söner.
 */
import { MEMORY_GRADE, PUSULA, VAEL, episode, t } from "./neo-genesis-cast.ts";

const CORE =
  "a huge glowing sphere of swirling warm memory light floating in the center of a round glass chamber at the top of a tower";

export const neoGenesisE14 = episode({
  episode: 14,
  title: t("Yüz Yüze", "Face to Face", "Von Angesicht zu Angesicht", "Face à face", "Cara a cara", "Cara a cara", "وجهًا لوجه", "आमने-सामने"),
  clips: [
    // Sahne 1 — Çekirdek (0:00–0:20)
    [1, 10, false,
      `${CORE}, red sunlight pouring through the glass walls`,
      "The sphere swirls slowly, threads of light flow into it from below, camera slowly circles"],
    [1, 10, true,
      `steady, serious expression, no smile, walking slowly toward ${VAEL} across a round glass chamber, a glowing sphere between them`,
      "She walks forward step by step, red light sweeping across her, camera tracks beside her"],

    // Sahne 2 — Vael'in acısı (0:20–0:45)
    [2, 10, false,
      `Close-up of ${VAEL}, his calm face cracking with old grief, red light`,
      "His jaw tightens, his eyes glisten, he looks away"],
    [2, 5, false,
      `An empty child's swing moving slowly in a storm of red dust, ${MEMORY_GRADE}`,
      "The empty swing creaks back and forth in the wind"],
    [2, 10, false,
      `${VAEL} standing alone at a tall glass window looking out over an empty frozen city, lonely, red light`,
      "He rests his forehead against the glass, his breath fogs it, slow pull-back"],

    // Sahne 3 — Gerçek (0:45–1:05)
    [3, 10, true,
      `compassionate, sad expression, no smile, standing face to face with ${VAEL} in a glowing glass chamber`,
      "She takes one step closer and speaks softly, the light sphere pulses behind her"],
    [3, 10, false,
      `${VAEL} closing his eyes, a single tear running down his cheek, glowing light behind him`,
      "A tear runs down, he opens his eyes and his expression hardens"],

    // Sahne 4 — Saldırı (1:05–1:35)
    [4, 10, false,
      `${VAEL} raising both hands as cold white threads of light lash out from the sphere`,
      "White threads whip out from the sphere toward the camera like ribbons"],
    [4, 10, true,
      "fierce, straining expression, white threads of light wrapping around her arms, she pulls against them",
      "The threads tighten around her, she strains and leans back against them"],
    [4, 10, false,
      `${PUSULA} flying in front of a young woman and spreading into a turquoise shield as white light hits it`,
      "The orb expands into a glowing shield, white light crashes against it"],

    // Sahne 5 — Pusula çatlıyor (1:35–1:50)
    [5, 10, false,
      `A glowing turquoise shield cracking under white light, sparks bursting off the cracks`,
      "Cracks spread across the shield, sparks fly, it shudders"],
    [5, 5, true,
      "anguished expression, reaching toward a cracking turquoise shield",
      "She reaches out as the shield cracks further"],

    // Sahne 6 — Ters akış (1:50–2:15)
    [6, 10, true,
      `resolved expression, eyes closed, plunging both glowing palms into ${CORE}`,
      "Her hands sink into the sphere, blue light floods into it from her palms"],
    [6, 10, false,
      "Rivers of warm memory light inside a hollow glass tower suddenly reversing and pouring downward",
      "The light rivers stop, then reverse and rush downward in a waterfall of light"],
    [6, 5, false,
      `${VAEL} staggering back as blue light floods the chamber`,
      "He shields his face and stumbles backward"],

    // Sahne 7 — Vael'in anısı (2:15–2:40)
    [7, 10, false,
      `A man pushing a little girl on a swing in a green garden, seen from behind, both laughing, ${MEMORY_GRADE}`,
      "The swing goes up and down, the little girl kicks her legs happily"],
    [7, 10, false,
      `${VAEL} on his knees in a glowing glass chamber, crying openly, light flowing into him`,
      "He sinks to his knees, his shoulders shake, warm light wraps around him"],
    [7, 5, false,
      "Warm golden light bursting out of every window of a tall glass spire into the night over a frozen city",
      "Light explodes out of the windows and spreads across the city"],

    // Sahne 8 — Sessizlik (2:40–3:00)
    [8, 10, true,
      "eyes closing, collapsing slowly to the glass floor, the blue mark on her palm fading, warm light around her",
      "She sinks down slowly to the floor, the glow on her palm flickers and goes out"],
    [8, 10, false,
      "A dim cracked small turquoise orb of light hovering over a young woman lying still on a glass floor, golden light dying away",
      "The orb drops lower and pulses weakly, the light around them fades, slow pull-back to darkness"],
  ],

  lines: [
    { scene: 1, speaker: "vael", at: 3, tag: "calm", text: t(
      "Artık her şeyi hatırlıyorsun. O zaman neden burada olduğumu da biliyorsun.",
      "You remember everything now. Then you know why I'm here.",
      "Jetzt erinnerst du dich an alles. Dann weißt du auch, warum ich hier bin.",
      "Tu te souviens de tout maintenant. Alors tu sais pourquoi je suis là.",
      "Ahora lo recuerdas todo. Entonces sabes por qué estoy aquí.",
      "Agora você lembra de tudo. Então sabe por que eu estou aqui.",
      "أنتِ تتذكرين كل شيء الآن. إذن تعرفين لماذا أنا هنا.",
      "अब तुम्हें सब याद है। तो तुम जानती हो कि मैं यहाँ क्यों हूँ।") },
    { scene: 1, speaker: "ayshe", at: 13, tag: "firm", text: t(
      "Durdur bunu, Vael. Elyra ölüyor.",
      "Stop this, Vael. Elyra is dying.",
      "Hör auf damit, Vael. Elyra stirbt.",
      "Arrête ça, Vael. Elyra est en train de mourir.",
      "Detén esto, Vael. Elyra se está muriendo.",
      "Para com isso, Vael. Elyra está morrendo.",
      "أوقف هذا يا فايل. إليرا تموت.",
      "इसे रोको, वेल। एलीरा मर रही है।") },
    { scene: 2, speaker: "vael", at: 22, tag: "grieving", text: t(
      "Kızım Lina... Son kapsüle yetişemedi. Onu kırmızı tozun içinde bıraktım.",
      "My daughter, Lina... She didn't make it to the last capsule. I left her in the red dust.",
      "Meine Tochter Lina... Sie hat die letzte Kapsel nicht erreicht. Ich habe sie im roten Staub zurückgelassen.",
      "Ma fille, Lina... Elle n'a pas pu atteindre la dernière capsule. Je l'ai laissée dans la poussière rouge.",
      "Mi hija, Lina... No llegó a la última cápsula. La dejé en el polvo rojo.",
      "Minha filha, Lina... Ela não chegou à última cápsula. Eu a deixei na poeira vermelha.",
      "ابنتي لينا... لم تلحق بالكبسولة الأخيرة. تركتها في الغبار الأحمر.",
      "मेरी बेटी लीना... वह आख़िरी कैप्सूल तक नहीं पहुँच पाई। मैंने उसे लाल धूल में छोड़ दिया।") },
    { scene: 2, speaker: "vael", at: 36, tag: "bitter", text: t(
      "Kırk yıl burada tek başıma uyandım. Kimse bu kadar acı çekmemeli.",
      "I woke here alone for forty years. No one should ever hurt like that.",
      "Vierzig Jahre war ich hier allein wach. Niemand sollte jemals so leiden.",
      "Pendant quarante ans, j'ai été seul éveillé ici. Personne ne devrait souffrir ainsi.",
      "Durante cuarenta años estuve despierto aquí solo. Nadie debería sufrir así.",
      "Por quarenta anos eu fiquei acordado aqui sozinho. Ninguém devia sofrer assim.",
      "أربعون عامًا وأنا مستيقظ هنا وحدي. لا ينبغي لأحد أن يتألم هكذا.",
      "चालीस साल मैं यहाँ अकेला जागता रहा। किसी को भी ऐसा दर्द नहीं सहना चाहिए।") },
    { scene: 3, speaker: "ayshe", at: 47, tag: "gently", text: t(
      "Ama kendi acını hiç silmedin, değil mi? Herkesi korudun. Kendini değil.",
      "But you never erased your own pain, did you? You protected everyone. Except yourself.",
      "Aber deinen eigenen Schmerz hast du nie gelöscht, oder? Du hast alle beschützt. Nur dich nicht.",
      "Mais tu n'as jamais effacé ta propre douleur, n'est-ce pas ? Tu as protégé tout le monde. Sauf toi.",
      "Pero nunca borraste tu propio dolor, ¿verdad? Protegiste a todos. Menos a ti.",
      "Mas você nunca apagou a sua própria dor, né? Protegeu todo mundo. Menos você.",
      "لكنك لم تمحُ ألمك أنت أبدًا، صحيح؟ حميتَ الجميع. إلا نفسك.",
      "पर तुमने अपना दर्द कभी नहीं मिटाया, है न? तुमने सबको बचाया। ख़ुद को छोड़कर।") },
    { scene: 3, speaker: "vael", at: 58, tag: "breaking", text: t(
      "Onu unutursam, Lina gerçekten ölür.",
      "If I forget her, Lina truly dies.",
      "Wenn ich sie vergesse, stirbt Lina wirklich.",
      "Si je l'oublie, Lina meurt vraiment.",
      "Si la olvido, Lina muere de verdad.",
      "Se eu esquecer, a Lina morre de verdade.",
      "إن نسيتها، ستموت لينا حقًا.",
      "अगर मैं उसे भूल गया, तो लीना सच में मर जाएगी।") },
    { scene: 4, speaker: "vael", at: 67, tag: "shouts", text: t(
      "Ama onlar unutmalı! Sen de unutmalısın!",
      "But they must forget! And so must you!",
      "Aber sie müssen vergessen! Und du auch!",
      "Mais eux doivent oublier ! Et toi aussi !",
      "¡Pero ellos deben olvidar! ¡Y tú también!",
      "Mas eles precisam esquecer! E você também!",
      "لكن عليهم أن ينسوا! وأنتِ أيضًا!",
      "पर उन्हें भूलना होगा! और तुम्हें भी!") },
    { scene: 4, speaker: "pusula", at: 86, tag: "shouts", text: t(
      "Ona dokunamazsın!",
      "You can't touch her!",
      "Du wirst sie nicht anrühren!",
      "Tu ne la toucheras pas !",
      "¡No la tocarás!",
      "Você não vai tocar nela!",
      "لن تلمسها!",
      "तुम उसे छू नहीं सकते!") },
    { scene: 5, speaker: "ayshe", at: 104, tag: "screams", text: t(
      "Pusula, bırak! Kırılacaksın!",
      "Compass, stop! You'll break!",
      "Kompass, hör auf! Du zerbrichst!",
      "Boussole, arrête ! Tu vas te briser !",
      "¡Brújula, para! ¡Te vas a romper!",
      "Bússola, para! Você vai quebrar!",
      "يا بوصلة، توقفي! ستنكسرين!",
      "कंपास, रुको! तुम टूट जाओगी!") },
    { scene: 6, speaker: "ayshe", at: 112, tag: "determined", text: t(
      "Acıyı almak istiyorsan, al. Ama sevgiyi de birlikte al!",
      "If you want the pain, take it. But take the love with it!",
      "Wenn du den Schmerz willst, nimm ihn. Aber nimm die Liebe mit!",
      "Si tu veux la douleur, prends-la. Mais prends l'amour avec !",
      "Si quieres el dolor, tómalo. ¡Pero toma también el amor!",
      "Se você quer a dor, leva. Mas leva o amor junto!",
      "إن كنت تريد الألم، فخذه. لكن خذ معه الحب!",
      "अगर तुम्हें दर्द चाहिए, तो लो। पर उसके साथ प्यार भी लो!") },
    { scene: 6, speaker: "narrator", at: 124, text: t(
      "Ve ilk kez, Kule'nin nehirleri ters aktı.",
      "And for the first time, the Tower's rivers flowed backward.",
      "Und zum ersten Mal flossen die Ströme des Turms rückwärts.",
      "Et pour la première fois, les rivières de la Tour coulèrent à l'envers.",
      "Y por primera vez, los ríos de la Torre fluyeron al revés.",
      "E pela primeira vez, os rios da Torre correram ao contrário.",
      "ولأول مرة، جرت أنهار البرج بالعكس.",
      "और पहली बार, टावर की नदियाँ उलटी बहीं।") },
    { scene: 7, speaker: "vael", at: 147, tag: "crying", text: t(
      "Lina... salıncak... Gülüyordu. Gülüşünü unutmuşum...",
      "Lina... the swing... She was laughing. I had forgotten her laugh...",
      "Lina... die Schaukel... Sie hat gelacht. Ich hatte ihr Lachen vergessen...",
      "Lina... la balançoire... Elle riait. J'avais oublié son rire...",
      "Lina... el columpio... Se reía. Había olvidado su risa...",
      "Lina... o balanço... Ela estava rindo. Eu tinha esquecido a risada dela...",
      "لينا... الأرجوحة... كانت تضحك. لقد نسيتُ ضحكتها...",
      "लीना... झूला... वह हँस रही थी। मैं उसकी हँसी भूल गया था...") },
    { scene: 8, speaker: "pusula", at: 164, tag: "frightened", text: t(
      "AyShe? AyShe, gözlerini aç. Lütfen...",
      "AyShe? AyShe, open your eyes. Please...",
      "AyShe? AyShe, mach die Augen auf. Bitte...",
      "AyShe ? AyShe, ouvre les yeux. S'il te plaît...",
      "¿AyShe? AyShe, abre los ojos. Por favor...",
      "AyShe? AyShe, abre os olhos. Por favor...",
      "AyShe؟ AyShe، افتحي عينيكِ. أرجوكِ...",
      "AyShe? AyShe, आँखें खोलो। प्लीज़...") },
    { scene: 8, speaker: "pusula", at: 173, tag: "whispers", text: t(
      "AyShe...",
      "AyShe...",
      "AyShe...",
      "AyShe...",
      "AyShe...",
      "AyShe...",
      "AyShe...",
      "AyShe...") },
  ],
  next: { n: 15, title: t("Yeniden Doğuş", "Rebirth", "Wiedergeburt", "Renaissance", "Renacer", "Renascimento", "الولادة من جديد", "पुनर्जन्म") },
});
