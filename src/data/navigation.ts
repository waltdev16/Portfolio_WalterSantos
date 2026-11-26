// Secciones que aparecen en la barra de navegación y en el pie de página.

export const sections = [
  { id: "about", label: "About", code: "002" },
  { id: "experience", label: "Experience", code: "003" },
  { id: "projects", label: "Projects", code: "004" },
  { id: "skills", label: "Skills", code: "005" },
  { id: "education", label: "Education", code: "006" },
  { id: "music", label: "Music", code: "007" },
  { id: "contact", label: "Contact", code: "008" },
] as const;

export type SectionId = (typeof sections)[number]["id"] | "top";
