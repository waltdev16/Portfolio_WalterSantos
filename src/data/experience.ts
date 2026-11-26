// Datos de las experiencias.

import type { ExperienceItem } from "@/types";

/**
 * Experiences, newest first. Add work experience later with kind: "work".
 * Outcomes must be verifiable — point to something a visitor can check.
 */
export const experience: ExperienceItem[] = [
  {
    id: "sortlyscan-expotech",
    ref: "E-01",
    name: "SortlyScan",
    category: "Team project",
    context: "Expo Tech - Programa ¡Supérate! Fundación Frech",
    period: "2026",
    kind: "project",
    description:
      "Team development of SortlyScan, an environmental education platform that uses artificial intelligence to classify waste, presented at Expo Tech.",
    responsibilities: [
      "Took part in the original team project presented at Expo Tech.",
      "Later redesigned and rebuilt the platform individually as an interactive 2.0 demo.",
    ],
    outcomes: [
      "Original version presented at Expo Tech.",
      "Interactive 2.0 demo published on GitHub Pages, with waste classification in the browser and fictional institutional data.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "ONNX", "ONNX Runtime Web", "Computer Vision"],
    // portada de la versión interactiva 2.0
    image: { src: "/experience/ExpoTech.webp", alt: "SortlyScan home page" },
    link: { label: "View project", href: "/projects/independent/sortlyscan" },
  },
  {
    id: "hydra-2025",
    ref: "E-02",
    name: "HYDRA",
    category: "Academic",
    context: "Expo de Logros - ¡Supérate! F. Frech",
    period: "2025",
    kind: "project",
    description:
      "Collaborative development of an intelligent rainwater harvesting and storage system integrating embedded systems, electronics, automation and IoT to promote sustainable water management.",
    responsibilities: [
      "Collaborated in the design, development and construction of the physical prototype.",
      "Implemented Arduino-based programming for water level monitoring and automated gate control.",
      "Contributed to the integration of electronic components, sensors and monitoring systems.",
    ],
    outcomes: [
      "Functional physical prototype presented at Expo de Logros 2025.",
      "Automated water level monitoring and gate control using ultrasonic sensors and servomotors.",
      "Real-time LCD visualization and firmware for pH monitoring and wireless data transmission.",
    ],
    technologies: [
      "Arduino UNO",
      "Arduino MKR",
      "C++",
      "Firebase",
      "IoT",
      "Tinkercad",
    ],
    image: {
      src: "/experience/ExpoLogros.webp",
      alt: "HYDRA team presenting the rainwater harvesting prototype at Expo de Logros 2025",
    },
    link: {
      label: "View project",
      href: "/projects/independent/hydra",
    },
  },
];
