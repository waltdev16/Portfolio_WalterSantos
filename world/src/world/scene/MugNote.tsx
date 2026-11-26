import { t } from "../i18n";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MOTION } from "../motion";

/** LITTLE BREAK: a small note that rises from the gyroscope. Not a full-screen panel. */
export function MugNote({ text, onNext }: { text: string | null; onNext: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (text && ref.current) gsap.fromTo(ref.current, { y: 10, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: MOTION.select, ease: "back.out(2)" });
  }, [text]);
  return (
    <div className="break-note-anchor" aria-live="polite">
      {text && (
        <button ref={ref} type="button" className="break-note" onClick={onNext} aria-label={`${text} — show another`}>
          <span className="break-note__label">{t("LITTLE BREAK")}</span>
          <span>{text}</span>
          <small>{t("another ↻")}</small>
        </button>
      )}
    </div>
  );
}
