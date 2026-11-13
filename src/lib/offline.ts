import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { useSyncExternalStore } from "react";

/** İnternetsiz izleme için cihaza indirilmiş bölüm dosyaları. */
export type OfflineEntry = { video: string; audio?: string; audioLang?: string };
type Map = Record<string, OfflineEntry>;

const KEY = "amc-offline-v1";
const subs = new Set<() => void>();
let cache: Map | null = null;

function read(): Map {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Map;
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Map) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* depolama kapalı */
  }
  subs.forEach((fn) => fn());
}

async function fetchTo(url: string, path: string): Promise<string> {
  await Filesystem.downloadFile({ url, path, directory: Directory.Data, recursive: true });
  return (await Filesystem.getUri({ path, directory: Directory.Data })).uri;
}

export const offline = {
  supported: () => Capacitor.isNativePlatform(),
  get: (episodeId: string): OfflineEntry | undefined => read()[episodeId],
  /** Cihazdaki dosyayı oynatıcının açabileceği adrese çevirir. */
  src: (fileUri: string) => Capacitor.convertFileSrc(fileUri),

  async download(episodeId: string, videoUrl: string, audio?: { url: string; lang: string }) {
    const video = await fetchTo(videoUrl, `episodes/${episodeId}.mp4`);
    const entry: OfflineEntry = { video };
    if (audio) {
      entry.audio = await fetchTo(audio.url, `episodes/${episodeId}.${audio.lang}.audio`);
      entry.audioLang = audio.lang;
    }
    write({ ...read(), [episodeId]: entry });
  },

  async remove(episodeId: string) {
    const entry = read()[episodeId];
    if (!entry) return;
    for (const uri of [entry.video, entry.audio]) {
      if (uri) await Filesystem.deleteFile({ path: uri }).catch(() => {});
    }
    const { [episodeId]: _drop, ...rest } = read();
    write(rest);
  },

  subscribe(fn: () => void) {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
};

/** İndirilmiş bölümler değiştikçe bileşeni yeniler. */
export function useOffline(): Map {
  return useSyncExternalStore(offline.subscribe, read, () => ({}));
}
