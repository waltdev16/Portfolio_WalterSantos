import { t } from "../../i18n";
import type { CSSProperties } from "react";
import { certificates } from "../../../data/certificates";
import { FRAMES } from "../../config/scene";
import { sound } from "../../audio/sound";
import { quadTransform } from "./quad";
import { PAPER } from "../../config/silhouettes";

/**
 * Real diplomas printed on the paper of the six frames: the document is
 * multiplied onto the paper colour of the art and lit like the rest of the wall.
 * Clicking one lifts it off the wall into the large viewer (Showcase).
 */
export function WallFrames({ disabled, hidden, onOpen }: { disabled: boolean; hidden: string | null; onOpen: (index: number, from: HTMLElement) => void }) {
  const W = 120;
  const H = 92;
  return (
    <>
      {FRAMES.map((quad, index) => {
        const c = certificates[index];
        if (!c) return null;
        const frameClass = c.kind === "badge" ? "is-badge" : c.height > c.width ? "is-portrait" : "is-landscape";
        const frameStyle = {
          width: W,
          height: H,
          transform: quadTransform(W, H, quad),
          background: PAPER,
          ["--slot-inset" as string]: c.kind === "badge" ? "9px 18px 10px" : c.height > c.width ? "5px 15px 6px 10px" : "5px 8px 6px",
          ["--img-scale" as string]: c.kind === "badge" ? "0.97" : c.height > c.width ? "1.14" : "1.07",
        } as CSSProperties;
        return (
          <button
            key={c.id}
            type="button"
            data-cert={c.id}
            className={`wall-frame ${frameClass}${hidden === c.id ? " is-lifted" : ""}`}
            style={frameStyle}
            tabIndex={disabled ? -1 : 0}
            aria-label={`${t("View")}: ${t(c.name)}`}
            onPointerEnter={() => sound.play("hover")}
            onClick={(e) => onOpen(index, e.currentTarget)}
          >
            <span className="wall-frame__mat">
              <img src={c.image} alt="" draggable={false} />
            </span>
            <span className="wall-frame__light" />
          </button>
        );
      })}
    </>
  );
}
