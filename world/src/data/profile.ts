/**
 * About me, the terminal and contact all read from here.
 * Same facts as the portfolio; links stay null until they are added
 * (they show as "coming soon").
 */

export const profile = {
  name: "Walter Santos",
  fullName: "Walter Enrique Santos Rivera",
  role: "Aspiring Systems Engineer",
  location: "El Salvador",
  intro:
    "I'm a student from El Salvador working toward Systems Engineering. I'm interested in how software, artificial intelligence and data can be combined to solve real problems.",
  interests: ["Software development", "Artificial intelligence", "Machine learning", "Data analysis", "Web development"],

  /** The three areas shown in About me. */
  areas: [
    {
      id: "engineering",
      title: "Engineering",
      text: "How systems work, from gears to software: the parts, how they connect and why they fail.",
    },
    {
      id: "programming",
      title: "Programming",
      text: "Python for data and machine learning; TypeScript and React for the web, including this room.",
    },
    {
      id: "technology",
      title: "Technology",
      text: "Artificial intelligence, machine learning and data analysis applied to real problems.",
    },
  ],

  /** Education and programs (confirmed only). */
  education: [
    {
      title: "Programa ¡Supérate!",
      period: "2026",
      detail: "10-week course on algorithms, AI, machine learning and web development.",
    },
  ],

  /** Short list of credentials for About me; the full set lives in certificates.ts. */
  highlights: [
    "Microsoft Office Specialist: Excel Associate & Expert",
    "TOEIC Listening & Reading — Silver (2025, program diploma)",
    "WRO El Salvador — RoboMission Junior (2024)",
    "Empower Youth — First edition (2024)",
  ],

  goals: {
    academic: "Study Systems Engineering at university.",
    professional:
      "Keep training in engineering, gain professional experience and, eventually, build something of my own: projects with intention, curiosity and real use.",
  },
};

export interface ContactLink {
  id: "email" | "github" | "linkedin" | "portfolio";
  label: string;
  href: string | null; // e.g. "mailto:walter@example.com"
}

export const contactLinks: ContactLink[] = [
  { id: "email", label: "Email", href: "mailto:waltersantosdev16@gmail.com" },
  { id: "github", label: "GitHub", href: "https://github.com/waltdev16" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/waltersantos-tech" },
  { id: "portfolio", label: "Portfolio", href: "/" },
];

/**
 * Skills for the terminal's `skills` command. Every item points to where it was used.
 */
export const skills: { group: string; items: { name: string; where: string }[] }[] = [
  {
    group: "Programming",
    items: [
      { name: "Python", where: "Regresión Lineal (scikit-learn)" },
      { name: "TypeScript", where: "Portfolio · Walter's World" },
      { name: "JavaScript", where: "Web projects" },
    ],
  },
  {
    group: "Web",
    items: [
      { name: "React", where: "Portfolio · Walter's World" },
      { name: "Next.js", where: "Portfolio" },
      { name: "Vite + GSAP", where: "Walter's World" },
      { name: "REST APIs", where: "Portfolio contact endpoint" },
    ],
  },
  {
    group: "AI / Machine learning",
    items: [
      { name: "Linear regression", where: "¡Supérate! course" },
      { name: "Decision trees", where: "¡Supérate! course" },
      { name: "K-Means · KNN", where: "¡Supérate! course" },
    ],
  },
  {
    group: "Data",
    items: [
      { name: "Microsoft Excel", where: "MOS Associate & Expert (Credly)" },
      { name: "Hotspot analysis", where: "Hotspots Comerciales" },
    ],
  },
  {
    group: "Tools",
    items: [
      { name: "Git · GitHub", where: "Version control" },
      { name: "Vercel", where: "Deployment" },
    ],
  },
];
