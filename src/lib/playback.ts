import type { EpisodeRow } from "./catalog";

export function canPlay(ep: EpisodeRow | undefined): ep is EpisodeRow {
  return !!ep && ep.status === "ready" && !!ep.video_url;
}
export function hasEpisodeAccess(ep: EpisodeRow, unlocked: string[], freeEpisodes: number) {
  return ep.n <= freeEpisodes || unlocked.includes(ep.id);
}
export function nextPlayable(eps: EpisodeRow[], current: number) {
  return eps.find((e) => e.n === current + 1 && canPlay(e));
}
