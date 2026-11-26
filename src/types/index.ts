// Tipos de TypeScript de todos los datos del portafolio (proyectos, experiencia, certificados, etc.).
/**
 * Content model for the portfolio.
 * `null` means "not provided yet": components render a visible
 * placeholder instead of inventing a value.
 */

export type Maybe<T> = T | null;

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  /** Approximate coordinates, used only as a blueprint decoration. */
  coordinates: string;
  email: Maybe<string>;
  github: Maybe<string>;
  linkedin: Maybe<string>;
  /** Path inside /public, e.g. "/images/walter.jpg" */
  photo: Maybe<string>;
  intro: string;
  /** Phrases of `intro` that get a highlight */
  introHighlights: string[];
  interests: string[];
  academicGoals: Maybe<string>;
  professionalGoals: Maybe<string>;
  strengths: Maybe<string[]>;
}

export type ProjectStatus = "documenting" | "complete" | "deployed" | "in-progress" | "prototype";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface EvidenceItem {
  /** Caption shown under the frame */
  caption: string;
  /** Path inside /public. null renders a labeled placeholder frame. */
  src: Maybe<string>;
  alt: string;
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  module: string;
  period: Maybe<string>;
  status: ProjectStatus;
  /** Cover image for the project card, inside /public/projects (e.g. "/projects/linear-regression.webp"). */
  cover?: Maybe<string>;
  /** Short, factual summary of what the activity is about. */
  summary: string;
  problem: Maybe<string>;
  objective: Maybe<string>;
  technologies: Maybe<string[]>;
  /** Neutral explanation of the method used (how the technique works). */
  methodology: string[];
  implementation: Maybe<string[]>;
  results: Maybe<string[]>;
  evidence: EvidenceItem[];
  files: ProjectLink[];
  repository: Maybe<string>;
  demo: Maybe<string>;
  learnings: Maybe<string[]>;
  /** Optional key figures shown as cards (e.g. R², MSE). */
  metrics?: { label: string; value: string; caption: string; icon?: "chart" | "layers" | "function" }[];
  /** Optional code excerpt shown in the Implementation block. */
  code?: { language: string; snippet: string };
  /** Optional worked example: an input and the model's output. */
  prediction?: { inputLabel: string; input: string; outputLabel: string; output: string };
  /** Optional dataset facts. */
  dataset?: { records: string; variables: string };
}

export interface ExperienceItem {
  id: string;
  /** Reference shown on the card, e.g. "E-01" */
  ref: string;
  name: string;
  /** Short category label, e.g. "Academic program" */
  category: string;
  /** Organization or context */
  context: string;
  period: Maybe<string>;
  kind: "academic" | "project" | "collaboration" | "work";
  description: string;
  responsibilities: Maybe<string[]>;
  /** Only results a visitor can check (a page, a feature, a document). */
  outcomes: Maybe<string[]>;
  technologies: Maybe<string[]>;
  /** image shown in the experience card (real screenshot or cover) */
  image?: { src: string; alt: string } | null;
  /** Optional link to where the result can be verified. */
  link?: { label: string; href: string };
}

export interface SkillGroup {
  id: string;
  title: string;
  icon: "code" | "globe" | "brain" | "database" | "wrench" | "users";
  items: {
    name: string;
    /** Where this skill was used — the justification for listing it. */
    evidence?: string;
  }[];
}

export interface EducationItem {
  id: string;
  title: string;
  institution: Maybe<string>;
  period: Maybe<string>;
  kind: "school" | "program" | "course";
  detail: Maybe<string>;
  /** false = slot prepared but details not yet confirmed */
  confirmed: boolean;
}

/** Carousel filter groups */
export type CredentialCategory = "microsoft" | "languages" | "extracurricular";

export interface Credential {
  id: string;
  name: string;
  /** Second line, e.g. "Microsoft 365 Apps" */
  subtitle?: string;
  issuer: string;
  category: CredentialCategory;
  /** badge = square digital badge; diploma = scanned document */
  kind: "badge" | "diploma";
  /** Year shown on the card, only when it is on the document */
  year: Maybe<string>;
  /** Full date as printed on the document, if any */
  date?: string;
  /** Short factual description of what the document certifies */
  description?: string;
  /** Clarification shown in the detail view (e.g. "program diploma, not the official score report") */
  note?: string;
  /** Image inside /public/certifications. null renders a labeled placeholder. */
  image: Maybe<string>;
  /** Pixel size of the image (prevents layout shift) */
  width?: number;
  height?: number;
  /** Official verification URL (Credly, issuer site). null hides the button. */
  verifyUrl: Maybe<string>;
  credentialId?: string;
}

/**
 * Proyecto independiente (personal o experimental), para la colección
 * "Independent Projects". Los campos en null se muestran como pendientes.
 */
export interface IndependentProject {
  slug: string;
  index: string;
  name: string;
  category: string;
  year: Maybe<string>;
  status: ProjectStatus;
  summary: string;
  technologies: string[];

  /** Portada del listado de proyectos (ruta dentro de /public). */
  cover: Maybe<string>;

  /** Portada de la página de detalles; también es la imagen de espera del visor. */
  detailCover?: Maybe<string>;

  repository: Maybe<string>;
  /** Live Demo pública (se abre en una pestaña nueva). */
  demo: Maybe<string>;

  /**
   * Aplicación incrustada en la portada de detalle (iframe). Solo se carga en
   * la página del proyecto. allowCamera habilita la cámara dentro del iframe.
   */
  embed?: { src: string; allowCamera?: boolean };

  /** Visor propio del portafolio en lugar de portada o iframe. */
  viewer?: "python-lab";

  /** Párrafos de "Project overview". Si falta, se usa summary. */
  overview?: string[];
}
