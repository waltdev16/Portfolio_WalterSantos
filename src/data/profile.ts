// Información personal (nombre, rol, ubicación, enlaces) y datos generales del sitio.

import type { Profile } from "@/types";

/**
 * Personal data. Every `null` renders as a visible "pending" slot.
 * Fill these in instead of editing components.
 */
export const profile: Profile = {
  name: "Walter Santos",
  role: "Aspiring Systems Engineer",
  tagline:
    "Building digital solutions through software, artificial intelligence and continuous learning.",
  location: "El Salvador",
  coordinates: "13.7° N  89.2° W",
  email: "waltersantosdev16@gmail.com",
  github: "https://github.com/waltdev16",
  linkedin: "https://www.linkedin.com/in/waltersantos-tech",
  photo: "/images/profile.webp", // e.g. "/images/walter.jpg"
  intro:
    "I'm a student from El Salvador working toward Systems Engineering. I'm interested in how software, artificial intelligence and data can be combined to solve real problems. Over the last ten weeks of the ¡Supérate! program I worked with algorithms, machine learning models and the development of a web application with its own backend.",
  introHighlights: ["Systems Engineering", "software, artificial intelligence and data", "a web application with its own backend"],
  interests: [
    "Software development",
    "Artificial intelligence",
    "Machine learning",
    "Data analysis",
    "Web development",
  ],
  academicGoals: "Study Systems Engineering at university.",
  professionalGoals: "Become a Systems Engineer, gain professional experience, and develop technology solutions that generate a positive impact, with the long-term vision of building my own technology company.",
  strengths: [
    "Analytical thinking",
    "Problem-solving",
    "Intellectual curiosity",
    "Creativity and innovation",
    "Adaptability",
    "Self-directed learning",
    "Teamwork",
  ],
};

// Identidad del sitio (pestaña del navegador, SEO y tarjetas para redes).
// La URL pública se define con NEXT_PUBLIC_SITE_URL; en Vercel, si falta, se usa su dominio de producción.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "walt.dev",
  author: "Walter Santos",
  title: "walt.dev",
  headline: "walt.dev — Walter Santos",
  description:
    "Portfolio of Walter Santos, a student from El Salvador building software, machine learning projects and interactive web experiences.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
};
