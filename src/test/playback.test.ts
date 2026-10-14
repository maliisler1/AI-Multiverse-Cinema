import { describe, it, expect } from "vitest";
import { canPlay, hasEpisodeAccess, nextPlayable } from "@/lib/playback";
import type { EpisodeRow } from "@/lib/catalog";
const ep = (n: number, status: "draft"|"ready", video_url: string|null): EpisodeRow => ({id:`e${n}`,series_id:"s",n,status,video_url,minutes:3,duration_sec:180,titles:[],tracks:[]});
describe("Published episode access", () => {
  it("never treats a draft with a leaked video path as published", () => expect(canPlay(ep(1,"draft","clip.mp4"))).toBe(false));
  it("does not offer an empty published video", () => expect(canPlay(ep(1,"ready",null))).toBe(false));
  it("requires an unlock for later episodes even on a direct player link", () => {
    const e=ep(4,"ready","clip.mp4");
    expect(hasEpisodeAccess(e,[],3)).toBe(false);
    expect(hasEpisodeAccess(e,[e.id],3)).toBe(true);
  });
  it("only advances to the next numbered published episode, without skipping drafts", () => {
    expect(nextPlayable([ep(2,"draft",null),ep(3,"ready","3.mp4")],1)).toBeUndefined();
    expect(nextPlayable([ep(2,"ready","2.mp4")],1)?.n).toBe(2);
  });
});
