/**
 * Fundas de proyectos en la caja del garaje (mismo orden que la ilustración).
 *
 * `title` y `subtitle` coinciden con el arte de cada funda. Lo que no se conoce
 * queda en null.
 * `link` hace funcionar el botón "Open project" (Live Demo); `repository`, el de GitHub.
 */

export interface WorldProject {
  id: "hotspots" | "regresion" | "toeic" | "academic" | "race";
  title: string;
  subtitle: string | null;
  summary: string | null;
  stack: string[] | null;
  link: string | null;
  repository: string | null;
}

export type ProjectLanguage = "en" | "es";

type Localized = { en: string; es: string };

interface ProjectEntry extends Omit<WorldProject, "title" | "subtitle" | "summary"> {
  title: Localized;
  subtitle: Localized | null;
  summary: Localized | null;
}

// Orden de las fundas en la escena
const entries: ProjectEntry[] = [
  {
    id: "regresion",
    title: { en: "Linear Regression", es: "Regresión Lineal" },
    subtitle: null,
    summary: {
      en: "Linear regression model that analyzes study hours and grades, with input validation, predictions and charts.",
      es: "Modelo de regresión lineal que analiza la relación entre horas de estudio y calificaciones. Incluye validación de entradas, predicciones y visualización gráfica.",
    },
    stack: ["Python", "scikit-learn"],
    link: null,
    repository: "https://github.com/waltdev16/Linear_Regression",
  },
  {
    id: "toeic",
    title: { en: "TOEIC Speaking Practice", es: "Práctica TOEIC Speaking" },
    subtitle: { en: "Questions 8–10", es: "Preguntas 8–10" },
    summary: {
      en: "Interactive TOEIC Speaking practice for questions 8–10, with timed exercises and vocabulary support.",
      es: "Aplicación interactiva de práctica para TOEIC Speaking, preguntas 8 a 10, con ejercicios cronometrados, apoyo de vocabulario y dinámica para participantes.",
    },
    stack: ["React", "TypeScript"],
    link: null,
    repository: null,
  },
  {
    id: "hotspots",
    title: { en: "Commercial Hotspots", es: "Hotspots Comerciales" },
    subtitle: null,
    summary: {
      en: "Geospatial analysis of commercial establishments in El Salvador using OpenStreetMap, K-Means and KNN to identify clusters and evaluate proposed locations.",
      es: "Análisis geoespacial de establecimientos comerciales en El Salvador. Utiliza datos de OpenStreetMap, K-Means y KNN para identificar concentraciones y evaluar ubicaciones propuestas.",
    },
    stack: ["Python", "OpenStreetMap", "K-Means", "KNN", "Folium"],
    link: "https://waltdev16.github.io/Hotspots_Comerciales/",
    repository: "https://github.com/waltdev16/Hotspots_Comerciales",
  },
  {
    id: "academic",
    title: { en: "Academic Habits", es: "Hábitos Académicos" },
    subtitle: null,
    summary: {
      en: "Machine learning analysis of 500 synthetic student records using K-Means to identify study habit groups and KNN to classify academic outcomes. The results are for educational purposes only.",
      es: "Análisis de 500 registros sintéticos de estudiantes mediante K-Means para identificar grupos de hábitos de estudio y KNN para clasificar resultados académicos. Los resultados tienen fines educativos.",
    },
    stack: ["Python", "Pandas", "NumPy", "scikit-learn", "Matplotlib", "Jupyter"],
    link: null,
    repository: "https://github.com/waltdev16/Academic_Habits",
  },
  {
    id: "race",
    title: { en: "Race Maze", es: "Race Maze" },
    subtitle: null,
    summary: {
      en: "Pixel-art racing game with procedurally generated mazes using DFS, shortest-path assistance using BFS, customizable vehicles, coin collection and progressive levels.",
      es: "Juego de carreras pixel art con laberintos generados mediante DFS, asistencia de rutas cortas mediante BFS, vehículos personalizables, monedas y niveles progresivos.",
    },
    stack: ["HTML", "CSS", "JavaScript", "Canvas", "DFS", "BFS"],
    link: "https://waltdev16.github.io/Race_Maze/",
    repository: "https://github.com/waltdev16/Race_Maze",
  },
];

/** Proyectos con los textos en el idioma elegido. */
export function localizedProjects(lang: ProjectLanguage): WorldProject[] {
  return entries.map((entry) => ({
    ...entry,
    title: entry.title[lang],
    subtitle: entry.subtitle?.[lang] ?? null,
    summary: entry.summary?.[lang] ?? null,
  }));
}
