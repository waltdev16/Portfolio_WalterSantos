import { t } from "../i18n";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { attachSpotify, detachSpotify, player, spotifyId, usePlayer } from "./player";
import { Vinyl } from "./Vinyl";

/**
 * Small player that stays in the corner while the visitor explores the room.
 * Holds Spotify's embed; if the Spotify script can't load, falls back to the plain embed.
 */
export function PlayerDock({ compact, onOpen }: { compact: boolean; onOpen: () => void }) {
  const { album, playing, mode } = usePlayer();
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (album && host.current && mode === "api") void attachSpotify(host.current, album);
  }, [album, mode]);

  useEffect(() => () => detachSpotify(), []);

  useLayoutEffect(() => {
    if (album) gsap.fromTo(root.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  }, [album]);

  if (!album) return null;
  return (
    <div ref={root} className={`dockplayer${compact ? " dockplayer--compact" : ""}`} role="region" aria-label={t("Now playing")}>
      <div className="dockplayer__head">
        <button type="button" className="dockplayer__disc" onClick={onOpen} aria-label={t("Open the music corner")}>
          <Vinyl cover={album.cover} spinning={playing} size={40} />
        </button>
        <div className="dockplayer__title">
          <strong>{album.title}</strong>
          <span>{album.artist}</span>
        </div>
        <button type="button" className="dockplayer__close" onClick={() => player.stop()} aria-label={t("Stop and close the player")}>
          ×
        </button>
      </div>
      <div className="dockplayer__embed">
        {mode === "api" ? (
          <div ref={host} />
        ) : (
          <iframe
            title={`${album.title} on Spotify`}
            src={`https://open.spotify.com/embed/album/${spotifyId(album)}?theme=0`}
            width="100%"
            height="80"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
