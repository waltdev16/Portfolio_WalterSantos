import { t } from "../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "../../data/profile";
import { MOTION } from "../motion";
import { BackIcon } from "../ui/icons";
import "./about.css";

const AreaIcon = ({ id }: { id: string }) => (
  <svg viewBox="0 0 40 40" className="about__area-icon" aria-hidden="true">
    {id === "engineering" && (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="20" cy="20" r="6" />
        <path d="M20 5v5M20 30v5M5 20h5M30 20h5M9.4 9.4l3.5 3.5M27.1 27.1l3.5 3.5M9.4 30.6l3.5-3.5M27.1 12.9l3.5-3.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="11.5" strokeDasharray="3 3" />
      </g>
    )}
    {id === "programming" && (
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 12 6 20l8 8M26 12l8 8-8 8M22.5 9l-5 22" />
      </g>
    )}
    {id === "technology" && (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="11" y="11" width="18" height="18" rx="3" />
        <rect x="16" y="16" width="8" height="8" rx="1" />
        <path d="M16 5v6M24 5v6M16 29v6M24 29v6M5 16h6M5 24h6M29 16h6M29 24h6" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

/**
 * ABOUT ME. The camera moves in on Walter; his story slides in beside him
 * as an editorial page laid over the room.
 */
export function AboutExperience({ reduced, onClose, onOpenCertificates }: { reduced: boolean; onClose: () => void; onOpenCertificates: () => void }) {
  const root = useRef<HTMLElement>(null);
  const closing = useRef(false);

  useLayoutEffect(() => {
    const r = root.current;
    if (!r) return;
    const d = reduced ? 0 : 1;
    const tl = gsap.timeline({ delay: 0.35 * d });
    tl.fromTo(r.querySelector(".about__wash"), { opacity: 0, xPercent: 12 }, { opacity: 1, xPercent: 0, duration: 0.9 * d, ease: MOTION.ease.out })
      .fromTo(r.querySelectorAll(".about__name .line > span"), { yPercent: 110 }, { yPercent: 0, duration: 0.9 * d, stagger: 0.08, ease: MOTION.ease.out }, 0.15 * d)
      .fromTo(r.querySelectorAll("[data-reveal]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 * d, stagger: 0.06, ease: MOTION.ease.out }, 0.45 * d);
    r.querySelector<HTMLElement>(".about__close")?.focus({ preventScroll: true });
  }, [reduced]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const r = root.current;
    if (!r || reduced) return onClose();
    gsap
      .timeline({ onComplete: onClose })
      .to(r.querySelectorAll("[data-reveal], .about__name .line > span"), { opacity: 0, y: -10, duration: 0.3, stagger: 0.015, ease: MOTION.ease.in })
      .to(r.querySelector(".about__wash"), { opacity: 0, xPercent: 10, duration: 0.45, ease: MOTION.ease.in }, "-=0.15");
  }, [onClose, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <section ref={root} className="about" role="dialog" aria-modal="true" aria-labelledby="about-name">
      <div className="about__wash" aria-hidden="true" />
      <button type="button" className="about__close xp-back" onClick={close}>
        <BackIcon /> {t("Back to the garage")}
      </button>
      <div className="about__scroll">
        <header className="about__head">
          <h2 id="about-name" className="about__name">
            <span className="line">
              <span>{t("Hi, I'm")}</span>
            </span>
            <span className="line">
              <span>Walter.</span>
            </span>
          </h2>
          <p className="about__role" data-reveal>
            {t(profile.role)} · {profile.location}
          </p>
          <p className="about__intro" data-reveal>
            {t(profile.intro)}
          </p>
        </header>

        <section className="about__block" aria-labelledby="about-into">
          <h3 id="about-into" data-reveal>
            {t("What I'm into")}
          </h3>
          <ul className="about__areas">
            {profile.areas.map((a) => (
              <li key={a.id} data-reveal>
                <AreaIcon id={a.id} />
                <div>
                  <strong>{t(a.title)}</strong>
                  <p>{t(a.text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="about__block about__two" aria-label={t("Education and recognitions")}>
          <div>
            <h3 data-reveal>{t("Education")}</h3>
            {profile.education.map((e) => (
              <p key={e.title} className="about__row" data-reveal>
                <strong>{e.title}</strong>
                <span>{e.period}</span>
                <em>{t(e.detail)}</em>
              </p>
            ))}
          </div>
          <div>
            <h3 data-reveal>{t("Recognitions")}</h3>
            <ul className="about__list">
              {profile.highlights.map((h) => (
                <li key={t(h)} data-reveal>
                  {t(h)}
                </li>
              ))}
            </ul>
            <button type="button" className="about__link" data-reveal onClick={onOpenCertificates}>
              {t("See the diplomas on the wall →")}
            </button>
          </div>
        </section>

        <section className="about__block" aria-labelledby="about-next">
          <h3 id="about-next" data-reveal>
            {t("Where I'm going")}
          </h3>
          <blockquote className="about__goal" data-reveal>
            {t(profile.goals.professional)}
          </blockquote>
          <p className="about__row" data-reveal>
            <strong>{t("Next step")}</strong>
            <em>{t(profile.goals.academic)}</em>
          </p>
        </section>
      </div>
    </section>
  );
}
