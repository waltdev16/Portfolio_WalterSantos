/**
 * Compila Walter's World (la app Vite de ./world) y la copia a public/world,
 * donde Next.js la sirve en /world.
 *
 *   npm run world:build          compila siempre
 *   node scripts/build-world.mjs --if-missing
 *                                solo si public/world todavía no existe (npm run dev)
 *
 * public/world es un resultado generado (está en .gitignore): el código fuente es
 * ./world. "npm run build" ejecuta este script antes de next build (prebuild),
 * así que el despliegue en Vercel lo reconstruye solo.
 */

// 01. Importaciones y rutas
import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const world = join(root, "world");
const target = join(root, "public", "world");

// 02. Modo "solo si falta"
if (process.argv.includes("--if-missing") && existsSync(join(target, "index.html"))) {
  process.exit(0);
}

// 03. Dependencias (instalación reproducible con el package-lock.json de ./world)
if (!existsSync(join(world, "node_modules"))) {
  execSync("npm ci", { cwd: world, stdio: "inherit" });
}

// 04. Compilación y copia
execSync("npm run build", { cwd: world, stdio: "inherit" });
rmSync(target, { recursive: true, force: true });
cpSync(join(world, "dist"), target, { recursive: true });
console.log("Walter's World → public/world");
