import { t } from "../../i18n";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { volumes, type Volume } from "../../../data/archive";
import { Backdrop, LineArt } from "./LineArt";

/** Where the visitor stopped reading, per volume (kept while the page is open). */
const lastScroll = new Map<string, number>();

/** Personal Archive reader — garage edition: black, white, thin rules, red accents. */
export function ArchiveReader({ volume, reduced, onClose, onVolume }: { volume: Volume; reduced: boolean; onClose: () => void; onVolume: (id: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<string>(volume.chapters[0].id);
  const [progress, setProgress] = useState(0);
  const words = [volume.lead, ...volume.chapters.flatMap((c) => c.paragraphs)].join(" ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  const vi = volumes.findIndex((v) => v.id === volume.id);
  const nextVol = volumes[vi + 1];

  useLayoutEffect(() => {
    const r = root.current;
    if (!r) return;
    r.scrollTop = lastScroll.get(volume.id) ?? 0;
    r.querySelector<HTMLElement>(".pa-back")?.focus({ preventScroll: true });
    if (reduced) return;
    gsap.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo(r.querySelectorAll(".pa-head > *, .pa-toc"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "power3.out", delay: 0.1 });
  }, [reduced, volume.id]);

  // Index follows the chapter being read; thin red bar shows reading progress.
  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)), {
      root: r,
      rootMargin: "-20% 0px -60% 0px",
    });
    r.querySelectorAll(".pa-ch").forEach((s) => io.observe(s));
    const onScroll = () => {
      lastScroll.set(volume.id, r.scrollTop);
      setProgress(Math.min(1, r.scrollTop / Math.max(1, r.scrollHeight - r.clientHeight)));
    };
    r.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    // chapters slide in as they arrive
    const reveal = reduced
      ? null
      : new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              reveal?.unobserve(e.target);
              gsap.fromTo(e.target, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
            }),
          { root: r, rootMargin: "0px 0px -10% 0px" },
        );
    r.querySelectorAll(".pa-ch, .pa-quote").forEach((s) => reveal?.observe(s));
    return () => {
      io.disconnect();
      reveal?.disconnect();
      r.removeEventListener("scroll", onScroll);
    };
  }, [reduced, volume.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const jump = (id: string) => {
    root.current?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={root} className="pa">
      <Backdrop />
      <header className="pa-top">
        <span className="pa-mark">
          WS<span>.</span>
          <em>{t("MY WORLD")}</em>
          <em className="pa-top__sub">{t("/ PERSONAL ARCHIVE")}</em>
        </span>
        <span className="pa-top__vol">VOL. {volume.number}</span>
        <button type="button" className="pa-back" onClick={onClose}>
          <span aria-hidden="true">←</span> {t("BACK TO THE GARAGE")}
        </button>
        <span className="pa-slashes" aria-hidden="true">
          ///
        </span>
      </header>

      <div className="pa-body">
        <aside className="pa-toc">
          <p className="pa-toc__title">
            {t("ÍNDICE")} <i />
          </p>
          <nav aria-label={t("Chapters")}>
            <ol>
              {volume.chapters.map((c, i) => (
                <li key={c.id}>
                  <button type="button" className={current === c.id ? "is-active" : ""} aria-current={current === c.id || undefined} onClick={() => jump(c.id)}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {t(c.short)}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="pa-progress" aria-label={`${t("Read")} ${Math.round(progress * 100)}%`}>
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
          <p className="pa-toc__meta">~ {minutes} MIN · VOL. {volume.number}</p>
        </aside>

        <article className="pa-article">
          <div className="pa-head">
            <div className="pa-row">
              <button type="button" className="pa-link" onClick={onClose}>
                ← WRITING
              </button>
              <span>VOL. {volume.number}</span>
            </div>
            <p className="pa-kicker">{t("MY WORLD / PERSONAL WRITING")}</p>
            <h2>
              {t(volume.title[0])}
              <br />
              <em>{t(volume.title[1])}</em>
            </h2>
            <p className="pa-lead">{t(volume.lead)}</p>
          </div>

          {volume.chapters.map((c, i) => (
            <Fragment key={c.id}>
              <section className="pa-ch" id={c.id} aria-labelledby={`${c.id}-t`}>
                <div className="pa-ch__text">
                  <p className="pa-ch__num">
                    <span>/</span>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="pa-ch__label">{t(c.label)}</p>
                  <h3 id={`${c.id}-t`}>{t(c.title)}</h3>
                  {c.paragraphs.map((p, k) => (
                    <p key={k}>{t(p)}</p>
                  ))}
                </div>
                <LineArt kind={c.art} />
              </section>
              {volume.quote.after === c.id && (
                <blockquote className="pa-quote">
                  <p>“{t(volume.quote.text)}”</p>
                </blockquote>
              )}
            </Fragment>
          ))}

          <footer className="pa-end">
            <button type="button" className="pa-link" onClick={onClose}>
              {t("← FIN DE LA NOTA")}
            </button>
            {nextVol ? (
              <button type="button" className="pa-next" onClick={() => onVolume(nextVol.id)}>
                {t("SIGUIENTE")} <span className="pa-end__n">{nextVol.number}</span> <strong>— {nextVol.title.join(" ")}</strong> <span className="pa-end__arrow">→</span>
              </button>
            ) : (
              <p className="pa-next" title={t(volume.next.note)}>
                {t("SIGUIENTE")} <span className="pa-end__n">{volume.next.title.split(" ")[0]}</span> <strong>{t(volume.next.title).replace(/^\S+\s*/, "")}</strong>{" "}
                <span className="pa-end__arrow">→</span>
              </p>
            )}
          </footer>
        </article>
      </div>

      <footer className="pa-foot">
        <span>
          <em>///</em> WS<span className="pa-dot">.</span>
        </span>
        <span>
          {t("MY WORLD")} <i>/</i> {t("WRITING")} <i>/</i> VOL. {volume.number}
        </span>
      </footer>
    </div>
  );
}
