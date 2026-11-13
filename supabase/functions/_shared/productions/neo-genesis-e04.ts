/**
 * Neo-Genesis: 2300 — Bölüm 4 "Kristal Göç" (180 sn).
 * Kristal orman bir dalga gibi yer değiştirir; Ayşe, Rün ve baygın Mera kristal seline kapılmamak
 * için kaçar. Havada süzülen ışık canlıları Süzüler onları güvenli bir sırta taşır.
 * Rün eve dönmek ister, Ayşe kalmak. Mera, Vael'in adını söyler.
 * Son: Mera'nın gözleri yeniden boşalır ve kendi kendine kuzeye yürür.
 */
import { MERA, PUSULA, RUN, episode, t } from "./neo-genesis-cast.ts";

const SUZU = "translucent floating jellyfish-like creatures glowing soft pink and turquoise, drifting in the air";

export const neoGenesisE4 = episode({
  episode: 4,
  title: t("Kristal Göç", "Crystal Migration", "Kristallwanderung", "La Migration de cristal", "Migración de cristal", "Migração de cristal", "هجرة البلّور", "क्रिस्टल प्रवास"),
  clips: [
    // Sahne 1 — Sabah (0:00–0:20)
    [1, 10, false,
      `${MERA} asleep against a glowing crystal tree at dawn on a wide plain, a blanket over her`,
      "Morning light slowly spreads across her, the crystals around her start to hum and glow, slow push-in"],
    [1, 10, true,
      `watchful expression, sitting on a rock at dawn, ${RUN} pacing angrily in front of her, crystal plain behind`,
      "He paces back and forth gesturing, she follows him with her eyes, camera holds steady"],

    // Sahne 2 — Toprak titriyor (0:20–0:45)
    [2, 10, false,
      "Close-up of small crystals on the ground vibrating and rising slightly, dust jumping",
      "The crystals tremble harder and harder, dust leaps up, camera slowly lowers to the ground"],
    [2, 5, true,
      "startled expression, jumping up from a rock and looking toward the horizon, dawn wind",
      "She springs to her feet and turns toward the horizon, hair whipping in the wind"],
    [2, 10, false,
      "A whole forest of tall glowing crystals sliding across a plain like a giant shining wave, dust clouds rising",
      "Wide aerial shot, the crystal wave rushes forward across the plain toward the camera"],

    // Sahne 3 — Kaçış (0:45–1:05)
    [3, 10, true,
      `running hard across a crystal plain, half carrying the unconscious ${MERA} with her arm over her shoulder, ${RUN} on the other side`,
      "They run toward the camera, tracking backward, shining crystals surge behind them"],
    [3, 10, false,
      "Sharp crystal shards racing along the ground past the camera like a stampede, sparkling dust",
      "Low camera at ground level as glittering shards rush past on both sides"],

    // Sahne 4 — Süzüler (1:05–1:35)
    [4, 10, false,
      `${SUZU}, dozens rising from behind a rocky ridge in morning light`,
      "The glowing creatures rise slowly into the air, tentacles trailing light, camera tilts up"],
    [4, 10, true,
      `amazed expression, lips parted, no smile, as ${SUZU} surround her and gently lift her off the ground`,
      "The creatures wrap soft light around her, she rises slowly off her feet"],
    [4, 10, false,
      `${RUN} carried up into the air by ${SUZU}, holding on, a crystal wave rushing below`,
      "He rises upward with the creatures, the crystals flood the ground below, camera follows up"],

    // Sahne 5 — Sırtta (1:35–1:50)
    [5, 10, true,
      "breathless, awestruck expression, standing on a high rocky ridge looking down at a glowing crystal forest flowing across the valley",
      "Slow pan from her face to the valley, the crystal river flows and sparkles"],
    [5, 5, false,
      `${SUZU} drifting away into a golden morning sky`,
      "The creatures float slowly away and fade into the light"],

    // Sahne 6 — Tartışma (1:50–2:15)
    [6, 10, false,
      `${RUN} standing on a windy ridge, frustrated, pointing up at the sky`,
      "He turns and points to the sky, wind tugs at his jumpsuit, slow push-in"],
    [6, 10, true,
      "firm, serious expression, no smile, facing someone on a windy ridge, arms crossed",
      "She steps forward and answers firmly, wind moves her hair, camera holds on her face"],
    [6, 5, false,
      `${PUSULA} floating between two people on a ridge, its light dimming sadly`,
      "The orb drifts slowly between them and dims"],

    // Sahne 7 — Mera konuşuyor (2:15–2:40)
    [7, 10, false,
      `${MERA} lying on the ridge and slowly opening her eyes, focused and clear for a moment, morning light`,
      "Her eyes open and focus, she grips the rock and slowly lifts her head"],
    [7, 10, true,
      `attentive expression, kneeling beside ${MERA} on a ridge, holding her hand`,
      "She leans closer to listen, camera slowly circles around the two of them"],
    [7, 5, false,
      `Close-up of ${MERA}'s face, fear in her eyes, morning light`,
      "Her eyes widen with fear as she speaks"],

    // Sahne 8 — Kuzeye çağrı (2:40–3:00)
    [8, 10, false,
      `${MERA} standing up with empty eyes and walking away north along a ridge, a cold white glow on the horizon`,
      "She walks steadily away from the camera like a sleepwalker, wind blows dust past her"],
    [8, 10, true,
      "alarmed expression, standing on a ridge and reaching out a hand toward someone walking away, cold glow far in the north",
      "She takes a step forward and reaches out, camera pulls back to reveal the vast northern horizon, fade to dark"],
  ],

  lines: [
    { scene: 1, speaker: "narrator", at: 3, text: t(
      "Elyra'da hiçbir şey yerinde durmaz. Ormanlar bile.",
      "Nothing on Elyra stays in one place. Not even the forests.",
      "Nichts auf Elyra bleibt an seinem Platz. Nicht einmal die Wälder.",
      "Rien sur Elyra ne reste en place. Pas même les forêts.",
      "En Elyra nada se queda en su sitio. Ni siquiera los bosques.",
      "Nada em Elyra fica no lugar. Nem mesmo as florestas.",
      "لا شيء على إليرا يبقى في مكانه. ولا حتى الغابات.",
      "एलीरा पर कुछ भी अपनी जगह नहीं रहता। जंगल भी नहीं।") },
    { scene: 1, speaker: "run", at: 12, tag: "frustrated", text: t(
      "Bir gemi yapabilirim, Ayşe. Bana zaman ver, eve döneriz.",
      "I can build a ship, Ayşe. Give me time and we can go home.",
      "Ich kann ein Schiff bauen, Ayşe. Gib mir Zeit, und wir fliegen nach Hause.",
      "Je peux construire un vaisseau, Ayşe. Donne-moi du temps et on rentre.",
      "Puedo construir una nave, Ayşe. Dame tiempo y volvemos a casa.",
      "Eu consigo construir uma nave, Ayşe. Me dá tempo e a gente volta pra casa.",
      "أستطيع بناء سفينة يا آيشه. أعطيني وقتًا ونعود إلى البيت.",
      "मैं एक जहाज़ बना सकता हूँ, आयशे। मुझे वक़्त दो, हम घर लौट जाएँगे।") },
    { scene: 2, speaker: "pusula", at: 23, tag: "alarmed", text: t(
      "Bu bir deprem değil. Orman... yürüyor.",
      "This isn't an earthquake. The forest is... moving.",
      "Das ist kein Erdbeben. Der Wald... wandert.",
      "Ce n'est pas un séisme. La forêt... se déplace.",
      "No es un terremoto. El bosque... se está moviendo.",
      "Isso não é um terremoto. A floresta... está andando.",
      "هذا ليس زلزالًا. الغابة... تتحرك.",
      "ये भूकंप नहीं है। जंगल... चल रहा है।") },
    { scene: 2, speaker: "ayshe", at: 38, tag: "shouts", text: t(
      "Mera'yı al! Koş!",
      "Grab Mera! Run!",
      "Nimm Mera! Lauf!",
      "Prends Mera ! Cours !",
      "¡Coge a Mera! ¡Corre!",
      "Pega a Mera! Corre!",
      "خذ ميرا! اركض!",
      "मेरा को उठाओ! भागो!") },
    { scene: 3, speaker: "run", at: 55, tag: "breathless", text: t(
      "Bize yetişiyor! Gidecek yer kalmadı!",
      "It's catching up! There's nowhere left to go!",
      "Es holt uns ein! Wir können nirgendwo mehr hin!",
      "Ça nous rattrape ! On n'a plus nulle part où aller !",
      "¡Nos está alcanzando! ¡No queda adónde ir!",
      "Está nos alcançando! Não tem mais pra onde ir!",
      "إنها تلحق بنا! لم يعد هناك مكان نذهب إليه!",
      "ये हमें पकड़ रहा है! कहीं जाने की जगह नहीं बची!") },
    { scene: 4, speaker: "pusula", at: 69, tag: "excited", text: t(
      "Süzüler! Kıpırdamayın, sizi taşıyacaklar!",
      "The Drifters! Don't move, they'll carry you!",
      "Die Schwebenden! Nicht bewegen, sie tragen euch!",
      "Les Flotteurs ! Ne bougez pas, ils vont vous porter !",
      "¡Los Flotantes! ¡No os mováis, os llevarán!",
      "Os Flutuantes! Não se mexam, eles vão carregar vocês!",
      "العائمون! لا تتحركا، سيحملانكما!",
      "तैरने वाले! हिलना मत, वे तुम्हें उठा लेंगे!") },
    { scene: 4, speaker: "ayshe", at: 80, tag: "laughs softly", text: t(
      "Uçuyorum... Gerçekten uçuyorum!",
      "I'm flying... I'm really flying!",
      "Ich fliege... Ich fliege wirklich!",
      "Je vole... Je vole vraiment !",
      "Estoy volando... ¡De verdad estoy volando!",
      "Eu tô voando... Tô voando de verdade!",
      "أنا أطير... أنا أطير حقًا!",
      "मैं उड़ रही हूँ... सच में उड़ रही हूँ!") },
    { scene: 5, speaker: "ayshe", at: 98, tag: "awestruck", text: t(
      "Göç ediyorlar. Tıpkı kuşlar gibi.",
      "They're migrating. Just like birds.",
      "Sie wandern. Genau wie Vögel.",
      "Ils migrent. Comme des oiseaux.",
      "Están migrando. Igual que los pájaros.",
      "Eles estão migrando. Igual aos pássaros.",
      "إنها تهاجر. تمامًا مثل الطيور.",
      "ये प्रवास कर रहे हैं। बिल्कुल पक्षियों की तरह।") },
    { scene: 6, speaker: "run", at: 112, tag: "angry", text: t(
      "Burası bizim yerimiz değil! Dünya bir yerlerde hâlâ bekliyor olabilir!",
      "This isn't our place! Earth might still be out there, waiting!",
      "Das ist nicht unser Ort! Die Erde wartet vielleicht noch irgendwo!",
      "Ce n'est pas chez nous ! La Terre attend peut-être encore quelque part !",
      "¡Este no es nuestro sitio! ¡La Tierra aún podría estar esperando en algún lugar!",
      "Aqui não é o nosso lugar! A Terra ainda pode estar esperando em algum lugar!",
      "هذا ليس مكاننا! ربما ما زالت الأرض تنتظر في مكان ما!",
      "ये हमारी जगह नहीं है! धरती शायद अब भी कहीं इंतज़ार कर रही हो!") },
    { scene: 6, speaker: "ayshe", at: 122, tag: "firm", text: t(
      "Burada silinmiş insanlar var, Rün. Onları bırakıp gidemem.",
      "There are people here who've been erased, Rün. I can't leave them behind.",
      "Hier gibt es Menschen, die gelöscht wurden, Rün. Ich kann sie nicht zurücklassen.",
      "Il y a des gens ici qu'on a effacés, Rün. Je ne peux pas les abandonner.",
      "Aquí hay personas a las que han borrado, Rün. No puedo abandonarlas.",
      "Tem gente aqui que foi apagada, Rün. Não posso deixar essas pessoas pra trás.",
      "هناك أناس هنا تم محوهم يا رون. لا أستطيع تركهم.",
      "यहाँ ऐसे लोग हैं जिन्हें मिटा दिया गया है, रून। मैं उन्हें छोड़कर नहीं जा सकती।") },
    { scene: 7, speaker: "mera", at: 137, tag: "weak", text: t(
      "Adı Vael. Birinci kapsül. Kırk yıl önce uyandı... tek başına.",
      "His name is Vael. Capsule one. He woke up forty years ago... alone.",
      "Sein Name ist Vael. Kapsel eins. Er ist vor vierzig Jahren aufgewacht... allein.",
      "Il s'appelle Vael. Capsule un. Il s'est réveillé il y a quarante ans... seul.",
      "Se llama Vael. Cápsula uno. Despertó hace cuarenta años... solo.",
      "O nome dele é Vael. Cápsula um. Ele acordou há quarenta anos... sozinho.",
      "اسمه فايل. الكبسولة الأولى. استيقظ قبل أربعين عامًا... وحده.",
      "उसका नाम वेल है। कैप्सूल एक। वह चालीस साल पहले जागा... अकेला।") },
    { scene: 7, speaker: "ayshe", at: 148, text: t(
      "Neden bunu yapıyor, Mera?",
      "Why is he doing this, Mera?",
      "Warum tut er das, Mera?",
      "Pourquoi fait-il ça, Mera ?",
      "¿Por qué hace esto, Mera?",
      "Por que ele está fazendo isso, Mera?",
      "لماذا يفعل هذا يا ميرا؟",
      "वह ऐसा क्यों कर रहा है, मेरा?") },
    { scene: 7, speaker: "mera", at: 155, tag: "afraid", text: t(
      "Bizi acıdan korumak için.",
      "To protect us from pain.",
      "Um uns vor dem Schmerz zu schützen.",
      "Pour nous protéger de la douleur.",
      "Para protegernos del dolor.",
      "Para nos proteger da dor.",
      "ليحمينا من الألم.",
      "हमें दर्द से बचाने के लिए।") },
    { scene: 8, speaker: "ayshe", at: 168, tag: "shouts", text: t(
      "Mera, dur! Mera!",
      "Mera, stop! Mera!",
      "Mera, bleib stehen! Mera!",
      "Mera, arrête ! Mera !",
      "¡Mera, para! ¡Mera!",
      "Mera, para! Mera!",
      "ميرا، توقفي! ميرا!",
      "मेरा, रुको! मेरा!") },
    { scene: 8, speaker: "pusula", at: 173, tag: "whispers", text: t(
      "Onu çağıran bir şey var. Kuzeyde.",
      "Something is calling her. In the north.",
      "Etwas ruft sie. Im Norden.",
      "Quelque chose l'appelle. Au nord.",
      "Algo la está llamando. En el norte.",
      "Alguma coisa está chamando ela. No norte.",
      "شيء ما يناديها. في الشمال.",
      "कुछ उसे बुला रहा है। उत्तर में।") },
  ],
  next: { n: 5, title: t("Buzul Geçidi", "The Glacier Pass", "Der Gletscherpass", "Le Col du glacier", "El paso del glaciar", "A passagem da geleira", "ممر الجليد", "हिमनद दर्रा") },
});
