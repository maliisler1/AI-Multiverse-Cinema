/*
# Add "Neo-Veridia: Kod 23" Series

## New Data
- Inserts a new sci-fi series "Neo-Veridia: Kod 23" with slug `neo-veridia-kod-23`
- Adds 5 episodes (3 minutes each)
- Adds localized titles for all 5 episodes in Turkish and English
- Adds series text (tagline + description) in Turkish and English
- Adds audio/subtitle tracks: tr+en planned (matching Neo-Genesis pattern)
- Sets sort=10 so it appears after existing series
- Sets status to 'published' so it's visible in the app
*/

INSERT INTO public.series (slug, title, category, status, sort)
VALUES ('neo-veridia-kod-23', 'Neo-Veridia: Kod 23', 'scifi', 'published', 10)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.series_text (series_id, lang, tagline, description) VALUES
((SELECT id FROM public.series WHERE slug='neo-veridia-kod-23'), 'tr',
 'Kod 23: Evrenin sırrı bir kızın rüyalarında.',
 'Neo-Veridia şehrinde, her gece aynı rüyayı gören 16 yaşındaki Ada, rüyasındaki Kod 23''ün gerçek bir evrensel parçanın anahtarı olduğunu keşfeder.'),
((SELECT id FROM public.series WHERE slug='neo-veridia-kod-23'), 'en',
 'Code 23: The universe''s secret is in a girl''s dreams.',
 'In the city of Neo-Veridia, 16-year-old Ada keeps dreaming the same dream every night — and discovers that Code 23 in her dream is the key to a universal fragment.')
ON CONFLICT (series_id, lang) DO NOTHING;

-- Insert 5 episodes
INSERT INTO public.episodes (series_id, n, minutes)
SELECT s.id, n, 3
FROM public.series s
CROSS JOIN generate_series(1, 5) AS n
WHERE s.slug = 'neo-veridia-kod-23'
ON CONFLICT (series_id, n) DO NOTHING;

-- Episode titles
INSERT INTO public.episode_titles (episode_id, lang, title) VALUES
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=1), 'tr', 'Rüyanın Başlangıcı'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=1), 'en', 'The Dream Begins'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=2), 'tr', 'Kod 23'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=2), 'en', 'Code 23'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=3), 'tr', 'Neo-Veridia''nın Gölgeleri'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=3), 'en', 'Shadows of Neo-Veridia'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=4), 'tr', 'Evrenin Parçası'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=4), 'en', 'The Universal Fragment'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=5), 'tr', 'Son Uyanış'),
((SELECT e.id FROM public.episodes e JOIN public.series s ON s.id=e.series_id WHERE s.slug='neo-veridia-kod-23' AND e.n=5), 'en', 'The Final Awakening')
ON CONFLICT (episode_id, lang) DO NOTHING;

-- Tracks: tr+en audio and subs planned
INSERT INTO public.tracks (episode_id, kind, lang, status)
SELECT e.id, k.kind, k.lang, 'planned'
FROM public.episodes e
CROSS JOIN (VALUES ('audio','tr'),('audio','en'),('subs','tr'),('subs','en')) AS k(kind,lang)
WHERE e.series_id = (SELECT id FROM public.series WHERE slug='neo-veridia-kod-23')
ON CONFLICT (episode_id, kind, lang) DO NOTHING;