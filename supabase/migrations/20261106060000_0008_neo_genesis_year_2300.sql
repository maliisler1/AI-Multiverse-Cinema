-- Neo-Genesis dizisinin yılı 2099'dan 2300'e taşındı (senaryo zaten "Yıl 2300" diyor).
-- Bağlantılar ve videolar bozulmasın diye slug (neo-genesis-2099) aynı kalır.
update public.series
  set title = 'Neo-Genesis: 2300'
  where slug = 'neo-genesis-2099';

update public.series_text
  set description = replace(description, '2099', '2300')
  where series_id = (select id from public.series where slug = 'neo-genesis-2099')
    and description like '%2099%';
