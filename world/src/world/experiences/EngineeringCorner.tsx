import { t } from "../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { engineering } from "../../data/engineering";
import { gearPath } from "../scene/art/quad";
import { MOTION } from "../motion";
import { BackIcon } from "../ui/icons";
import "./engineering.css";

/**
 * ENGINEERING CORNER. A blueprint sheet beside the poster and the CAD screen,
 * with a gear pair you can drive yourself.
 */
export function EngineeringCorner({ reduced, onClose }: { reduced: boolean; onClose: () => void }) {
  const root = useRef<HTMLElement>(null);
  const driver = useRef<SVGGElement>(null);
  const driven = useRef<SVGGElement>(null);
  const [rpm, setRpm] = useState(30);
  const closing = useRef(false);
  const { gear } = engineering;
  const ratio = gear.driver.teeth / gear.driven.teeth;
  const m = 3.2; // drawing scale for the module
  const r1 = (gear.driver.teeth * m) / 2;
  const r2 = (gear.driven.teeth * m) / 2;

  useLayoutEffect(() => {
    const r = root.current;
    if (!r) return;
    const d = reduced ? 0 : 1;
    gsap.fromTo(r, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9 * d, delay: 0.4 * d, ease: MOTION.ease.inOut });
    gsap.fromTo(r.querySelectorAll("[data-reveal]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 * d, stagger: 0.05, delay: 0.9 * d });
    gsap.fromTo(r.querySelectorAll(".eng__draw"), { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 1.4 * d, delay: 0.8 * d, ease: "power2.out" });
    r.querySelector<HTMLElement>(".xp-back")?.focus({ preventScroll: true });
  }, [reduced]);

  // Turn the gears at the chosen speed. Teeth offset so they mesh.
  useEffect(() => {
    if (reduced) return;
    let a = 0;
    const tick = (_t: number, dt: number) => {
      a += (rpm * 360 * dt) / 60000;
      gsap.set(driver.current, { rotation: a, svgOrigin: "0 0" });
      gsap.set(driven.current, { rotation: -a * ratio + 180 / gear.driven.teeth, svgOrigin: `${r1 + r2} 0` });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [rpm, ratio, reduced, r1, r2, gear.driven.teeth]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reduced || !root.current) return onClose();
    gsap.to(root.current, { clipPath: "inset(0 100% 0 0)", duration: 0.6, ease: MOTION.ease.inOut, onComplete: onClose });
  }, [onClose, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <section ref={root} className="eng" role="dialog" aria-modal="true" aria-labelledby="eng-title">
      <header className="eng__head">
        <h2 id="eng-title" data-reveal>
          {t("Engineering Corner")}
        </h2>
        <button type="button" className="xp-back" onClick={close}>
          <BackIcon /> {t("Back to the garage")}
        </button>
      </header>
      <p className="eng__intro" data-reveal>
        {t(engineering.intro)}
      </p>

      <figure className="eng__fig" data-reveal>
        <svg viewBox={`${-r1 - 14} ${-r1 - 26} ${2 * r1 + 2 * r2 + 36} ${2 * r1 + 48}`} aria-label={`Gear pair: ${gear.driver.teeth} and ${gear.driven.teeth} teeth`}>
          <path className="eng__draw" d={`M${-r1 - 8} 0H${r1 + 2 * r2 + 8}M0 ${-r1 - 8}V${r1 + 8}M${r1 + r2} ${-r2 - 8}V${r2 + 8}`} />
          <g ref={driver}>
            <path className="eng__gear" d={gearPath(0, 0, gear.driver.teeth, r1 + m, m * 2.2)} />
            <circle className="eng__gear" r={r1 * 0.32} />
            <circle className="eng__pitch" r={r1} />
          </g>
          <g ref={driven}>
            <path className="eng__gear eng__gear--alt" d={gearPath(r1 + r2, 0, gear.driven.teeth, r2 + m, m * 2.2)} />
            <circle className="eng__gear eng__gear--alt" cx={r1 + r2} r={r2 * 0.38} />
            <circle className="eng__pitch" cx={r1 + r2} r={r2} />
          </g>
          <text x="0" y={-r1 - 14} textAnchor="middle">
            z = {gear.driver.teeth}
          </text>
          <text x={r1 + r2} y={-r2 - 14} textAnchor="middle">
            z = {gear.driven.teeth}
          </text>
        </svg>
        <figcaption>
          <label>
            <span>{t("Input speed")}</span>
            <input type="range" min="0" max="90" value={rpm} onChange={(e) => setRpm(Number(e.target.value))} />
          </label>
          <dl className="eng__read">
            <div>
              <dt>{t(gear.driver.label)}</dt>
              <dd>{rpm} rpm</dd>
            </div>
            <div>
              <dt>{t(gear.driven.label)}</dt>
              <dd>{Math.round(rpm * ratio)} rpm</dd>
            </div>
            <div>
              <dt>{t("Ratio")}</dt>
              <dd>{gear.driver.teeth}:{gear.driven.teeth}</dd>
            </div>
          </dl>
        </figcaption>
      </figure>

      <dl className="eng__notes">
        {engineering.notes.map((n) => (
          <div key={t(n.k)} data-reveal>
            <dt>{t(n.k)}</dt>
            <dd>{t(n.v)}</dd>
          </div>
        ))}
      </dl>

      <h3 data-reveal>{t("What I want to understand")}</h3>
      <ul className="eng__list">
        {engineering.interests.map((interest) => (
          <li key={interest} data-reveal>
            {t(interest)}
          </li>
        ))}
      </ul>
    </section>
  );
}
