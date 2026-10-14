/*
# Admin Policies, RPC Functions, and Storage Policies

## Security Changes
- Admin write policies on catalog tables (series, series_text, episodes, episode_titles, tracks)
- Admin update on profiles, admin read on user_roles
- Token protection trigger prevents direct token balance changes (only via buy_pack RPC)
- Storage policies for posters/videos (public read, admin write) and faces (owner-scoped)

## New RPC Functions
- `buy_pack(p_pack_id, p_tokens, p_amount)` — records purchase and adds tokens
- `unlock_episode(p_episode_id, p_cost)` — deducts tokens and records unlocked episode

## Storage Policies
- posters/videos buckets: public read, admin-only write
- faces bucket: owner-scoped CRUD (user can only access their own folder)
*/

-- Yönetici yazma yetkileri (salt okuma herkese açık, yazma yalnızca yönetici)
create policy "admin insert series" on public.series for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update series" on public.series for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete series" on public.series for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin write series text" on public.series_text for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update series text" on public.series_text for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete series text" on public.series_text for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin insert episodes" on public.episodes for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update episodes" on public.episodes for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete episodes" on public.episodes for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin write episode titles" on public.episode_titles for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update episode titles" on public.episode_titles for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete episode titles" on public.episode_titles for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin insert tracks" on public.tracks for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update tracks" on public.tracks for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete tracks" on public.tracks for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update profiles" on public.profiles for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin read roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Jeton bakiyesi yalnızca satın alma / yönetici ile değişir
create or replace function public.protect_tokens()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  if coalesce(current_setting('app.allow_token_change', true), '') = 'on' then return new; end if;
  if public.has_role(new.user_id, 'admin') then return new; end if;
  if new.tokens is distinct from old.tokens then
    raise exception 'Jeton bakiyesi yalnizca satin alma ile degisir';
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect_tokens on public.profiles;
create trigger profiles_protect_tokens before update on public.profiles
  for each row execute function public.protect_tokens();

-- Demo jeton paketi: satın alma kaydı + bakiye ekleme
create or replace function public.buy_pack(p_pack_id text, p_tokens integer, p_amount text)
returns integer language plpgsql security definer set search_path = public
as $$ declare bal integer; begin
  if auth.uid() is null then raise exception 'Giris gerekli'; end if;
  perform set_config('app.allow_token_change','on', true);
  insert into public.purchases (user_id, pack_id, tokens, amount, status) values (auth.uid(), p_pack_id, p_tokens, p_amount, 'demo');
  update public.profiles set tokens = tokens + p_tokens where user_id = auth.uid() returning tokens into bal;
  return bal;
end $$;

-- Bölüm kilidi açma: jeton düşür + kalıcı kayıt
create or replace function public.unlock_episode(p_episode_id uuid, p_cost integer)
returns integer language plpgsql security definer set search_path = public
as $$ declare bal integer; begin
  if auth.uid() is null then raise exception 'Giris gerekli'; end if;
  select tokens into bal from public.profiles where user_id = auth.uid();
  if bal is null then raise exception 'Profil bulunamadi'; end if;
  if exists (select 1 from public.unlocked_episodes where user_id = auth.uid() and episode_id = p_episode_id) then return bal; end if;
  if bal < p_cost then raise exception 'Yetersiz jeton'; end if;
  perform set_config('app.allow_token_change','on', true);
  update public.profiles set tokens = tokens - p_cost where user_id = auth.uid() returning tokens into bal;
  insert into public.unlocked_episodes (user_id, episode_id) values (auth.uid(), p_episode_id);
  return bal;
end $$;

grant execute on function public.buy_pack(text, integer, text) to authenticated;
grant execute on function public.unlock_episode(uuid, integer) to authenticated;

-- Depolama: afiş ve video için imzalı bağlantı (public bucket kapalı olduğu için özel kova)
create policy "media read" on storage.objects for select to anon, authenticated using (bucket_id in ('posters','videos'));
create policy "admin media insert" on storage.objects for insert to authenticated with check (bucket_id in ('posters','videos') and public.has_role(auth.uid(),'admin'));
create policy "admin media update" on storage.objects for update to authenticated using (bucket_id in ('posters','videos') and public.has_role(auth.uid(),'admin'));
create policy "admin media delete" on storage.objects for delete to authenticated using (bucket_id in ('posters','videos') and public.has_role(auth.uid(),'admin'));

-- Depolama: yüz fotoğrafları yalnızca sahibine açık
create policy "face insert" on storage.objects for insert to authenticated with check (bucket_id = 'faces' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "face read" on storage.objects for select to authenticated using (bucket_id = 'faces' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "face update" on storage.objects for update to authenticated using (bucket_id = 'faces' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "face delete" on storage.objects for delete to authenticated using (bucket_id = 'faces' and (storage.foldername(name))[1] = auth.uid()::text);