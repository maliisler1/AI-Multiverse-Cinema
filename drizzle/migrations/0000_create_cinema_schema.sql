-- Roller
create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- Üyeler
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  photo_url text,
  tokens integer not null default 20,
  ui_lang text not null default 'tr',
  audio_lang text not null default 'tr',
  sub_lang text not null default 'tr',
  lang_chosen boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = user_id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "admin reads profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (user_id) values (new.id);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Katalog
create table public.series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null check (category in ('scifi','comedy','romance')),
  poster_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  sort integer not null default 0
);
create table public.series_text (
  series_id uuid not null references public.series(id) on delete cascade,
  lang text not null, tagline text, description text,
  primary key (series_id, lang)
);
create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series(id) on delete cascade,
  n integer not null, minutes integer not null default 3,
  video_url text, duration_sec integer,
  status text not null default 'draft' check (status in ('draft','ready')),
  unique (series_id, n)
);
create table public.episode_titles (
  episode_id uuid not null references public.episodes(id) on delete cascade,
  lang text not null, title text not null,
  primary key (episode_id, lang)
);
create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.episodes(id) on delete cascade,
  kind text not null check (kind in ('audio','subs')),
  lang text not null,
  status text not null default 'planned' check (status in ('ready','planned','none')),
  url text, unique (episode_id, kind, lang)
);
grant select on public.series, public.series_text, public.episodes, public.episode_titles, public.tracks to anon, authenticated;
grant all on public.series, public.series_text, public.episodes, public.episode_titles, public.tracks to service_role;
alter table public.series enable row level security;
alter table public.series_text enable row level security;
alter table public.episodes enable row level security;
alter table public.episode_titles enable row level security;
alter table public.tracks enable row level security;
create policy "public series" on public.series for select to anon, authenticated using (true);
create policy "public series text" on public.series_text for select to anon, authenticated using (true);
create policy "public episodes" on public.episodes for select to anon, authenticated using (true);
create policy "public episode titles" on public.episode_titles for select to anon, authenticated using (true);
create policy "public tracks" on public.tracks for select to anon, authenticated using (true);

-- İlerleme, satın alma, kilit açma
create table public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  position_sec integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id text not null, tokens integer not null, amount text not null,
  status text not null default 'demo' check (status in ('demo','paid')),
  created_at timestamptz not null default now()
);
create table public.unlocked_episodes (
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);
grant select, insert, update, delete on public.user_progress, public.purchases, public.unlocked_episodes to authenticated;
grant all on public.user_progress, public.purchases, public.unlocked_episodes to service_role;
alter table public.user_progress enable row level security;
alter table public.purchases enable row level security;
alter table public.unlocked_episodes enable row level security;
create policy "own progress" on public.user_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own purchases" on public.purchases for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own unlocks" on public.unlocked_episodes for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.series (slug,title,category,sort) values
('neo-genesis-2099','Neo-Genesis: 2099','scifi',0),
('cyber-glitch-ro-buster','Cyber-Glitch: Ro-Buster','comedy',1),
('neon-hearts-virtual-pulse','Neon Hearts: Virtual Pulse','romance',2),
('kuantum-gokyaslari','Kuantum Gözyaşları','scifi',3),
('zaman-kirigi-1923','Zaman Kırığı: 1923','scifi',4),
('kayip-frekans','Kayıp Frekans','scifi',5),
('sonsuz-dongu','Sonsuz Döngü','scifi',6),
('kalp-kodu','Kalp Kodu','romance',7),
('ruya-hirsizlari','Rüya Hırsızları','romance',8),
('uzay-kafeteryasi','Uzay Kafeteryası','comedy',9);

insert into public.series_text (series_id,lang,tagline,description) values
((select id from public.series where slug='neo-genesis-2099'),'tr','İnsanlığın son şansı, senin yüzünde saklı.','2099''da hafızası silinmiş genç bir astronot, insanlığın yeniden doğuşunun anahtarının kendi DNA''sında olduğunu keşfeder.'),
((select id from public.series where slug='neo-genesis-2099'),'en','Humanity''s last chance is hidden in your face.','In 2099, a young astronaut with an erased memory discovers that the key to humanity''s rebirth lies in her own DNA.'),
((select id from public.series where slug='cyber-glitch-ro-buster'),'tr','Bir robot, bir hata ve sonsuz kahkaha.','Şehrin en sakar temizlik robotu, bir yazılım hatasıyla kendini süper kahraman sanmaya başlar.'),
((select id from public.series where slug='cyber-glitch-ro-buster'),'en','One robot, one bug, endless laughs.','The city''s clumsiest cleaning robot starts believing he''s a superhero after a software glitch.'),
((select id from public.series where slug='neon-hearts-virtual-pulse'),'tr','Gerçek aşk, sanal dünyada başlar mı?','Farklı kıtalarda yaşayan iki yabancı sanal evrende tanışır ve gerçek dünyada birbirlerini bulmaya çalışır.'),
((select id from public.series where slug='neon-hearts-virtual-pulse'),'en','Can true love begin in a virtual world?','Two strangers on different continents meet in a virtual universe and try to find each other in the real world.'),
((select id from public.series where slug='kuantum-gokyaslari'),'tr','Bir gözyaşı, iki evreni birleştirir.','Paralel bir evrendeki bilim insanı, sadece ağladığında çözülen bir şifre yoluyla bizim evrenimizle iletişim kurar.'),
((select id from public.series where slug='kuantum-gokyaslari'),'en','One tear bridges two universes.','A scientist in a parallel universe communicates with ours through a cipher that only unlocks when she cries.'),
((select id from public.series where slug='zaman-kirigi-1923'),'tr','Geçmiş, düzeltmek için değil, hatırlamak için vardır.','Zaman yolculuğu yapan bir tarihçi, 1923''te küçük bir hatanın kendi geleceğini tamamen sileceğini fark eder.'),
((select id from public.series where slug='zaman-kirigi-1923'),'en','The past exists to remember, not to fix.','A time-travelling historian realises a small mistake in 1923 will erase her entire future.'),
((select id from public.series where slug='kayip-frekans'),'tr','Sinyal kesilmedi, sadece kimse duymadı.','Terk edilmiş bir radyo istasyonunda çalışan teknisyen, 40 yıl önce kaybolmuş bir gemiden hâlâ yayın gelen bir frekans yakalar.'),
((select id from public.series where slug='kayip-frekans'),'en','The signal never stopped; nobody was listening.','A technician at an abandoned radio station picks up a frequency still broadcasting from a ship lost forty years ago.'),
((select id from public.series where slug='sonsuz-dongu'),'tr','Aynı günü yaşamak, aynı hatayı seçmemektir.','Her gece 23.59''da günün başına dönen bir yazılım mühendisi, döngüyü ancak birine yardım ederek kırabileceğini anlar.'),
((select id from public.series where slug='sonsuz-dongu'),'en','Living the same day again is choosing differently.','A software engineer reliving the same day from 23:59 realises the loop only breaks when she helps someone.'),
((select id from public.series where slug='kalp-kodu'),'tr','Aşkı yazmak, kalbi programlamaya benzemez.','Yapay zekâ ile eşleşen bir flört uygulamasının geliştiricisi, algoritmanın kendisini en uyumsuz gösterdiği kişiyle tanışır.'),
((select id from public.series where slug='kalp-kodu'),'en','Writing love is not like programming a heart.','The developer of an AI matchmaking app meets the person her own algorithm rates as her worst match.'),
((select id from public.series where slug='ruya-hirsizlari'),'tr','Rüyalarını çalan birine âşık olmak.','Rüyaları kaydedip satan bir şirkette çalışan genç, kendi rüyalarını çalan hırsızla tanışınca iki dünya karışır.'),
((select id from public.series where slug='ruya-hirsizlari'),'en','Falling for the one who steals your dreams.','A young worker at a company that records and sells dreams meets the thief who has been stealing her own.'),
((select id from public.series where slug='uzay-kafeteryasi'),'tr','Galaksinin en kötü kahvesi, en iyi dostlukları.','Mars''taki ilk kafeteryanın insan olmayan kadrosu, dünyalı müşterilere çay servisi yapmakta büyük güçlük çeker.'),
((select id from public.series where slug='uzay-kafeteryasi'),'en','The galaxy''s worst coffee, the best friendships.','The non-human staff of Mars'' first cafeteria struggles to serve tea to customers from Earth.');

insert into public.episodes (series_id,n,minutes) select s.id, n, 3 from public.series s cross join generate_series(1,15) n;

insert into public.episode_titles (episode_id,lang,title) values
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=1),'tr','Uyanış'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=1),'en','Awakening'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=2),'tr','Kayıp Sinyal'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=2),'en','Lost Signal'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=3),'tr','Megakentin Kalbi'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=3),'en','Heart of the Megacity'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=4),'tr','Kod Adı: Genesis'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=4),'en','Codename: Genesis'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=5),'tr','Son Geri Sayım'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=5),'en','Final Countdown'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=6),'tr','Yeraltı Şehri'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=6),'en','Underground City'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=7),'tr','Unutulan Protokol'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=7),'en','The Forgotten Protocol'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=8),'tr','İki Yürek'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=8),'en','Two Hearts'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=9),'tr','Kızıl Sınır'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=9),'en','Red Boundary'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=10),'tr','Sessiz İstasyon'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=10),'en','Silent Station'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=11),'tr','Bellek Hırsızı'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=11),'en','Memory Thief'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=12),'tr','Son Kuantum'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=12),'en','The Last Quantum'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=13),'tr','Yeniden Doğuş'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=13),'en','Rebirth'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=14),'tr','Karanlık Yörünge'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=14),'en','Dark Orbit'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=15),'tr','Veda Sinyali'),
((select e.id from public.episodes e join public.series s on s.id=e.series_id where s.slug='neo-genesis-2099' and e.n=15),'en','Farewell Signal');

insert into public.tracks (episode_id,kind,lang,status)
select e.id, k.kind, k.lang, 'planned'
from public.episodes e
cross join (values ('audio','tr'),('audio','en'),('subs','tr'),('subs','en')) as k(kind,lang)
where e.series_id = (select id from public.series where slug='neo-genesis-2099');

insert into public.tracks (episode_id,kind,lang,status)
select e.id, 'audio', 'tr', 'none'
from public.episodes e
where e.series_id <> (select id from public.series where slug='neo-genesis-2099');