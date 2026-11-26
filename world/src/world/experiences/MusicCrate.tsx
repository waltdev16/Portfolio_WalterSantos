import { t } from "../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { albums } from "../../data/albums";
import { player, usePlayer } from "../music/player";
import { sound } from "../audio/sound";
import { MOTION } from "../motion";
import { BackIcon } from "../ui/icons";
import "./soundtrack.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * THE SOUNDTRACK — a quiet Japanese record shop.
 * One record large, its vinyl half out of the sleeve; the rest of the
 * collection in a separated, scrollable rail underneath.
 */
export function MusicCrate({ reduced, onClose }: { reduced: boolean; onClose: () => void }) {
  const { album: loaded, playing } = usePlayer();
  const [pick, setPick] = useState(() => Math.max(0, albums.findIndex((a) => a.id === loaded?.id)));
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLUListElement>(null);
  const sleeve = useRef<HTMLImageElement>(null);
  const vinyl = useRef<HTMLSpanElement>(null);
  const from = useRef<DOMRect | null>(null);
  const closing = useRef(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const a = albums[pick];
  const onTurntable = loaded?.id === a.id;

  // Entrance
  useLayoutEffect(() => {
    const r = root.current;
    if (!r) return;
    const d = reduced ? 0 : 1;
    gsap.fromTo(r.querySelector(".st__shade"), { opacity: 0 }, { opacity: 1, duration: 0.7 * d, delay: 0.25 * d });
    gsap.fromTo(r.querySelectorAll("[data-in]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 * d, stagger: 0.06, delay: 0.5 * d, ease: MOTION.ease.out });
    gsap.fromTo(r.querySelectorAll(".st__item"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 * d, stagger: 0.035, delay: 0.75 * d, ease: MOTION.ease.out });
    r.querySelector<HTMLElement>(".st__thumb.is-picked")?.focus({ preventScroll: true });
  }, [reduced]);

  // Selection: the cover travels from the rail to the feature, the vinyl slides out.
  useLayoutEffect(() => {
    const s = sleeve.current;
    if (!s || reduced) return;
    const f = from.current;
    from.current = null;
    if (f) {
      const b = s.getBoundingClientRect();
      gsap.fromTo(
        s,
        { x: f.left - b.left, y: f.top - b.top, scale: f.width / b.width, transformOrigin: "0 0" },
        { x: 0, y: 0, scale: 1, duration: 0.6, ease: MOTION.ease.inOut },
      );
    }
    gsap.fromTo(vinyl.current, { xPercent: 0, rotation: -40 }, { xPercent: 42, rotation: 0, duration: 0.8, delay: f ? 0.35 : 0.1, ease: MOTION.ease.out });
    gsap.fromTo(root.current?.querySelectorAll(".st__detail > *") ?? [], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, delay: f ? 0.3 : 0 });
  }, [pick, reduced]);

  // Keep the picked record visible in the rail.
  useEffect(() => {
    const r = rail.current;
    const el = r?.children[pick] as HTMLElement | undefined;
    if (!r || !el) return;
    // scroll the rail only (scrollIntoView would also move the page vertically)
    const left = el.offsetLeft - r.offsetLeft;
    if (left < r.scrollLeft || left + el.offsetWidth > r.scrollLeft + r.clientWidth) {
      r.scrollTo({ left: left - 2, behavior: reduced ? "auto" : "smooth" });
    }
  }, [pick, reduced]);

  const onScroll = useCallback(() => {
    const r = rail.current;
    if (!r) return;
    setEdges({ start: r.scrollLeft < 4, end: r.scrollLeft + r.clientWidth > r.scrollWidth - 4 });
  }, []);
  useEffect(onScroll, [onScroll]);

  const choose = useCallback((i: number, el?: HTMLElement | null) => {
    from.current = el?.querySelector("img")?.getBoundingClientRect() ?? null;
    sound.play("hover");
    setPick(i);
  }, []);

  const page = (dir: 1 | -1) => {
    const r = rail.current;
    if (r) r.scrollBy({ left: dir * r.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" });
  };

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const r = root.current;
    if (reduced || !r) return onClose();
    gsap.to(r.querySelectorAll("[data-in], .st__item"), { opacity: 0, y: 10, duration: 0.25, stagger: 0.01, ease: MOTION.ease.in });
    gsap.to(r.querySelector(".st__shade"), { opacity: 0, duration: 0.45, delay: 0.15, onComplete: onClose });
  }, [onClose, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") choose(Math.min(albums.length - 1, pick + 1));
      else if (e.key === "ArrowLeft") choose(Math.max(0, pick - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, choose, pick]);

  return (
    <section ref={root} className="st" role="dialog" aria-modal="true" aria-labelledby="st-title">
      <div className="st__shade" aria-hidden="true" />
      <div className="st__inner">
        <header className="st__head" data-in>
          <p className="st__kicker">
            {t("MY WORLD")} <span>/</span> {t("THE SOUNDTRACK")}
          </p>
          <button type="button" className="xp-back" onClick={close}>
            <BackIcon /> {t("Back to the garage")}
          </button>
        </header>

        <div className="st__feature" data-in>
          <div className="st__art">
            <span ref={vinyl} className={`st__vinyl${onTurntable && playing ? " is-spinning" : ""}`} aria-hidden="true">
              <img src={a.cover} alt="" />
            </span>
            <img ref={sleeve} key={a.id} className="st__sleeve" src={a.cover} alt={`${a.title} cover`} />
          </div>
          <div className="st__detail" aria-live="polite">
            <p className="st__index">
              {pad(pick + 1)} <span>/ {pad(albums.length)}</span>
            </p>
            <h2 id="st-title">{a.title}</h2>
            <p className="st__artist">{a.artist}</p>
            <p className="st__year">{a.year}</p>
            <div className="st__actions">
              <a href={a.spotify} target="_blank" rel="noopener noreferrer">
                Spotify <span aria-hidden="true">↗</span>
              </a>
              <a href={a.appleMusic} target="_blank" rel="noopener noreferrer">
                Apple Music <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                className={`st__play${onTurntable ? " is-on" : ""}`}
                onClick={() => {
                  sound.play("select");
                  if (onTurntable) player.stop();
                  else player.select(a);
                }}
              >
                <i aria-hidden="true" />
                {onTurntable ? t("Lift the needle") : t("Play on the turntable")}
              </button>
            </div>
          </div>
        </div>

        <div className="st__collection">
          <div className="st__bar" data-in>
            <p>
              {t("COLLECTION")} <span>· {albums.length} {t("RECORDS")}</span>
            </p>
            <div className="st__arrows">
              <button type="button" onClick={() => page(-1)} disabled={edges.start} aria-label={t("Scroll the collection back")}>
                <BackIcon />
              </button>
              <button type="button" className="is-next" onClick={() => page(1)} disabled={edges.end} aria-label={t("Scroll the collection forward")}>
                <BackIcon />
              </button>
            </div>
          </div>
          <ul ref={rail} className="st__rail" aria-label={t("Records")} onScroll={onScroll}>
            {albums.map((al, i) => (
              <li key={al.id} className="st__item">
                <button
                  type="button"
                  className={`st__thumb${i === pick ? " is-picked" : ""}`}
                  aria-pressed={i === pick}
                  aria-label={`${al.title} — ${al.artist}`}
                  onClick={(e) => choose(i, e.currentTarget)}
                >
                  <span className="st__cover">
                    <img src={al.cover} alt="" loading="lazy" />
                    {loaded?.id === al.id && <span className="st__now">{t("ON THE TURNTABLE")}</span>}
                  </span>
                  <strong>{al.title}</strong>
                  <span className="st__by">{al.artist}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
