import { t } from "../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { zoneById, type ZoneId } from "../config/scene";
import type { WorldProject, ProjectLanguage } from "../../data/projects";
import { zoneIcon } from "../scene/HotspotPill";
import { BackIcon } from "./icons";
import { ProjectSheet } from "../panels/ProjectSheet";
import { FortuneMachine } from "../panels/FortuneMachine";
import { ContactPanel } from "../panels/ContactPanel";

interface Props {
  lang: ProjectLanguage;
  zone: ZoneId;
  compact: boolean;
  reduced: boolean;
  selectedProject: WorldProject["id"] | null;
  onSelectProject: (id: WorldProject["id"]) => void;
  onClose: () => void;
}

/** Focus Mode panel: drawn like a card pinned in the room, with a clear way back. */
export function FocusOverlay({ lang, zone, compact, reduced, selectedProject, onSelectProject, onClose }: Props) {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const z = zoneById(zone);
  const Icon = zoneIcon[zone];
  const side = compact || z.panel === "bottom" ? "bottom" : z.panel;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from =
      side === "bottom" ? { yPercent: 18 } : side === "top" ? { y: -24 } : side === "left" ? { x: -28 } : { x: 28 };
    gsap.fromTo(
      el,
      { ...from, autoAlpha: 0 },
      { x: 0, y: 0, yPercent: 0, autoAlpha: 1, duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.35, ease: "power3.out" },
    );
    titleRef.current?.focus({ preventScroll: true });
  }, [zone, side, reduced]);

  // Reverse of the entrance, then back to the room.
  const closing = useRef(false);
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const el = ref.current;
    if (!el || reduced) return onClose();
    const to = side === "bottom" ? { yPercent: 14 } : side === "top" ? { y: -20 } : side === "left" ? { x: -24 } : { x: 24 };
    gsap.to(el, { ...to, autoAlpha: 0, duration: 0.35, ease: "power2.in", onComplete: onClose });
  }, [onClose, reduced, side]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <section ref={ref} className={`panel panel--${side}`} role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <header className="panel__head">
        <span className="panel__icon">
          <Icon />
        </span>
        <h2 id="panel-title" ref={titleRef} tabIndex={-1}>
          {t(z.title)}
        </h2>
      </header>
      <div className="panel__body">
        {zone === "projects" && <ProjectSheet lang={lang} selected={selectedProject} onSelect={onSelectProject} />}
        {zone === "fortune" && <FortuneMachine reduced={reduced} />}
        {zone === "contact" && <ContactPanel />}
      </div>
      <button type="button" className="panel__back" onClick={close}>
        <BackIcon className="panel__back-icon" />
        {t("Back to the garage")}
      </button>
    </section>
  );
}
