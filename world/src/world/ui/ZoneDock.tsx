import { t } from "../i18n";
import { ZONES, type ZoneId } from "../config/scene";
import { zoneIcon } from "../scene/HotspotPill";

/** Phones: every object of the room within thumb reach, since the room scrolls sideways. */
export function ZoneDock({ onGo }: { onGo: (id: ZoneId) => void }) {
  return (
    <nav className="dock" aria-label={t("Room objects")}>
      <ul>
        {ZONES.map((z) => {
          const Icon = zoneIcon[z.id];
          return (
            <li key={z.id}>
              <button type="button" onClick={() => onGo(z.id)}>
                <Icon className="dock__icon" />
                {t(z.label)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
