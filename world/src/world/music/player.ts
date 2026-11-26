import { useSyncExternalStore } from "react";
import type { Album } from "../../data/albums";

/**
 * Room record player. Music only starts when the visitor picks an album;
 * playback is Spotify's embedded player (previews, or full tracks for
 * signed-in listeners). The player stays mounted while exploring, so the
 * music keeps going after the panel is closed.
 */

export interface PlayerState {
  album: Album | null;
  /** True while Spotify reports playback. In fallback mode (API unavailable) it follows the dock. */
  playing: boolean;
  mode: "api" | "fallback";
}

let state: PlayerState = { album: null, playing: false, mode: "api" };
const listeners = new Set<() => void>();
const set = (patch: Partial<PlayerState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export const player = {
  select(album: Album) {
    set({ album, playing: state.mode === "fallback" });
  },
  stop() {
    detachSpotify();
    set({ album: null, playing: false });
  },
  togglePlay() {
    controller?.togglePlay?.();
  },
  setPlaying(playing: boolean) {
    if (playing !== state.playing) set({ playing });
  },
  fallback() {
    set({ mode: "fallback", playing: !!state.album });
  },
};

export function usePlayer() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => state,
    () => state,
  );
}

export const spotifyId = (album: Album) => album.spotify.split("/").pop()!.split("?")[0];

/* ---------- Spotify iFrame API ---------- */

interface SpotifyController {
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  addListener(event: "playback_update" | "ready", cb: (e: { data: { isPaused: boolean } }) => void): void;
  destroy(): void;
}
interface SpotifyIFrameAPI {
  createController(el: HTMLElement, options: { uri: string; width?: string | number; height?: string | number }, cb: (c: SpotifyController) => void): void;
}
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

let controller: SpotifyController | null = null;
let apiPromise: Promise<SpotifyIFrameAPI> | null = null;

function loadApi() {
  apiPromise ??= new Promise<SpotifyIFrameAPI>((resolve, reject) => {
    window.onSpotifyIframeApiReady = resolve;
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    s.onerror = () => reject(new Error("Spotify API unavailable"));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error("Spotify API timeout")), 8000);
  });
  return apiPromise;
}

/** Mounts (or reuses) the Spotify controller inside `el` and loads the album. */
export async function attachSpotify(el: HTMLElement, album: Album) {
  const uri = `spotify:album:${spotifyId(album)}`;
  if (controller) {
    controller.loadUri(uri);
    controller.play();
    return;
  }
  try {
    const api = await loadApi();
    api.createController(el, { uri, width: "100%", height: 80 }, (c) => {
      controller = c;
      c.addListener("playback_update", (e) => player.setPlaying(!e.data.isPaused));
      c.addListener("ready", () => c.play());
    });
  } catch {
    player.fallback();
  }
}

export function detachSpotify() {
  controller?.destroy();
  controller = null;
}
