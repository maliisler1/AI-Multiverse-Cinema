/**
 * Neo-Genesis: 2300 — Bölüm 12 "Kulenin Gölgesi" (180 sn).
 * Ayşe ve Mera gece, Mera'nın sarmaşıklarıyla Sessizlik Kulesi'nin dış duvarına tırmanır.
 * İçeride yukarı akan anı nehirleri vardır. Nil'i kristal bir kozadan, Pusula'yı cam kafesten kurtarırlar.
 * Son: Kule sarsılır, iki güneş birleşmek üzeredir; bir Silgi başlığını indirir: Rün.
 */
import { ASTER_GRADE, MERA, NIL, PUSULA, RUN, SILGI, VAEL, episode, t } from "./neo-genesis-cast.ts";

const RUN_SILGI =
  "a young man of about twenty with short messy dark-blond hair and a small scar on his left eyebrow, wearing a long hooded white coat, empty pale stare";

export const neoGenesisE12 = episode({
  episode: 12,
  title: t("Kulenin Gölgesi", "Shadow of the Tower", "Im Schatten des Turms", "L'Ombre de la Tour", "La sombra de la Torre", "A sombra da Torre", "ظل البرج", "टावर की छाया"),
  clips: [
    // Sahne 1 — Sarmaşık merdiven (0:00–0:20)
    [1, 10, false,
      `${MERA} pressing her palms against the base of a towering ice-glass spire at night, thick green vines bursting upward along its wall, ${ASTER_GRADE}`,
      "Vines shoot up the glass wall fast, camera tilts up following them into the night sky"],
    [1, 10, true,
      `determined expression, gripping a thick green vine and starting to climb the outside of a glass spire at night, ${ASTER_GRADE}`,
      "She pulls herself up hand over hand, wind tugs at her hair, camera rises with her"],

    // Sahne 2 — Rüzgâr (0:20–0:45)
    [2, 10, false,
      `${MERA} climbing a vine high on the side of a glass tower in strong wind at night, a frozen city far below`,
      "She climbs steadily, the vine sways in the wind, camera drifts outward to show the height"],
    [2, 5, false,
      `${MERA}'s foot slipping off a vine high on a glass tower at night, snow blowing`,
      "Her foot slips, she drops a little and swings on one hand"],
    [2, 10, true,
      `straining expression, hanging from a vine on a glass tower at night and catching the wrist of ${MERA} below her`,
      "She grabs the wrist and pulls her up, both swaying in the wind"],

    // Sahne 3 — Kulenin içi (0:45–1:05)
    [3, 10, true,
      `awestruck, serious expression, no smile, climbing in through a narrow glass vent into a vast hollow tower, ${ASTER_GRADE}`,
      "She squeezes through the vent and freezes, light washes over her face"],
    [3, 10, false,
      "The vast hollow inside of a glass tower, countless glowing rivers of warm memory light flowing upward through the center into darkness",
      "Slow upward crane through the rivers of light, they swirl and rise endlessly"],

    // Sahne 4 — Cam köprü (1:05–1:35)
    [4, 10, true,
      `careful expression, walking along a narrow glass bridge across a hollow tower, ${MERA} behind her, rivers of light rising below`,
      "They walk carefully along the bridge toward the camera, light streams upward on both sides"],
    [4, 10, false,
      `A ${SILGI} walking along a glass walkway on the far side of a hollow tower`,
      "It walks steadily and slowly turns its head toward the camera"],
    [4, 10, true,
      `holding her breath, crouching low on a glass bridge beside ${MERA}, hidden in the glow of a river of light`,
      "They duck into the bright glow, the light hides them, she slowly exhales"],

    // Sahne 5 — Koza (1:35–1:50)
    [5, 10, false,
      `${NIL} asleep inside a clear crystal cocoon in a glass chamber, a faint thread of light starting to rise from her forehead`,
      "The thread of light begins to lift slowly, the cocoon glows softly"],
    [5, 5, true,
      "horrified expression, rushing forward toward a crystal cocoon in a glass chamber",
      "She runs forward and slams her palms against the crystal"],

    // Sahne 6 — Nil uyanıyor (1:50–2:15)
    [6, 10, true,
      "fierce expression, both glowing palms on a crystal cocoon, cracks of blue light racing across it",
      "Blue cracks race across the crystal and it bursts apart in glittering shards"],
    [6, 10, false,
      `${NIL} waking up in a pile of crystal shards and looking up, recognizing someone, glass chamber`,
      "She blinks, focuses, and her face lights up with recognition"],
    [6, 5, true,
      `relieved, emotional expression, catching ${NIL} in a tight hug in a glass chamber`,
      "The girl jumps into her arms, she holds her tightly"],

    // Sahne 7 — Pusula (2:15–2:40)
    [7, 10, false,
      `${PUSULA} trapped inside a small glass cage on a pedestal, ${MERA} reaching toward it as thin green roots creep into the glass`,
      "Thin roots crawl into the glass and crack it apart"],
    [7, 10, false,
      `${PUSULA} bursting free from a shattered glass cage and zooming around a chamber`,
      "The orb shoots out of the cage and loops around the chamber in a happy streak of light"],
    [7, 5, true,
      "laughing through relief, a closed-lip smile, no teeth, as a glowing orb nuzzles against her cheek",
      "The orb bumps gently against her cheek, she closes her eyes"],

    // Sahne 8 — Rün (2:40–3:00)
    [8, 10, false,
      `${VAEL}'s calm face reflected huge across the curved glass walls of a tower while the floor trembles, ${ASTER_GRADE}`,
      "The glass walls shake, the reflection speaks calmly, dust falls from above"],
    [8, 10, false,
      `${RUN_SILGI} lowering his white hood in a glass chamber, ${ASTER_GRADE}`,
      "He pulls the hood down slowly and stares blankly ahead, slow push-in to his empty eyes, cut to black"],
  ],

  lines: [
    { scene: 1, speaker: "narrator", at: 3, text: t(
      "Sessizlik Kulesi. Bugüne kadar kimse içine girip anılarıyla geri çıkmadı.",
      "The Tower of Silence. No one has ever gone in and come out with their memories.",
      "Der Turm der Stille. Niemand ist je hineingegangen und mit seinen Erinnerungen herausgekommen.",
      "La Tour du Silence. Personne n'y est jamais entré pour en ressortir avec ses souvenirs.",
      "La Torre del Silencio. Nadie ha entrado jamás y ha salido con sus recuerdos.",
      "A Torre do Silêncio. Ninguém jamais entrou e saiu com suas lembranças.",
      "برج الصمت. لم يدخله أحد من قبل وخرج بذكرياته.",
      "ख़ामोशी का टावर। आज तक कोई अंदर जाकर अपनी यादों के साथ बाहर नहीं आया।") },
    { scene: 1, speaker: "mera", at: 13, tag: "whispers", text: t(
      "Sarmaşıklar yukarıya kadar dayanır. Biz dayanabilir miyiz, o başka.",
      "The vines will hold all the way up. Whether we can hold on is another story.",
      "Die Ranken halten bis ganz oben. Ob wir durchhalten, ist eine andere Frage.",
      "Les lianes tiendront jusqu'en haut. Que nous tenions, c'est une autre histoire.",
      "Las enredaderas aguantarán hasta arriba. Si aguantamos nosotras, es otra historia.",
      "As trepadeiras aguentam até o topo. Se a gente aguenta, é outra história.",
      "النباتات ستصمد حتى القمة. أما إن كنا سنصمد نحن، فتلك قصة أخرى.",
      "बेलें ऊपर तक टिकी रहेंगी। हम टिक पाएँगे या नहीं, ये अलग बात है।") },
    { scene: 2, speaker: "mera", at: 36, tag: "gasps", text: t(
      "Ayşe!",
      "Ayşe!",
      "Ayşe!",
      "Ayşe !",
      "¡Ayşe!",
      "Ayşe!",
      "آيشه!",
      "आयशे!") },
    { scene: 2, speaker: "ayshe", at: 39, tag: "strained", text: t(
      "Tuttum seni! Aşağı bakma!",
      "I've got you! Don't look down!",
      "Ich hab dich! Schau nicht nach unten!",
      "Je te tiens ! Ne regarde pas en bas !",
      "¡Te tengo! ¡No mires abajo!",
      "Te peguei! Não olha pra baixo!",
      "أمسكتُ بكِ! لا تنظري إلى الأسفل!",
      "पकड़ लिया! नीचे मत देखना!") },
    { scene: 3, speaker: "ayshe", at: 52, tag: "whispers, awed", text: t(
      "Bunların hepsi... birilerinin anıları.",
      "All of this... is someone's memories.",
      "Das alles... sind die Erinnerungen von Menschen.",
      "Tout ça... ce sont les souvenirs de quelqu'un.",
      "Todo esto... son los recuerdos de alguien.",
      "Tudo isso... são lembranças de alguém.",
      "كل هذا... ذكريات أناس.",
      "ये सब... किसी न किसी की यादें हैं।") },
    { scene: 4, speaker: "mera", at: 87, tag: "whispers", text: t(
      "Işığın içine gir. Bizi göremezler.",
      "Get into the light. They can't see us there.",
      "Geh ins Licht. Dort können sie uns nicht sehen.",
      "Entre dans la lumière. Ils ne peuvent pas nous voir.",
      "Métete en la luz. Ahí no pueden vernos.",
      "Entra na luz. Eles não conseguem ver a gente lá.",
      "ادخلي في الضوء. لن يرونا هناك.",
      "रोशनी में आ जाओ। वहाँ वे हमें नहीं देख सकते।") },
    { scene: 5, speaker: "ayshe", at: 104, tag: "frantic", text: t(
      "Nil'i siliyorlar! Dayan, Nil!",
      "They're erasing Nil! Hold on, Nil!",
      "Sie löschen Nil! Halte durch, Nil!",
      "Ils effacent Nil ! Tiens bon, Nil !",
      "¡Están borrando a Nil! ¡Aguanta, Nil!",
      "Estão apagando a Nil! Aguenta, Nil!",
      "إنهم يمحون نيل! اصمدي يا نيل!",
      "वे नील को मिटा रहे हैं! टिकी रहो, नील!") },
    { scene: 6, speaker: "nil", at: 122, tag: "joyful", text: t(
      "Ayşe! Seni unutmadım! Şarkıyı tuttum, hiç bırakmadım!",
      "Ayşe! I didn't forget you! I held on to the song, I never let go!",
      "Ayşe! Ich habe dich nicht vergessen! Ich habe das Lied festgehalten!",
      "Ayşe ! Je ne t'ai pas oubliée ! J'ai gardé la chanson, je ne l'ai jamais lâchée !",
      "¡Ayşe! ¡No te olvidé! ¡Me aferré a la canción, nunca la solté!",
      "Ayşe! Eu não te esqueci! Segurei a música, nunca soltei!",
      "آيشه! لم أنسكِ! تمسّكتُ بالأغنية ولم أتركها أبدًا!",
      "आयशे! मैं तुम्हें नहीं भूली! मैंने गीत को पकड़े रखा, कभी नहीं छोड़ा!") },
    { scene: 7, speaker: "pusula", at: 146, tag: "playful", text: t(
      "Geç kaldınız! Bu kafeste ne kadar sıkıldım, biliyor musunuz?",
      "You're late! Do you know how bored I was in that cage?",
      "Ihr seid spät dran! Wisst ihr, wie langweilig es in diesem Käfig war?",
      "Vous êtes en retard ! Vous savez à quel point je me suis ennuyée dans cette cage ?",
      "¡Llegáis tarde! ¿Sabéis lo aburrida que estaba en esa jaula?",
      "Vocês demoraram! Sabem o quanto eu fiquei entediada nessa gaiola?",
      "تأخرتم! هل تعرفون كم شعرتُ بالملل في هذا القفص؟",
      "बहुत देर कर दी! पता है उस पिंजरे में मैं कितनी बोर हुई?") },
    { scene: 7, speaker: "ayshe", at: 155, tag: "laughing softly", text: t(
      "Ben de seni özledim.",
      "I missed you too.",
      "Ich hab dich auch vermisst.",
      "Tu m'as manqué aussi.",
      "Yo también te eché de menos.",
      "Eu também senti sua falta.",
      "وأنا أيضًا اشتقتُ إليكِ.",
      "मुझे भी तुम्हारी याद आई।") },
    { scene: 8, speaker: "vael", at: 162, tag: "calm", text: t(
      "İki güneş birleşmek üzere, Ayşe. Bir saat sonra Elyra'da hiçbir anı kalmayacak.",
      "The two suns are about to meet, Ayşe. In one hour, there will be no memories left on Elyra.",
      "Die zwei Sonnen treffen sich gleich, Ayşe. In einer Stunde wird es auf Elyra keine Erinnerungen mehr geben.",
      "Les deux soleils vont se rejoindre, Ayşe. Dans une heure, il ne restera plus aucun souvenir sur Elyra.",
      "Los dos soles están a punto de unirse, Ayşe. En una hora no quedará ningún recuerdo en Elyra.",
      "Os dois sóis estão prestes a se encontrar, Ayşe. Em uma hora, não vai restar nenhuma lembrança em Elyra.",
      "الشمسان على وشك أن تلتقيا يا آيشه. بعد ساعة لن تبقى أي ذكرى على إليرا.",
      "दोनों सूरज मिलने वाले हैं, आयशे। एक घंटे बाद एलीरा पर कोई याद नहीं बचेगी।") },
    { scene: 8, speaker: "ayshe", at: 173, tag: "shocked whisper", text: t(
      "Rün...?",
      "Rün...?",
      "Rün...?",
      "Rün... ?",
      "¿Rün...?",
      "Rün...?",
      "رون...؟",
      "रून...?") },
  ],
  next: { n: 13, title: t("Son Geri Sayım", "Final Countdown", "Letzter Countdown", "Compte à rebours final", "Cuenta atrás final", "Contagem regressiva final", "العد التنازلي الأخير", "आख़िरी उलटी गिनती") },
});
