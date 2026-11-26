import { t } from "../i18n";
import { COVERS, toPoints } from "../config/scene";
import { SILHOUETTES } from "../config/silhouettes";
import { localizedProjects, type ProjectLanguage, type WorldProject } from "../../data/projects";
import { sound } from "../audio/sound";

type CoverId = keyof typeof COVERS;

const outlineToClipPath = (x: number, y: number, w: number, h: number, pts: readonly (readonly [number, number])[]) =>
  `polygon(${pts
    .map(([px, py]) => `${(((px - x) / w) * 100).toFixed(2)}% ${(((py - y) / h) * 100).toFixed(2)}%`)
    .join(",")})`;

interface Props {
  selected: WorldProject["id"] | null;
  hovered: WorldProject["id"] | null;
  disabled: boolean;
  onSelect: (id: WorldProject["id"]) => void;
  onHover: (id: WorldProject["id"] | null) => void;
}

/**
 * The project sleeves in the crate. Each sleeve is its own cut-out: the light
 * copy grows a little from its base (no gap is revealed) and the hitbox is
 * the sleeve's own outline.
 */
export function ProjectLights({ selected, hovered, lang }: Pick<Props, "selected" | "hovered"> & { lang: ProjectLanguage }) {
  return (
    <>
      {(Object.keys(COVERS) as CoverId[]).map((id) => {
        const s = SILHOUETTES[COVERS[id]];
        const src = s.src.replace("/lit/", `/${lang}/`);
        const state = selected === id ? "selected" : hovered === id ? "hover" : "idle";
        const clipPath = outlineToClipPath(s.x, s.y, s.w, s.h, s.outline);
        return (
          <div
            key={id}
            className={`light light--cover is-${state}`}
            style={{ left: s.x, top: s.y, width: s.w, height: s.h, clipPath, WebkitClipPath: clipPath }}
            aria-hidden="true"
          >
            <img src={src} alt="" width={s.w} height={s.h} draggable={false} />
            <span className="light__sheen" style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }} />
          </div>
        );
      })}
    </>
  );
}

export function ProjectHits({ disabled, onSelect, onHover, lang }: Pick<Props, "disabled" | "onSelect" | "onHover"> & { lang: ProjectLanguage }) {
  return (
    <g role="group" aria-label={t("Projects")}>
      {(Object.keys(COVERS) as CoverId[]).map((id) => {
        const p = localizedProjects(lang).find((x) => x.id === id);
        if (!p) return null;
        const s = SILHOUETTES[COVERS[id]];
        const open = () => {
          if (!disabled) onSelect(id);
        };
        return (
          <polygon
            key={id}
            points={toPoints(s.outline)}
            className="object-hit"
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={`Project: ${p.title}`}
            onClick={open}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            }}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              onHover(id);
              sound.play("hover");
            }}
            onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
            onFocus={() => onHover(id)}
            onBlur={() => onHover(null)}
          />
        );
      })}
    </g>
  );
}
