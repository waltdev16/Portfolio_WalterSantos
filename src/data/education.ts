// Datos de la trayectoria académica.

import type { EducationItem } from "@/types";

/**
 * Academic journey (studies and programs). Certifications, badges and
 * language credentials live in credentials.ts.
 * Never list a university degree that hasn't been earned.
 */
export const education: EducationItem[] = [
  {
    id: "bachillerato",
    title: "Bachillerato General",
    institution: "Instituto Emiliani",
    period: "2026",
    kind: "school",
    detail: "Academic preparation for higher education.",
    confirmed: true,
  },
    {
    id: "superate",
    title: "Programa ¡Supérate!",
    institution: "Centro ¡Supérate! Fundación Frech",
    period: "2024 - 2026",
    kind: "program",
    detail: "Complementary education in English, information technology, programming, leadership and personal development.",
    confirmed: true,
  },
  // Complementary courses: add them here with kind: "course" once confirmed.
];
