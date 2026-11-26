// Datos de certificados, diplomas e insignias.

import type { Credential, CredentialCategory } from "@/types";

/**
 * Certifications, badges and diplomas shown in the carousel.
 * Add an object to add a card — the component doesn't need changes.
 * Order = display order: diplomas first, Microsoft badges last.
 *
 * Only documents Walter already has. Not listed on purpose (not issued yet):
 * the official TOEIC 2026 certificate, the high-school diploma and the
 * ¡Supérate! graduation diploma.
 */
export const credentials: Credential[] = [
  {
    id: "spelling-bee-2026",
    name: "Spelling Bee Champion",
    issuer: "Centro ¡Supérate! Fundación Freund",
    category: "languages",
    kind: "diploma",
    year: "2026",
    description: "Winner of the 2026 Spelling Bee competition in the Senior category.",
    image: "/certifications/spelling-bee-2026.webp",
    width: 2317,
    height: 1822,
    verifyUrl: null,
  },
  {
    id: "toeic-silver-2025",
    name: "TOEIC Listening & Reading — Silver",
    issuer: "Centro ¡Supérate! Fundación Frech",
    category: "languages",
    kind: "diploma",
    year: "2025",
    description: "Diploma for achieving a Silver TOEIC Listening & Reading result in 2025.",
    note: "Program diploma issued by the center — not the official ETS score report.",
    image: "/certifications/toeic-silver-2025.webp",
    width: 2400,
    height: 1875,
    verifyUrl: null,
  },
  {
    id: "toeic-bronze-2024",
    name: "TOEIC Listening & Reading — Bronze",
    issuer: "Centro ¡Supérate! Merlet",
    category: "languages",
    kind: "diploma",
    year: "2024",
    description: "Diploma for achieving a Bronze TOEIC Listening & Reading result in 2024.",
    note: "Program diploma issued by the center — not the official ETS score report.",
    image: "/certifications/toeic-bronze-2024.webp",
    width: 2400,
    height: 1795,
    verifyUrl: null,
  },
  {
    id: "empower-youth-2024",
    name: "Empower Youth — First edition",
    issuer: "Programa Empower Youth",
    category: "extracurricular",
    kind: "diploma",
    year: "2024",
    date: "November 28, 2024 · La Libertad, Antiguo Cuscatlán",
    description:
      "Completed the first edition of the Empower Youth course, a program designed to develop leadership skills and an interest in entrepreneurship.",
    image: "/certifications/empower-youth-2024.webp",
    width: 2400,
    height: 1898,
    verifyUrl: null,
  },
  {
    id: "wro-robomission-junior-2024",
    name: "WRO El Salvador — RoboMission Junior",
    issuer: "WRO El Salvador · National Robotics Olympiad",
    category: "extracurricular",
    kind: "diploma",
    year: "2024",
    date: "August 31, 2024 · San Salvador",
    description: "Participation diploma in the RoboMission challenge, Junior category.",
    image: "/certifications/wro-robomission-junior-2024.webp",
    width: 1608,
    height: 2400,
    verifyUrl: null,
  },
  {
    id: "glasswing-clubes-2023",
    name: "Extracurricular Clubs 2023",
    issuer: "Glasswing International",
    category: "extracurricular",
    kind: "diploma",
    year: "2023",
    description: "Recognition diploma for participating in the 2023 extracurricular clubs (with USAID).",
    image: "/certifications/glasswing-clubes-2023.webp",
    width: 2400,
    height: 1948,
    verifyUrl: null,
  },
  {
    "id": "naufest-ai-for-impact-2026",
    "name": "NAUFest 2026 — Challenge #AIForImpact",
    "issuer": "Junior Achievement Americas · HP",
    "category": "extracurricular",
    "kind": "diploma",
    "year": "2026",
    "description": "Completed the NAUFest 2026 #AIForImpact Challenge, developing a proposed solution to a real-world problem using artificial intelligence.",
    "image": "/certifications/naufest-ai-for-impact-2026.webp",
    "width": 1584,
    "height": 1226,
    "verifyUrl": null
  },
  // Microsoft badges go last
  {
    id: "mos-excel-associate",
    name: "Microsoft Office Specialist: Excel Associate",
    subtitle: "Microsoft 365 Apps",
    issuer: "Microsoft",
    category: "microsoft",
    kind: "badge",
    year: null,
    image: "/certifications/mos-excel-associate.png",
    width: 600,
    height: 600,
    verifyUrl: "https://www.credly.com/badges/814563ef-d5b0-42d4-8593-6bf5b3a3e8f0",
    credentialId: "814563ef-d5b0-42d4-8593-6bf5b3a3e8f0",
  },
  {
    id: "mos-excel-expert",
    name: "Microsoft Office Specialist: Excel Expert",
    subtitle: "Microsoft 365 Apps",
    issuer: "Microsoft",
    category: "microsoft",
    kind: "badge",
    year: null,
    image: "/certifications/mos-excel-expert.png",
    width: 600,
    height: 600,
    verifyUrl: "https://www.credly.com/badges/55fc9f47-a7a8-4d24-92e8-6c1bc84a5e12",
    credentialId: "55fc9f47-a7a8-4d24-92e8-6c1bc84a5e12",
  },
];

export const credentialFilters: { id: "all" | CredentialCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "languages", label: "Languages" },
  { id: "extracurricular", label: "Extracurricular" },
  { id: "microsoft", label: "Microsoft" },
];

export const categoryLabel: Record<CredentialCategory, string> = {
  microsoft: "Microsoft certification",
  languages: "Language",
  extracurricular: "Extracurricular",
};
