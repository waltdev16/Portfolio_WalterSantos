import { t } from "../i18n";
import type { ZoneDef, ZoneId } from "../config/scene";
import { BookIcon, CameraIcon, CarIcon, ChatIcon, CubeIcon, CupIcon, FolderIcon, GearIcon, NoteIcon, PersonIcon, RosetteIcon, TerminalIcon } from "../ui/icons";

export const zoneIcon: Record<ZoneId, (p: { className?: string }) => React.JSX.Element> = {
  music: NoteIcon,
  about: PersonIcon,
  developer: TerminalIcon,
  archive: BookIcon,
  moments: CameraIcon,
  break: CupIcon,
  engineering: GearIcon,
  projects: FolderIcon,
  certificates: RosetteIcon,
  fortune: CubeIcon,
  contact: ChatIcon,
  silvia: CarIcon,
};

/**
 * Permanent label on each clickable object, so visitors can see where to click.
 * Small and quiet; it brightens with its object on hover and is a button too.
 */
export function HotspotLabel({
  zone,
  hovered,
  hidden,
  onSelect,
  onHover,
}: {
  zone: ZoneDef;
  hovered: boolean;
  hidden: boolean;
  onSelect: (z: ZoneDef) => void;
  onHover: (id: ZoneId | null) => void;
}) {
  return (
    <div className="hlabel-anchor" style={{ left: zone.anchor.x, top: zone.anchor.y }}>
      <button
        type="button"
        className={`hlabel${hovered ? " is-hover" : ""}`}
        tabIndex={-1}
        aria-hidden={hidden || undefined}
        onClick={() => onSelect(zone)}
        onPointerEnter={() => onHover(zone.id)}
        onPointerLeave={() => onHover(null)}
      >
        <i aria-hidden="true" />
        {t(zone.label)}
      </button>
    </div>
  );
}
