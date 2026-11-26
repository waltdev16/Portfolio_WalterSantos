import { t } from "../i18n";
import type { KeyboardEvent } from "react";
import { toPoints, type Point, type SilKey, type ZoneDef, type ZoneId } from "../config/scene";
import { SILHOUETTES } from "../config/silhouettes";

/*
 * Selection system, four separate parts:
 *  1. ObjectHit    — invisible hitbox (the object's own outline) for pointer, touch and keyboard.
 *  2. ObjectLight  — the object's cut-out drawn over the art, only visible while lit.
 *  3. hover        — `.is-hover`: warm glow hugging the silhouette + a sheen passing over it.
 *  4. selected     — `.is-selected`: brighter pulse and a slight move toward the viewer.
 * Nothing draws an outline or a box.
 */

interface HitProps {
  zone: ZoneDef;
  pts: Point[];
  disabled: boolean;
  onSelect: (zone: ZoneDef) => void;
  onHover: (id: ZoneId | null) => void;
  /** Only the first hitbox of a zone is a tab stop. */
  tabbable: boolean;
}

export function ObjectHit({ zone, pts, disabled, onSelect, onHover, tabbable }: HitProps) {
  const onKey = (e: KeyboardEvent) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect(zone);
    }
  };
  return (
    <polygon
      points={toPoints(pts)}
      className="object-hit"
      role="button"
      tabIndex={disabled || !tabbable ? -1 : 0}
      aria-label={t(zone.tip)}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onSelect(zone)}
      onKeyDown={onKey}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(zone.id)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
      onFocus={() => onHover(zone.id)}
      onBlur={() => onHover(null)}
    />
  );
}

export function ObjectLight({ id, sil, state }: { id: ZoneId; sil: SilKey; state: "idle" | "hover" | "selected" }) {
  const s = SILHOUETTES[sil];
  return (
    <div className={`light light--${id} light--${sil} is-${state}`} style={{ left: s.x, top: s.y, width: s.w, height: s.h }} aria-hidden="true">
      <img src={s.src} alt="" width={s.w} height={s.h} draggable={false} />
      <span className="light__sheen" style={{ maskImage: `url(${s.src})`, WebkitMaskImage: `url(${s.src})` }} />
    </div>
  );
}
