/*
# Fix video_generations user_id to be nullable

The user_id FK to auth.users prevents system-initiated generations
(where there is no real user). Making it nullable allows the system
to insert generation records with user_id = NULL.
*/

ALTER TABLE public.video_generations
  DROP CONSTRAINT IF EXISTS video_generations_user_id_fkey,
  ADD CONSTRAINT video_generations_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.video_generations
  ALTER COLUMN user_id DROP NOT NULL;