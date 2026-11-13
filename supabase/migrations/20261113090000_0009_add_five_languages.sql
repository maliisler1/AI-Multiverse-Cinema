-- Yeni diller: İtalyanca, Çince, Japonca, Rusça, Korece.
-- Dizi açıklamaları ve Neo-Genesis 1. bölüm için planlanan ses/altyazı parçaları.

insert into public.series_text (series_id, lang, tagline, description)
select s.id, v.lang, v.tagline, v.description
from (values
  ('neo-genesis-2099', 'it', 'L''ultima possibilità dell''umanità è nascosta nel tuo volto.', 'Nel 2300 una giovane astronauta senza memoria scopre che la chiave della rinascita dell''umanità è nel suo stesso DNA.'),
  ('neo-genesis-2099', 'zh', '人类最后的希望，藏在你的脸上。', '2300 年，一位失去记忆的年轻宇航员发现，人类重生的关键就在她自己的 DNA 里。'),
  ('neo-genesis-2099', 'ja', '人類最後の希望は、あなたの顔に隠されている。', '2300年、記憶を失った若い宇宙飛行士は、人類再生の鍵が自分自身のDNAにあることを知る。'),
  ('neo-genesis-2099', 'ru', 'Последний шанс человечества скрыт в твоём лице.', 'В 2300 году юная астронавтка, потерявшая память, узнаёт, что ключ к возрождению человечества — в её собственной ДНК.'),
  ('neo-genesis-2099', 'ko', '인류의 마지막 희망은 당신의 얼굴에 숨겨져 있다.', '2300년, 기억을 잃은 젊은 우주비행사는 인류 재탄생의 열쇠가 자신의 DNA에 있다는 사실을 알게 된다.'),
  ('cyber-glitch-ro-buster', 'it', 'Un robot, un bug, risate senza fine.', 'Il robot delle pulizie più goffo della città, dopo un errore di software, si convince di essere un supereroe.'),
  ('cyber-glitch-ro-buster', 'zh', '一个机器人，一个故障，笑声不断。', '城里最笨手笨脚的清洁机器人，因为一次软件故障，开始以为自己是超级英雄。'),
  ('cyber-glitch-ro-buster', 'ja', 'ロボットひとつ、バグひとつ、笑いは無限大。', '街いちばんのドジな掃除ロボットが、ソフトのバグで自分をスーパーヒーローだと思い込む。'),
  ('cyber-glitch-ro-buster', 'ru', 'Один робот, один баг, бесконечный смех.', 'Самый неуклюжий робот-уборщик города после программного сбоя начинает считать себя супергероем.'),
  ('cyber-glitch-ro-buster', 'ko', '로봇 하나, 버그 하나, 끝없는 웃음.', '도시에서 가장 덜렁대는 청소 로봇이 소프트웨어 오류로 자신이 슈퍼히어로라고 믿기 시작한다.'),
  ('neon-hearts-virtual-pulse', 'it', 'Il vero amore può nascere in un mondo virtuale?', 'Due sconosciuti di continenti diversi si incontrano in un universo virtuale e cercano di ritrovarsi nel mondo reale.'),
  ('neon-hearts-virtual-pulse', 'zh', '真爱能在虚拟世界里开始吗？', '两个身处不同大陆的陌生人在虚拟宇宙中相遇，并试图在现实世界中找到彼此。'),
  ('neon-hearts-virtual-pulse', 'ja', '本当の恋は、仮想世界で始まるの？', '別々の大陸に住む見知らぬ二人が仮想世界で出会い、現実の世界でお互いを探し始める。'),
  ('neon-hearts-virtual-pulse', 'ru', 'Может ли настоящая любовь начаться в виртуальном мире?', 'Двое незнакомцев с разных континентов встречаются в виртуальной вселенной и пытаются найти друг друга в реальном мире.'),
  ('neon-hearts-virtual-pulse', 'ko', '진짜 사랑은 가상 세계에서 시작될 수 있을까?', '서로 다른 대륙에 사는 두 낯선 사람이 가상 세계에서 만나 현실에서 서로를 찾으려 한다.')
) as v(slug, lang, tagline, description)
join public.series s on s.slug = v.slug
where not exists (select 1 from public.series_text t where t.series_id = s.id and t.lang = v.lang);

insert into public.tracks (episode_id, kind, lang, status)
select e.id, k.kind, l.lang, 'planned'
from public.episodes e
join public.series s on s.id = e.series_id and s.slug = 'neo-genesis-2099'
cross join (values ('audio'), ('subs')) as k(kind)
cross join (values ('it'), ('zh'), ('ja'), ('ru'), ('ko')) as l(lang)
where e.n = 1
on conflict (episode_id, kind, lang) do nothing;
