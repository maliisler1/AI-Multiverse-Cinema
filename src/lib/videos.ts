/**
 * Bundled video assets that ship with the app.
 * Maps a series slug + episode number to a video URL served by the platform.
 * These are used as a fallback when Supabase storage doesn't have the video yet.
 */
export const BUNDLED_VIDEOS: Record<string, Record<number, string>> = {
  "neo-genesis-2099": {
    1: "/sample.mp4",
  },
};

/** Returns the bundled video URL for a series slug + episode number, if any. */
export function getBundledVideo(slug: string, n: number): string | null {
  return BUNDLED_VIDEOS[slug]?.[n] ?? null;
}
