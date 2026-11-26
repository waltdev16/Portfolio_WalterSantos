"use client";

// Sección de música: carrusel de álbumes con enlaces a Spotify y Apple Music (datos en src/data/albums.ts).

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Album } from "@/data/albums";
import { coverSrc } from "@/data/albums";
import { cn } from "@/lib/utils";
import FlexCarousel from "./FlexCarousel";
import { useT } from "@/i18n/t";

/* WebGL2 support, read once on the client (FlexCarousel needs it). */
let webgl2Cache: boolean | null = null;
function hasWebGL2() {
  if (webgl2Cache === null) {
    try {
      webgl2Cache = Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      webgl2Cache = false;
    }
  }
  return webgl2Cache;
}
const noop = () => () => {};

/* Small screens: smaller covers keep the centre card inside the lens. */
const SMALL = "(max-width: 640px)";
function subscribeSmall(cb: () => void) {
  const mq = window.matchMedia(SMALL);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const isSmall = () => window.matchMedia(SMALL).matches;

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14C9.6 9.9 15 10.56 18.72 12.84c.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  );
}

function AppleMusicIcon({ className }: { className?: string }) {
  // a simple eighth-note glyph inside a rounded square, in the spirit of the app icon
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <path d="M15.5 6.5v8.2a2.1 2.1 0 1 1-1.3-1.95V8.4l-4.4 1.1v6.3a2.1 2.1 0 1 1-1.3-1.95V8.3l7-1.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ListenLinks({ album, onClose }: { album: Album; onClose: () => void }) {
  const t = useT();
  const link =
    "group inline-flex h-11 items-center gap-2.5 rounded-full border border-line bg-surface/80 px-5 text-sm text-fg backdrop-blur transition-colors duration-300 hover:border-fluor hover:text-fluor";
  return (
    <motion.div
      key={album.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-center justify-center gap-2.5"
      role="group"
      aria-label={`${t("Listen to")} ${album.title} — ${album.artist}`}
    >
      <a href={album.spotify} target="_blank" rel="noopener noreferrer" className={link}>
        <SpotifyIcon className="size-4" />
        {t("Listen on Spotify")}
        <span className="sr-only">{t("(opens in a new tab)")}</span>
      </a>
      <a href={album.appleMusic} target="_blank" rel="noopener noreferrer" className={link}>
        <AppleMusicIcon className="size-4" />
        {t("Listen on Apple Music")}
        <span className="sr-only">{t("(opens in a new tab)")}</span>
      </a>
      <button
        type="button"
        onClick={onClose}
        aria-label={t("Close listening options")}
        className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

/**
 * Music carousel: React Bits' FlexCarousel (WebGL2) with a listening panel.
 * Clicking the centred cover runs the carousel's own focus animation and
 * reveals Spotify / Apple Music links for that album. Without WebGL2 a plain
 * scrollable row of covers is shown instead.
 */
export function MusicRotation({ albums }: { albums: Album[] }) {
  const t = useT();
  const webgl = useSyncExternalStore(noop, hasWebGL2, () => true);
  const small = useSyncExternalStore(subscribeSmall, isSmall, () => false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const items = useMemo(
    () =>
      albums.map((a) => ({
        src: coverSrc(a.cover),
        alt: `${a.title} by ${a.artist}, album cover`,
        title: a.title,
        subtitle: `${a.artist} · ${a.year}`,
      })),
    [albums],
  );

  const onFocusChange = useCallback((isOpen: boolean, index: number) => {
    setOpen(isOpen ? index : null);
  }, []);

  // Close through the carousel's own handler (Escape), so its animation runs
  // and the current position is kept.
  const close = useCallback(() => {
    const el = wrapRef.current?.querySelector<HTMLElement>(".flex-carousel");
    if (el) el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    else setOpen(null);
    // Al cerrar las opciones, devuelve el foco a un control que sigue visible.
    const target = el ?? wrapRef.current?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    target?.focus({ preventScroll: true });
  }, []);

  const album = open !== null ? albums[open] : null;

  return (
    <div>
      <p className="mb-3 text-center text-sm text-muted">{t("Drag or use the arrow keys to browse. Select an album to see listening options.")}</p>
      <div
        ref={wrapRef}
        className="relative -mx-5 h-[26rem] sm:-mx-10 sm:h-[clamp(400px,64vh,620px)] lg:mx-0"
      >
        {webgl ? (
          <FlexCarousel
            items={items}
            preset="liquid"
            intro="rise"
            fit="square"
            cardHeight={small ? 0.4 : 0.5}
            gap={12}
            squeeze={0.2}
            focusOnClick
            captions
            autoplay={false}
            captureWheel={false}
            onFocusChange={onFocusChange}
            ariaLabel={t("Album covers. Use the arrow keys to browse and Enter to open an album.")}
            className="music-carousel"
          />
        ) : (
          <ul className="no-scrollbar flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-5 sm:px-10" aria-label={t("Album covers")}>
            {albums.map((a, i) => (
              <li key={a.id} className="w-[min(60vw,15rem)] shrink-0 snap-center">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-pressed={open === i}
                  className={cn("block w-full text-left", open === i && "outline outline-2 outline-offset-4 outline-fluor")}
                >
                  <span className="relative block aspect-square overflow-hidden bg-bg-2">
                    <Image src={a.cover} alt={`${a.title} by ${a.artist}, album cover`} fill sizes="15rem" className="object-cover" />
                  </span>
                  <span className="mt-3 block font-display text-base font-medium">{a.title}</span>
                  <span className="block text-[13px] text-muted">
                    {a.artist} · {a.year}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {webgl && (
        <div role="group" aria-label={t("Browse albums")} className="mt-3 flex justify-center gap-3">
          {[
            { key: "ArrowLeft", label: "Previous album", Icon: ArrowLeft },
            { key: "ArrowRight", label: "Next album", Icon: ArrowRight },
          ].map(({ key, label, Icon }) => (
            <button key={key} type="button" aria-label={t(label)}
              className="grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
              onClick={() => wrapRef.current?.querySelector(".flex-carousel")?.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }))}>
              <Icon className="size-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {/* Listening options — fixed height so nothing jumps */}
      <div className="flex min-h-[7.5rem] items-center justify-center pt-4 sm:min-h-16" aria-live="polite">
        <AnimatePresence mode="wait">
          {album && <ListenLinks key={album.id} album={album} onClose={close} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
