import { t } from "../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { moments } from "../../data/moments";
import { MOTION } from "../motion";
import { BackIcon } from "../ui/icons";
import "./moments.css";

/**
 * CAPTURED MOMENTS. The shutter closes over the camera lens, the flash fires,
 * and the room opens onto a contact sheet. Empty frames wait for real photos.
 */
export function MomentsGallery({ lens, reduced, onClose }: { lens: { x: number; y: number } | null; reduced: boolean; onClose: () => void }) {
  const root = useRef<HTMLElement>(null);
  const iris = useRef<SVGSVGElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<number | null>(null);
  const closing = useRef(false);
  const viewer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(0);
  const es = t("Close") === "Cerrar";
  const reset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); drag.current = null; }, []);
  const changeZoom = (delta: number) => {
    setZoom((z) => Math.min(4, Math.max(1, Math.round((z + delta) * 10) / 10)));
    setPan({ x: 0, y: 0 });
  };
  const closeViewer = useCallback(() => {
    reset(); setView(null);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }, [reset]);
  useEffect(() => {
    if (view !== null) viewer.current?.querySelector<HTMLElement>(".lightbox__close")?.focus({ preventScroll: true });
  }, [view]);
  const filled = moments.map((m, i) => (m.src ? i : -1)).filter((i) => i >= 0);

  useLayoutEffect(() => {
    const r = root.current;
    if (!r) return;
    if (reduced) {
      gsap.set(r.querySelector(".moments__sheet"), { opacity: 1 });
      return;
    }
    const p = lens ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const R = Math.hypot(window.innerWidth, window.innerHeight);
    gsap.set(iris.current, { left: p.x, top: p.y });
    gsap
      .timeline()
      .fromTo(iris.current, { scale: 0.05, opacity: 1 }, { scale: 1, duration: 0.01 })
      .fromTo(r.querySelectorAll(".iris__blade"), { rotation: 0 }, { rotation: 32, duration: 0.24, ease: "power2.in", transformOrigin: "50% 50%" })
      .fromTo(flash.current, { opacity: 0 }, { opacity: 0.9, duration: 0.06 })
      .to(flash.current, { opacity: 0, duration: 0.5, ease: "power2.out" })
      .set(r.querySelector(".moments__sheet"), { opacity: 1 }, "<")
      .to(iris.current, { left: window.innerWidth / 2, top: window.innerHeight / 2, scale: (R / 120) * 1.2, duration: 0.7, ease: "power3.inOut" }, "<")
      .to(r.querySelectorAll(".iris__blade"), { rotation: -40, duration: 0.7, ease: "power3.inOut" }, "<")
      .set(iris.current, { opacity: 0 })
      .fromTo(r.querySelectorAll(".moments__frame"), { y: 30, opacity: 0, rotation: (i) => (i % 2 ? 2 : -2) }, { y: 0, opacity: 1, rotation: 0, stagger: 0.05, duration: 0.6, ease: MOTION.ease.out }, "-=0.4");
    r.querySelector<HTMLElement>(".xp-back")?.focus({ preventScroll: true });
  }, [lens, reduced]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reduced || !root.current) return onClose();
    gsap.to(root.current, { opacity: 0, scale: 0.98, duration: 0.45, ease: MOTION.ease.in, onComplete: onClose });
  }, [onClose, reduced]);

  const step = useCallback(
    (d: number) => {
      if (view === null || filled.length < 2) return;
      reset();
      setDirection(d);
      const k = filled.indexOf(view);
      setView(filled[(k + d + filled.length) % filled.length]);
    },
    [view, filled, reset],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        return view !== null ? closeViewer() : close();
      }
      if (view !== null && (e.key === "ArrowRight" || e.key === "]")) { e.preventDefault(); step(1); }
      if (view !== null && (e.key === "ArrowLeft" || e.key === "[")) { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, closeViewer, step, view]);

  const v = view !== null ? moments[view] : null;

  return (
    <section ref={root} className="moments" role="dialog" aria-modal="true" aria-labelledby="moments-title">
      <div className="moments__sheet">
        <header className="moments__head">
          <div>
            <h2 id="moments-title">{t("Captured Moments")}</h2>
            <p>{t("Screenshots and photos from the projects and the road so far.")}</p>
          </div>
          <button type="button" className="xp-back" onClick={close}>
            <BackIcon /> {t("Back to the garage")}
          </button>
        </header>
        <ol className="moments__grid">
          {moments.map((m, i) => (
            <li key={m.id} className="moments__frame">
              {m.src ? (
                <button type="button" className="moments__photo" onClick={(e) => { trigger.current = e.currentTarget; reset(); setDirection(0); setView(i); }} aria-label={`${t("Enlarge")}: ${t(m.caption)}`}>
                  <img src={m.src} alt={t(m.caption)} loading="lazy" />
                </button>
              ) : (
                <div className="moments__empty">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <small>{t(m.kind === "photo" ? "Space for a photo" : "Space for a screenshot")}</small>
                </div>
              )}
              <p className="moments__caption">
                <span>{String(i + 1).padStart(2, "0")}</span> {m.src ? t(m.caption) : t("Coming soon")}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {v?.src && (
        <div ref={viewer} className="lightbox" role="dialog" aria-modal="true" aria-label={t(v.caption)}
          onKeyDown={(e) => {
            if (e.key !== "Tab") return;
            const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
            const first = buttons[0], last = buttons[buttons.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
          }}>
          <div className="lightbox__toolbar">
            <span className="lightbox__count">{String(filled.indexOf(view!) + 1).padStart(2, "0")} / {String(filled.length).padStart(2, "0")}</span>
            <div className="lightbox__tools">
              <button type="button" onClick={() => changeZoom(-0.25)} disabled={zoom <= 1} aria-label={es ? "Reducir" : "Zoom out"}>−</button>
              <button type="button" onClick={reset} title={es ? "Restablecer zoom" : "Reset zoom"} aria-label={es ? "Restablecer zoom" : "Reset zoom"}>{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => changeZoom(0.25)} disabled={zoom >= 4} aria-label={es ? "Ampliar" : "Zoom in"}>+</button>
              <button type="button" className="lightbox__close" onClick={closeViewer} aria-label={t("Close")}>×</button>
            </div>
          </div>
          <div ref={stage} className="lightbox__stage" data-zoomed={zoom > 1}
            onWheel={(e) => changeZoom(e.deltaY < 0 ? 0.1 : -0.1)}
            onPointerDown={(e) => {
              if (zoom <= 1 || e.button !== 0) return;
              drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, ox: pan.x, oy: pan.y };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d || d.id !== e.pointerId) return;
              const image = stage.current?.querySelector(".lightbox__polaroid");
              const maxX = Math.max(0, ((image?.clientWidth ?? 0) * zoom - e.currentTarget.clientWidth) / 2);
              const maxY = Math.max(0, ((image?.clientHeight ?? 0) * zoom - e.currentTarget.clientHeight) / 2);
              setPan({ x: Math.max(-maxX, Math.min(maxX, d.ox + e.clientX - d.x)), y: Math.max(-maxY, Math.min(maxY, d.oy + e.clientY - d.y)) });
            }}
            onPointerUp={() => { drag.current = null; }}
            onPointerCancel={() => { drag.current = null; }}
            onLostPointerCapture={() => { drag.current = null; }}
            onDoubleClick={() => zoom > 1 ? reset() : changeZoom(1)}>
            <div key={view} className="lightbox__arrival" data-direction={direction}>
              <figure className="lightbox__polaroid" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                <img src={v.src} alt={t(v.caption)} draggable={false} />
                <figcaption><span>{String(filled.indexOf(view!) + 1).padStart(2, "0")}</span> {t(v.caption)}</figcaption>
              </figure>
            </div>
          </div>
          {filled.length > 1 && (
            <div className="lightbox__nav">
              <button type="button" className="round-btn" onClick={() => step(-1)} aria-label={t("Previous")}><BackIcon /></button>
              <button type="button" className="round-btn round-btn--next" onClick={() => step(1)} aria-label={t("Next")}><BackIcon /></button>
            </div>
          )}
          <div className="lightbox__caption">
            <small>{es ? "Rueda para ampliar · Arrastra para mover · Esc para cerrar" : "Scroll to zoom · Drag to move · Esc to close"}</small>
          </div>
        </div>
      )}

      <svg ref={iris} className="iris" viewBox="-60 -60 120 120" width="120" height="120" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 60})`}>
            <path className="iris__blade" d="M0 -64 L56 -32 L14 -6 Z" fill="#141012" stroke="#2c2326" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
      <div ref={flash} className="flash" aria-hidden="true" />
    </section>
  );
}
