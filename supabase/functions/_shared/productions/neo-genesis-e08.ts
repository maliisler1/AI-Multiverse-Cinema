/**
 * Neo-Genesis: 2300 — Bölüm 8 "Kaçış" (180 sn).
 * AyShe, Nil'i kapıp kuleden kaçar; cam koridorlarda Silgilerle kovalamaca. Rün'ü uyandırır ama
 * Rün gelmek istemez ve kalır. Nil'in gizli ışık yelkenlisiyle çatıdan atlarlar; bir Silgi'nin
 * beyaz ışığı Pusula'yı vurur. Son: karda Pusula'nın ışığı AyShe'nin ellerinde söner.
 */
import { ASTER_GRADE, NIL, PUSULA, RUN, SILGI, episode, t } from "./neo-genesis-cast.ts";

const GLIDER = "a sleek glider with wide translucent wings of woven light";

export const neoGenesisE8 = episode({
  episode: 8,
  title: t("Kaçış", "The Escape", "Die Flucht", "L'Évasion", "La huida", "A fuga", "الهروب", "पलायन"),
  clips: [
    // Sahne 1 — Kaç (0:00–0:20)
    [1, 10, true,
      `fierce expression, scooping up ${NIL} by the hand and sprinting out of a glass chamber, cold white light, ${ASTER_GRADE}`,
      "She grabs the girl's hand and bolts toward the camera, camera whips around to follow"],
    [1, 10, false,
      `Two ${SILGI} stepping in to block a glass doorway, a faint turquoise flash bursting in front of their masks`,
      "A turquoise flash explodes, the figures stagger back shielding their masks"],

    // Sahne 2 — Koridorlar (0:20–0:45)
    [2, 10, true,
      `running at full speed down a long glass corridor with ${NIL}, reflections streaking past, ${ASTER_GRADE}`,
      "Fast tracking shot backward as they sprint toward the camera, glass reflections blur"],
    [2, 5, true,
      `sliding down a steep curved glass ramp holding ${NIL} in her arms, ${ASTER_GRADE}`,
      "They slide down fast, camera follows from behind"],
    [2, 10, false,
      `Three ${SILGI} running in formation down a glass corridor, long coats flowing, ${ASTER_GRADE}`,
      "They run toward the camera in silence, coats whipping behind them"],

    // Sahne 3 — Rün (0:45–1:05)
    [3, 10, false,
      `${RUN} jolting awake on a white bed in a dark glass room as the door slides open with light, ${ASTER_GRADE}`,
      "He sits up quickly and shields his eyes from the light pouring through the door"],
    [3, 10, true,
      `urgent expression, standing in a doorway and reaching out a hand toward someone sitting on a bed, ${ASTER_GRADE}`,
      "She holds out her hand insistently, breathing hard, camera pushes in over her shoulder"],

    // Sahne 4 — Çatı (1:05–1:35)
    [4, 10, false,
      `A flat glass rooftop high above a frozen city at dawn, icy wind, ${SILGI} figures emerging from a stairwell`,
      "Wide shot, the figures step out onto the roof one by one, wind howls"],
    [4, 10, false,
      `${NIL} pulling a white cloth off ${GLIDER} hidden on a glass rooftop at dawn`,
      "She yanks the cloth away and the glider's wings unfold and light up"],
    [4, 10, true,
      `determined expression, gripping the handlebar of ${GLIDER} on a rooftop edge, ${NIL} holding on to her back, dawn wind`,
      "She braces her feet, wind blasts her hair back, camera circles to the front"],

    // Sahne 5 — Kalan (1:35–1:50)
    [5, 10, false,
      `${RUN} standing still in a rooftop doorway at dawn, not moving, looking down with a pained face`,
      "He takes one step forward, stops, and slowly shakes his head"],
    [5, 5, true,
      "heartbroken expression, no smile, looking back over her shoulder on a windy rooftop at dawn",
      "Her eyes fill with tears, she turns away"],

    // Sahne 6 — Atlayış (1:50–2:15)
    [6, 10, true,
      `running and leaping off the edge of a glass rooftop with ${GLIDER}, ${NIL} on her back, a frozen city far below`,
      "She sprints and jumps, the wings catch the wind and lift them, camera follows off the edge"],
    [6, 10, false,
      `A ${SILGI} on a rooftop edge firing a beam of cold white light into the sky`,
      "A beam of white light shoots upward from its raised palm"],
    [6, 5, false,
      `${PUSULA} struck by a beam of white light in the air, cracking with sparks`,
      "The light hits the orb, it jerks and sparks fly off it"],

    // Sahne 7 — Uçuş (2:15–2:40)
    [7, 10, false,
      `${GLIDER} soaring over blue glaciers at sunrise, two small figures holding on, two suns rising`,
      "Wide aerial shot following the glider as it banks gracefully over the glaciers"],
    [7, 10, true,
      `focused, tearful expression, steering ${GLIDER} through the sky at sunrise, wind in her long black hair`,
      "She leans into a turn, the wind whips her hair, sunlight flares across her face"],
    [7, 5, false,
      `${NIL} looking back from a glider at a shrinking frozen city on the horizon`,
      "She looks back over her shoulder as the city shrinks away"],

    // Sahne 8 — Pusula sönüyor (2:40–3:00)
    [8, 10, false,
      "A glider skidding to a stop in deep snow on a quiet hillside, snow spraying up, morning light",
      "The glider lands hard and slides, a wave of snow sprays toward the camera"],
    [8, 10, true,
      "desperate expression, kneeling in the snow cupping a cracked orb whose turquoise light is fading in her hands",
      "The light flickers weaker and weaker and goes out, she clutches it to her chest, slow pull-back, fade to black"],
  ],

  lines: [
    { scene: 1, speaker: "ayshe", at: 3, tag: "shouts", text: t(
      "Nil, elimi bırakma!",
      "Nil, don't let go of my hand!",
      "Nil, lass meine Hand nicht los!",
      "Nil, ne lâche pas ma main !",
      "¡Nil, no me sueltes la mano!",
      "Nil, não solta a minha mão!",
      "نيل، لا تتركي يدي!",
      "नील, मेरा हाथ मत छोड़ना!") },
    { scene: 1, speaker: "pusula", at: 13, tag: "weak", text: t(
      "Bu... son gücümdü. Koşun!",
      "That was... the last of my strength. Run!",
      "Das war... meine letzte Kraft. Lauft!",
      "C'était... mes dernières forces. Courez !",
      "Eso era... lo último que me quedaba. ¡Corred!",
      "Essa foi... minha última força. Corram!",
      "كانت هذه... آخر قوتي. اركضا!",
      "ये... मेरी आख़िरी ताक़त थी। भागो!") },
    { scene: 2, speaker: "nil", at: 23, tag: "breathless", text: t(
      "Sola! Sonra aşağı! Kaydırak var!",
      "Left! Then down! There's a slide!",
      "Links! Dann runter! Da ist eine Rutsche!",
      "À gauche ! Puis en bas ! Il y a un toboggan !",
      "¡A la izquierda! ¡Luego abajo! ¡Hay un tobogán!",
      "Esquerda! Depois pra baixo! Tem um escorregador!",
      "يسارًا! ثم إلى الأسفل! هناك منزلق!",
      "बाएँ! फिर नीचे! वहाँ फिसलपट्टी है!") },
    { scene: 3, speaker: "ayshe", at: 56, tag: "urgent", text: t(
      "Rün, kalk! Gidiyoruz. Hemen!",
      "Rün, get up! We're leaving. Now!",
      "Rün, steh auf! Wir gehen. Sofort!",
      "Rün, lève-toi ! On part. Maintenant !",
      "¡Rün, levántate! Nos vamos. ¡Ya!",
      "Rün, levanta! A gente vai embora. Agora!",
      "رون، انهض! سنغادر. حالًا!",
      "रून, उठो! हम जा रहे हैं। अभी!") },
    { scene: 4, speaker: "nil", at: 76, tag: "proud", text: t(
      "Bunu kimseye söylemedim. Benim gizli yelkenlim!",
      "I never told anyone about this. My secret glider!",
      "Davon habe ich niemandem erzählt. Mein geheimer Gleiter!",
      "Je n'en ai jamais parlé à personne. Mon planeur secret !",
      "Nunca se lo conté a nadie. ¡Mi planeador secreto!",
      "Eu nunca contei isso pra ninguém. Meu planador secreto!",
      "لم أخبر أحدًا بهذا. طائرتي الشراعية السرية!",
      "मैंने ये किसी को नहीं बताया। मेरा गुप्त ग्लाइडर!") },
    { scene: 4, speaker: "ayshe", at: 88, tag: "shouts", text: t(
      "Rün! Gel! Lütfen!",
      "Rün! Come on! Please!",
      "Rün! Komm! Bitte!",
      "Rün ! Viens ! S'il te plaît !",
      "¡Rün! ¡Ven! ¡Por favor!",
      "Rün! Vem! Por favor!",
      "رون! تعال! أرجوك!",
      "रून! आओ! प्लीज़!") },
    { scene: 5, speaker: "run", at: 96, tag: "pained", text: t(
      "Ben kalıyorum, AyShe. Hatırlamak istemiyorum. Artık değil.",
      "I'm staying, AyShe. I don't want to remember. Not anymore.",
      "Ich bleibe, AyShe. Ich will mich nicht erinnern. Nicht mehr.",
      "Je reste, AyShe. Je ne veux pas me souvenir. Plus maintenant.",
      "Me quedo, AyShe. No quiero recordar. Ya no.",
      "Eu vou ficar, AyShe. Não quero lembrar. Não mais.",
      "سأبقى يا AyShe. لا أريد أن أتذكر. ليس بعد الآن.",
      "मैं यहीं रहूँगा, AyShe। मुझे याद नहीं करना। अब और नहीं।") },
    { scene: 6, speaker: "ayshe", at: 112, tag: "shouts", text: t(
      "Sıkı tutun!",
      "Hold on tight!",
      "Halt dich fest!",
      "Accroche-toi !",
      "¡Agárrate fuerte!",
      "Segura firme!",
      "تمسكي جيدًا!",
      "कसकर पकड़ो!") },
    { scene: 6, speaker: "nil", at: 131, tag: "screams", text: t(
      "Pusula!",
      "Compass!",
      "Kompass!",
      "Boussole !",
      "¡Brújula!",
      "Bússola!",
      "البوصلة!",
      "कंपास!") },
    { scene: 7, speaker: "narrator", at: 137, text: t(
      "Aster arkada kalıyordu. Ama AyShe'nin bir parçası orada kalmıştı.",
      "Aster was falling behind. But a part of AyShe had stayed there.",
      "Aster blieb zurück. Doch ein Teil von AyShe war dort geblieben.",
      "Aster s'éloignait. Mais une part d'AyShe était restée là-bas.",
      "Aster quedaba atrás. Pero una parte de AyShe se había quedado allí.",
      "Aster ficava para trás. Mas uma parte de AyShe tinha ficado lá.",
      "كانت أستر تبتعد. لكن جزءًا من AyShe بقي هناك.",
      "एस्टर पीछे छूट रहा था। पर AyShe का एक हिस्सा वहीं रह गया था।") },
    { scene: 7, speaker: "nil", at: 156, tag: "quietly", text: t(
      "Onu geri alacağız, değil mi?",
      "We'll get him back, won't we?",
      "Wir holen ihn zurück, oder?",
      "On va le récupérer, hein ?",
      "Lo recuperaremos, ¿verdad?",
      "A gente vai buscar ele, né?",
      "سنستعيده، أليس كذلك؟",
      "हम उसे वापस लाएँगे, है न?") },
    { scene: 8, speaker: "ayshe", at: 163, tag: "desperate", text: t(
      "Pusula, bana bak. Gitme. Lütfen gitme.",
      "Compass, look at me. Don't go. Please don't go.",
      "Kompass, sieh mich an. Geh nicht. Bitte geh nicht.",
      "Boussole, regarde-moi. Ne pars pas. S'il te plaît, ne pars pas.",
      "Brújula, mírame. No te vayas. Por favor, no te vayas.",
      "Bússola, olha pra mim. Não vai. Por favor, não vai.",
      "يا بوصلة، انظري إليّ. لا تذهبي. أرجوكِ لا تذهبي.",
      "कंपास, मेरी तरफ़ देखो। मत जाओ। प्लीज़ मत जाओ।") },
    { scene: 8, speaker: "pusula", at: 171, tag: "fading", text: t(
      "Senin anıların... bende saklı... AyShe...",
      "Your memories... are hidden in me... AyShe...",
      "Deine Erinnerungen... sind in mir versteckt... AyShe...",
      "Tes souvenirs... sont cachés en moi... AyShe...",
      "Tus recuerdos... están guardados en mí... AyShe...",
      "Suas lembranças... estão guardadas em mim... AyShe...",
      "ذكرياتكِ... مخبأة في داخلي... AyShe...",
      "तुम्हारी यादें... मेरे अंदर छिपी हैं... AyShe...") },
  ],
  next: { n: 9, title: t("Kod Adı: Genesis", "Codename: Genesis", "Codename: Genesis", "Nom de code : Genesis", "Nombre clave: Genesis", "Codinome: Genesis", "الاسم الرمزي: جينيسيس", "कोडनेम: जेनेसिस") },
});
