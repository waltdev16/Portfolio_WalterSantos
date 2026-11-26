import { t } from "../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { certificates } from "../../data/certificates";
import { sound } from "../audio/sound";
import { BackIcon } from "./icons";

interface Props {
  start: number;
  /** Frame on the wall the document is lifted from, if any. */
  origin: HTMLElement | null;
  reduced: boolean;
  onLift: (id: string | null) => void;
  onClose: () => void;
}

const wallEl = (id: string) => document.querySelector<HTMLElement>(`.wall-frame[data-cert="${id}"]`);

/**
 * Large viewer for diplomas and badges. A document taken from the wall flies
 * from its frame to the centre of the screen (and back when closed), the way
 * records come out of the shelf in a record shop.
 */
export function Showcase({ start, origin, reduced, onLift, onClose }: Props) {
  const [i, setI] = useState(start);
  const dir = useRef(0);
  const closing = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const c = certificates[i];
  const n = certificates.length;

  // Opening: fly out of the wall frame (or rise from below).
  useLayoutEffect(() => {
    const el = frame.current;
    const r = root.current;
    if (!el || !r) return;
    const d = reduced ? 0 : 1;
    gsap.fromTo(r.querySelector(".showcase__backdrop"), { opacity: 0 }, { opacity: 1, duration: 0.5 * d });
    gsap.fromTo(r.querySelectorAll(".showcase__info, .showcase__thumbs, .showcase__close"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 * d, delay: 0.55 * d, stagger: 0.06 });
    if (origin && !reduced) {
      const a = origin.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      gsap.fromTo(
        el,
        { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, rotation: -2, transformOrigin: "0 0" },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 0.95, ease: "power3.inOut" },
      );
    } else {
      gsap.fromTo(el, { y: 60, opacity: 0, rotation: 2 }, { y: 0, opacity: 1, rotation: 0, duration: 0.7 * d, ease: "power3.out" });
    }
    closeBtn.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The current wall document leaves an empty frame behind.
  useEffect(() => {
    onLift(c.wall ? c.id : null);
  }, [c, onLift]);

  // Changing document: slide like flipping through frames.
  useLayoutEffect(() => {
    if (!dir.current || reduced) return;
    gsap.fromTo(frame.current, { x: dir.current * 70, rotation: dir.current * 3, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.55, ease: "power3.out" });
  }, [i, reduced]);

  const go = useCallback(
    (to: number) => {
      const next = (to + n) % n;
      if (next === i) return;
      dir.current = to > i || (i === n - 1 && next === 0) ? 1 : -1;
      sound.play("select");
      setI(next);
    },
    [i, n],
  );

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    sound.play("back");
    const el = frame.current;
    const r = root.current;
    const target = c.wall ? wallEl(c.id) : null;
    const d = reduced ? 0 : 1;
    if (!el || !r) return onClose();
    gsap.to(r.querySelectorAll(".showcase__info, .showcase__thumbs, .showcase__close"), { opacity: 0, duration: 0.25 * d });
    gsap.to(r.querySelector(".showcase__backdrop"), { opacity: 0, duration: 0.6 * d, delay: 0.3 * d });
    if (target && !reduced) {
      gsap.set(tilt.current, { rotationX: 0, rotationY: 0 });
      const a = target.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      gsap.to(el, {
        x: `+=${a.left - b.left}`,
        y: `+=${a.top - b.top}`,
        scaleX: a.width / b.width,
        scaleY: a.height / b.height,
        transformOrigin: "0 0",
        duration: 0.85,
        ease: "power3.inOut",
        onComplete: onClose,
      });
    } else {
      gsap.to(el, { y: 50, opacity: 0, duration: 0.45 * d, ease: "power2.in", onComplete: onClose });
    }
  }, [c, reduced, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go, i]);

  // Hold-it-in-your-hands tilt + swipe.
  useEffect(() => {
    const t = tilt.current;
    const r = root.current;
    if (!t || !r || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const rx = gsap.quickTo(t, "rotationX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(t, "rotationY", { duration: 0.8, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      ry(((e.clientX / window.innerWidth) * 2 - 1) * 6);
      rx(-((e.clientY / window.innerHeight) * 2 - 1) * 5);
    };
    r.addEventListener("pointermove", onMove);
    return () => r.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const swipe = useRef<number | null>(null);

  return (
    <div ref={root} className="showcase" role="dialog" aria-modal="true" aria-label={t("Diplomas and certificates")}>
      <div className="showcase__backdrop" onClick={close} />
      <div
        className="showcase__stage"
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1);
        }}
      >
        <div ref={frame} className="showcase__frame-wrap">
          <div ref={tilt} className={`showcase__frame showcase__frame--${c.kind}`} style={{ aspectRatio: `${c.width} / ${c.height}` }}>
            <img src={c.image} alt={t(c.name)} />
            <span className="showcase__glass" aria-hidden="true" />
          </div>
        </div>
      </div>

      <aside className="showcase__info" aria-live="polite">
        <p className="showcase__count">
          {String(i + 1).padStart(2, "0")} <span>/ {String(n).padStart(2, "0")}</span>
        </p>
        <h2>{t(c.name)}</h2>
        <p className="showcase__meta">
          {t(c.issuer)}
          {c.year && ` · ${c.year}`}
        </p>
        {c.date && <p className="showcase__date">{t(c.date!)}</p>}
        <p className="showcase__desc">{t(c.description)}</p>
        {c.note && <p className="showcase__note">{t(c.note!)}</p>}
        {c.verifyUrl && (
          <a className="showcase__verify" href={c.verifyUrl} target="_blank" rel="noopener noreferrer">
            {t("Verify on Credly")}
          </a>
        )}
        <div className="showcase__nav">
          <button type="button" className="round-btn" onClick={() => go(i - 1)} aria-label={t("Previous document")}>
            <BackIcon />
          </button>
          <button type="button" className="round-btn round-btn--next" onClick={() => go(i + 1)} aria-label={t("Next document")}>
            <BackIcon />
          </button>
        </div>
      </aside>

      <ol className="showcase__thumbs">
        {certificates.map((t, k) => (
          <li key={t.id}>
            <button type="button" className={k === i ? "is-current" : ""} aria-label={t.name} aria-current={k === i || undefined} onClick={() => go(k)}>
              <img src={t.image} alt="" />
            </button>
          </li>
        ))}
      </ol>

      <button ref={closeBtn} type="button" className="showcase__close" onClick={close}>
        <BackIcon className="panel__back-icon" />
        {t("Back to the garage")}
      </button>
    </div>
  );
}
