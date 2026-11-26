import { t } from "../i18n";
import { localizedProjects, type ProjectLanguage, type WorldProject } from "../../data/projects";

/** Project sheet. The index lists every project, including the Portfolio sleeve. */
export function ProjectSheet({ lang, selected, onSelect }: { lang: ProjectLanguage; selected: WorldProject["id"] | null; onSelect: (id: WorldProject["id"]) => void }) {
  const projects = localizedProjects(lang);
  const p = projects.find((x) => x.id === selected);
  const index = (
    <ol className="sheet__index" aria-label={t("Projects")}>
      {projects.map((x, i) => (
        <li key={x.id}>
          <button type="button" className={x.id === selected ? "is-current" : ""} aria-current={x.id === selected || undefined} onClick={() => onSelect(x.id)}>
            <span>{String(i + 1).padStart(2, "0")} /</span> {x.title}
          </button>
        </li>
      ))}
    </ol>
  );
  if (!p) {
    return (
      <>
        <p className="panel__lead">{lang === "es" ? "Selecciona un álbum o un proyecto de la lista." : "Pick a sleeve from the crate, or a project from the list."}</p>
        {index}
      </>
    );
  }
  return (
    <>
      {index}
      <h3 className="panel__subtitle">
        {p.title}
        {p.subtitle && <small>{p.subtitle}</small>}
      </h3>
      {p.summary && <p className="panel__lead">{p.summary}</p>}
      {p.stack && (
        <ul className="panel__tags">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
      {(p.link || p.repository) && <div className="sheet__links">
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener noreferrer">
            {t("Open project ↗")}
          </a>
        )}
        {p.repository && (
          <a href={p.repository} target="_blank" rel="noopener noreferrer">
            {t("Source code ↗")}
          </a>
        )}
      </div>}
    </>
  );
}
