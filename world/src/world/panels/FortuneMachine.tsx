import { t } from "../i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { fortuneCategories, fortunes, type FortuneCategory } from "../../data/fortunes";
import { sound } from "../audio/sound";

const pool = (Object.keys(fortunes) as FortuneCategory[]).flatMap((c) => fortunes[c].map((text) => ({ c, text })));

/** Fortune.exe: boots, then prints a random fortune. Ask for another as often as you like. */
export function FortuneMachine({ reduced }: { reduced: boolean }) {
  const [i, setI] = useState(() => Math.floor(Math.random() * pool.length));
  const [shown, setShown] = useState("");
  const [booting, setBooting] = useState(!reduced);
  const timer = useRef<number | undefined>(undefined);
  const f = pool[i];

  // type the fortune out
  useEffect(() => {
    if (booting) {
      timer.current = window.setTimeout(() => setBooting(false), 900);
      return () => clearTimeout(timer.current);
    }
    if (reduced) {
      setShown(t(f.text));
      return;
    }
    let n = 0;
    setShown("");
    const id = window.setInterval(() => {
      n += 1;
      setShown(t(f.text).slice(0, n));
      if (n >= t(f.text).length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [f, booting, reduced]);

  const another = useCallback(() => {
    sound.play("select");
    setI((cur) => {
      let next = cur;
      while (pool.length > 1 && next === cur) next = Math.floor(Math.random() * pool.length);
      return next;
    });
  }, []);

  return (
    <div className="fortune">
      <div className="fortune__screen" aria-hidden="true">
        {booting ? (
          <p className="fortune__boot">
            {t("booting fortune.exe")}<span className="fortune__dots">…</span>
          </p>
        ) : (
          <>
            <p className="fortune__cat">{t(fortuneCategories[f.c])}</p>
            <p className="fortune__text">
              {shown}
              <span className="fortune__caret" aria-hidden="true" />
            </p>
          </>
        )}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {!booting && shown === t(f.text) ? `${t(fortuneCategories[f.c])}: ${shown}` : ""}
      </p>
      <button type="button" className="fortune__btn" onClick={another} disabled={booting}>
        {t("Another fortune")}
      </button>
    </div>
  );
}
