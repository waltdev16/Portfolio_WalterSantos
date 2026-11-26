import { t } from "../../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "@fontsource-variable/manrope";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import { volumes } from "../../../data/archive";
import { ArchiveReader } from "./ArchiveReader";
import "./archive.css";

interface Props {
  /** Screen rect of the book stack in the room. */
  origin: DOMRect | null;
  reduced: boolean;
  onClose: () => void;
}

type Phase = "opening" | "reading" | "closing";

/**
 * PERSONAL ARCHIVE. A book leaves the stack on the desk, turns to show its cover,
 * opens, and its first page grows into the editorial reader. Closing reverses it.
 */
export default function ArchiveExperience({ origin, reduced, onClose }: Props) {
  const [volId, setVolId] = useState(volumes[0].id);
  const vol = volumes.find((v) => v.id === volId) ?? volumes[0];
  const [phase, setPhase] = useState<Phase>(reduced ? "reading" : "opening");
  const backdrop = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Start pose: small, lying flat where the stack is on the desk.
  const fromStack = useCallback(() => {
    const el = book.current;
    if (!el) return {};
    const b = el.getBoundingClientRect();
    const o = origin ?? new DOMRect(window.innerWidth * 0.3, window.innerHeight * 0.6, 120, 90);
    return {
      x: o.left + o.width / 2 - (b.left + b.width / 2),
      y: o.top + o.height / 2 - (b.top + b.height / 2),
      scale: Math.max(0.12, (o.width / b.width) * 0.8),
      rotationX: 68,
      rotationY: 0,
      rotationZ: -6,
    };
  }, [origin]);

  useLayoutEffect(() => {
    if (phase !== "opening") return;
    const el = book.current;
    if (!el) return;
    const w = el.offsetWidth;
    tl.current = gsap
      .timeline({ onComplete: () => setPhase("reading") })
      .fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.6 })
      // 1–3. leaves the stack, comes forward and turns to show the cover
      .fromTo(el, { ...fromStack(), opacity: 0 }, { x: 0, y: 0, scale: 1, rotationX: 4, rotationY: -24, rotationZ: 0, opacity: 1, duration: 1.05, ease: "power3.inOut" }, 0.1)
      .to(el, { rotationY: -10, rotationX: 2, duration: 0.45, ease: "sine.inOut" })
      // 4–5. the cover opens
      .to(cover.current, { rotationY: -168, duration: 0.85, ease: "power2.inOut" }, "+=0.1")
      .to(el, { x: w / 2, rotationY: 0, rotationX: 0, duration: 0.85, ease: "power2.inOut" }, "<")
      // 6. the first page fills the screen
      .to(el, { scale: 3.2, opacity: 0, duration: 0.7, ease: "power2.in" }, "+=0.05");
    return () => {
      tl.current?.kill();
    };
  }, [phase, fromStack]);

  const close = useCallback(() => {
    if (reduced) return onClose();
    setPhase("closing");
  }, [onClose, reduced]);

  // Escape while the book is still opening: put it back right away.
  useEffect(() => {
    if (phase !== "opening") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      tl.current?.kill();
      gsap.to(".archive-xp", { opacity: 0, duration: reduced ? 0 : 0.35, onComplete: onClose });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onClose, reduced]);

  useLayoutEffect(() => {
    if (phase !== "closing") return;
    const el = book.current;
    if (!el) return;
    const w = el.offsetWidth;
    gsap.set(cover.current, { rotationY: -168 });
    tl.current = gsap
      .timeline({ onComplete: onClose })
      .fromTo(el, { x: w / 2, scale: 3.2, opacity: 0, rotationY: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" })
      .to(cover.current, { rotationY: 0, duration: 0.6, ease: "power2.inOut" })
      .to(el, { x: 0, rotationY: -20, duration: 0.6, ease: "power2.inOut" }, "<")
      .to(el, { ...fromStack(), opacity: 0, duration: 0.85, ease: "power3.inOut" })
      .to(backdrop.current, { opacity: 0, duration: 0.5 }, "-=0.45");
    return () => {
      tl.current?.kill();
    };
  }, [phase, fromStack, onClose]);

  return (
    <div className={`archive-xp is-${phase}`} role="dialog" aria-modal="true" aria-label={`${t("Personal Archive")} — Vol. ${vol.number}`}>
      <div ref={backdrop} className="archive-xp__backdrop" />
      {phase !== "reading" && (
        <div className="archive-xp__stage" onClick={() => phase === "opening" && tl.current?.progress(1)}>
          <div ref={book} className="book3d" aria-hidden="true">
            <div className="book3d__back" />
            <div className="book3d__pages" />
            <div className="book3d__first">
              <span>{t("MY WORLD / PERSONAL WRITING")}</span>
              <strong>
                {t(vol.title[0])}
                <br />
                <em>{t(vol.title[1])}</em>
              </strong>
              <span>VOL. {vol.number}</span>
            </div>
            <div ref={cover} className="book3d__cover">
              <div className="book3d__front">
                <div className="book3d__top">
                  <span>
                    WS<b>.</b>
                  </span>
                  <span className="book3d__slashes">///</span>
                </div>
                <strong>
                  <i>/</i>
                  {String(Number(vol.number)).padStart(2, "0")}
                </strong>
                <div className="book3d__bottom">
                  <span>{t(vol.coverLine)}</span>
                  <div className="book3d__footer">
                    <span>{t("PERSONAL ARCHIVE")}</span>
                    <span>VOL. {vol.number}</span>
                  </div>
                </div>
              </div>
              <div className="book3d__inside" />
            </div>
          </div>
          <p className="archive-xp__skip">{t("click to skip")}</p>
        </div>
      )}
      {phase === "reading" && <ArchiveReader key={vol.id} volume={vol} reduced={reduced} onClose={close} onVolume={setVolId} />}
    </div>
  );
}
