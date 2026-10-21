/*
# Bölüm üretim işleri (Runway)

## Yeni tablo
- `production_jobs` — bir bölümün üretim adımlarını tek tek izler:
  - kind = keyframe (başlangıç karesi), clip (video klip), voice (dil başına replik sesi)
  - item_key = c01…c20 ya da "tr:l05" gibi dil:replik
  - status = queued → PENDING/RUNNING/THROTTLED → SUCCEEDED | FAILED | CANCELED
  - credits = bu iş için tahmini Runway kredisi
  - storage_path = çıktının `videos` kovasındaki yeri

## Güvenlik
- RLS açık. Yalnızca yöneticiler okuyabilir; yazma yalnızca sunucu fonksiyonundan (service role).

## Veri
- Neo-Genesis: 2099 bölüm adları 15 bölümlük yeni hikâyeye göre güncellenir (tr + en).
- Bölüm 1 için 8 dilde ses ve altyazı satırları "planned" olarak eklenir.
*/

create table if not exists public.production_jobs (
  id uuid primary key default gen_random_uuid(),
  series_slug text not null,
  episode_n integer not null,
  kind text not null check (kind in ('keyframe', 'clip', 'voice')),
  item_key text not null,
  lang text,
  status text not null default 'queued'
    check (status in ('queued', 'PENDING', 'RUNNING', 'THROTTLED', 'SUCCEEDED', 'FAILED', 'CANCELED')),
  runway_task_id text unique,
  credits integer not null default 0,
  params jsonb not null default '{}'::jsonb,
  storage_path text,
  failure text,
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (series_slug, episode_n, kind, item_key)
);

create index if not exists production_jobs_episode_idx on public.production_jobs (series_slug, episode_n, status);

grant select on public.production_jobs to authenticated;
grant all on public.production_jobs to service_role;
alter table public.production_jobs enable row level security;

drop policy if exists "admin reads production jobs" on public.production_jobs;
create policy "admin reads production jobs" on public.production_jobs
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- 15 bölümlük hikâye planı (Claude Docs: Neo-Genesis — Bölüm 1: Uyanış)
insert into public.episode_titles (episode_id, lang, title)
select e.id, v.lang, v.title
from public.episodes e
join public.series s on s.id = e.series_id and s.slug = 'neo-genesis-2099'
join (values
  (1, 'tr', 'Uyanış'), (1, 'en', 'Awakening'),
  (2, 'tr', 'Kayıp Sinyal'), (2, 'en', 'Lost Signal'),
  (3, 'tr', 'Megakentin Kalbi'), (3, 'en', 'Heart of the Megacity'),
  (4, 'tr', 'Kod Adı: Genesis'), (4, 'en', 'Codename: Genesis'),
  (5, 'tr', 'Gölge Kıyısı'), (5, 'en', 'Shadow Shore'),
  (6, 'tr', '23 Kalp Atışı'), (6, 'en', '23 Heartbeats'),
  (7, 'tr', 'Pusula''nın Sırrı'), (7, 'en', 'The Compass''s Secret'),
  (8, 'tr', 'Ters Akan Nehir'), (8, 'en', 'The Upstream River'),
  (9, 'tr', 'Bekçinin Yemini'), (9, 'en', 'The Guardian''s Oath'),
  (10, 'tr', 'Mira'), (10, 'en', 'Mira'),
  (11, 'tr', 'Kırık Kod'), (11, 'en', 'Broken Code'),
  (12, 'tr', 'Sıfır''ın Yüzü'), (12, 'en', 'The Face of Zero'),
  (13, 'tr', 'Hafızanın Kapısı'), (13, 'en', 'Gate of Memory'),
  (14, 'tr', 'Son Geri Sayım'), (14, 'en', 'Final Countdown'),
  (15, 'tr', 'Yeni Şafak'), (15, 'en', 'New Dawn')
) as v(n, lang, title) on v.n = e.n
on conflict (episode_id, lang) do update set title = excluded.title;

insert into public.tracks (episode_id, kind, lang, status)
select e.id, k.kind, l.lang, 'planned'
from public.episodes e
join public.series s on s.id = e.series_id and s.slug = 'neo-genesis-2099'
cross join (values ('audio'), ('subs')) as k(kind)
cross join (values ('tr'), ('en'), ('de'), ('fr'), ('es'), ('pt'), ('ar'), ('hi')) as l(lang)
where e.n = 1
on conflict (episode_id, kind, lang) do nothing;
