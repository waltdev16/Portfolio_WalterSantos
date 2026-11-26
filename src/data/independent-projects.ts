// Proyectos independientes (colección "Independent Projects").
//
// Para agregar uno: copia un bloque, cambia el slug (único) y los textos, y agrega
// las traducciones en src/i18n/locales/es.ts. La tarjeta, la página de detalle y la
// navegación Anterior / Siguiente se generan solas. Ver MAINTENANCE.txt.
//
// Reglas: solo enlaces reales (null si no existen) y ninguna imagen inventada
// (cover: null muestra un marco "Imagen pendiente").

import type { IndependentProject } from "@/types";

export const independentProjects: IndependentProject[] = [
  {
    slug: "electromagnetic-simulator",
    index: "01",
    name: "Electromagnetic Simulator",
    category: "3D Simulation · Physics",
    year: null,
    status: "deployed",
    summary:
      "An educational 3D electromagnetic crane simulator with industrial controls, interactive physics visualizations and simulated telemetry.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Three.js", "WebGL", "Chart.js", "GSAP", "MathJax", "Web Audio API"],
    cover: "/independent-projects/cover1.webp",
    detailCover: "/independent-projects/detailCover1.webp",
    repository: "https://github.com/waltdev16/Electromagnetic_Simulator",
    demo: "https://waltdev16.github.io/Electromagnetic_Simulator/",
    embed: { src: "https://waltdev16.github.io/Electromagnetic_Simulator/simulator-3d.html" },
    overview: [
      "Developed for Expotecnia 42 — Instituto Emiliani. The simulator illustrates electromagnetic principles; telemetry is simplified and does not represent validated industrial measurements.",
    ],
  },
  {
    slug: "web-development-lab",
    index: "02",
    name: "Web Development Lab",
    category: "Frontend Development",
    year: null,
    status: "deployed",
    summary:
      "A collection of practical web development exercises covering HTML, CSS, JavaScript, React components and an interactive virtual pet.",
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "Vite", "Git", "GitHub"],
    cover: "/independent-projects/cover2.webp",
    detailCover: "/independent-projects/detailCover2.webp",
    repository: "https://github.com/waltdev16/Web_Development_Lab",
    demo: "https://waltdev16.github.io/Web_Development_Lab/",
    overview: [
      "An ongoing practice archive featuring CSS exercises, React applications and a GitHub Pages gallery of selected exercises.",
    ],
  },
  {
    slug: "hydra",
    index: "03",
    name: "HYDRA",
    category: "Embedded Systems & IoT",
    year: "2025",
    status: "deployed",
    summary:
      "An intelligent rainwater harvesting and storage system integrating embedded systems, sensors, automation, IoT and an interactive 3D digital twin.",
    technologies: ["Arduino", "C++", "JavaScript", "Three.js", "Firebase", "IoT"],
    cover: "/independent-projects/hydra-cover.webp",
    detailCover: "/independent-projects/hydra-cover.webp",
    repository: "https://github.com/waltdev16/Hydra_ExpoLogros",
    demo: "https://waltdev16.github.io/Hydra_ExpoLogros/",
    // Copia local del gemelo digital (public/hydra): mismo origen y sin depender de otro sitio.
    embed: { src: "/hydra/index.html" },
    overview: [
      "Physical prototype (2025): developed as a team and presented at Expo de Logros. It monitors water level and pH with Arduino, controls the gates with servomotors, shows readings on an LCD and sends data to Firebase.",
      "Digital twin (2026): an interactive 3D simulation of the system with water collection, four storage tanks, simulated indicators, a firmware viewer and a simulated serial monitor. It runs independently of the physical hardware.",
    ],
  },
  {
    slug: "python-development-lab",
    index: "04",
    name: "Python Development Lab",
    category: "Software Development",
    year: "2026",
    status: "deployed",
    summary:
      "A collection of practical Python applications demonstrating programming fundamentals, data structures, input validation and file management.",
    technologies: ["Python", "Algorithms", "File Handling", "CLI"],
    cover: "/independent-projects/python-cover.webp",
    repository: "https://github.com/waltdev16/Python_Development_Lab",
    demo: null,
    viewer: "python-lab",
    overview: [
      "The interactive viewer runs the original exercises in the browser with Python (Pyodide), including the questions each program asks the user.",
    ],
  },
  {
    slug: "sortlyscan",
    index: "05",
    name: "SortlyScan",
    category: "Artificial Intelligence, EdTech & Sustainability",
    year: "2026",
    status: "deployed",
    summary:
      "AI-powered environmental education platform featuring waste classification, interactive learning, gamification and institutional analytics.",
    technologies: ["Next.js", "React", "TypeScript", "ONNX", "Computer Vision", "ONNX Runtime Web"],
    cover: "/independent-projects/sortlyscan-cover.webp",
    detailCover: "/independent-projects/sortlyscan-detail.webp",
    repository: "https://github.com/waltdev16/SortlyScan_ExpoTech",
    demo: "https://waltdev16.github.io/SortlyScan_ExpoTech/",
    embed: { src: "https://waltdev16.github.io/SortlyScan_ExpoTech/", allowCamera: true },
    overview: [
      "Original project (Expo Tech): developed as a team and presented at Expo Tech.",
      "Interactive version 2.0 (2026): redesigned and rebuilt individually by Walter Santos. Waste images are classified directly in the browser with an ONNX model.",
      "This version is an interactive demo with fictional institutional data. Sign-in, institutional management and data storage are demonstrations, not production services.",
    ],
  },
];

export const getIndependentProject = (slug: string) => independentProjects.find((p) => p.slug === slug);
