/*
# Create Storage Buckets

Creates three private storage buckets needed by the app:
- `videos` — episode video files (private, accessed via signed URLs)
- `posters` — series poster images (private, accessed via signed URLs)
- `faces` — user face photos (private, owner-scoped via RLS policies already created)
*/

INSERT INTO storage.buckets (id, name, public) VALUES
  ('videos', 'videos', false),
  ('posters', 'posters', false),
  ('faces', 'faces', false)
ON CONFLICT (id) DO NOTHING;