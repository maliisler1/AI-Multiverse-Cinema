/*
# Add Video Generations Table for Runway Integration

## New Tables
- `video_generations` — tracks Runway AI video generation tasks per episode
  - `id` (uuid, primary key)
  - `episode_id` (uuid, FK to episodes)
  - `user_id` (uuid, FK to auth.users)
  - `runway_task_id` (text, unique — Runway's task identifier)
  - `status` (text: PENDING, THROTTLING, RUNNING, SUCCEEDED, FAILED, CANCELED)
  - `model` (text — Runway model used, e.g. gen4.5)
  - `prompt_text` (text — the text prompt sent to Runway)
  - `prompt_image` (text, nullable — optional image URL sent to Runway)
  - `duration_sec` (integer — requested video duration)
  - `output_url` (text, nullable — resulting video URL when SUCCEEDED)
  - `saved_to_storage` (boolean, default false — whether video was saved to Supabase storage)
  - `failure_reason` (text, nullable — error details if FAILED)
  - `completed_at` (timestamptz, nullable)
  - `created_at` (timestamptz, default now())

## Security
- RLS enabled
- Owner-scoped: users can only see their own generation tasks
- Service role has full access (edge function uses service role key)
*/

CREATE TABLE IF NOT EXISTS public.video_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  runway_task_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  model text NOT NULL DEFAULT 'gen4.5',
  prompt_text text,
  prompt_image text,
  duration_sec integer DEFAULT 5,
  output_url text,
  saved_to_storage boolean NOT NULL DEFAULT false,
  failure_reason text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_generations TO authenticated;
GRANT ALL ON public.video_generations TO service_role;

ALTER TABLE public.video_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own video generations read" ON public.video_generations;
CREATE POLICY "own video generations read" ON public.video_generations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own video generations insert" ON public.video_generations;
CREATE POLICY "own video generations insert" ON public.video_generations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own video generations update" ON public.video_generations;
CREATE POLICY "own video generations update" ON public.video_generations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own video generations delete" ON public.video_generations;
CREATE POLICY "own video generations delete" ON public.video_generations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);