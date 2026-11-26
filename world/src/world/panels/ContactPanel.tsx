import { t } from "../i18n";
import { contactLinks } from "../../data/profile";

export function ContactPanel() {
  return (
    <ul className="panel__list">
      {contactLinks.map((l) => (
        <li key={l.id}>
          <strong>{t(l.label)}</strong>
          {l.href ? (
            <a href={l.href} aria-label={`${t("Open")} ${t(l.label)}`} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              {t("Open")}
            </a>
          ) : (
            <span>{t("Coming soon")}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
