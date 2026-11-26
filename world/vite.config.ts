import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Mounted inside the portfolio at /world (see ../scripts/build-world.mjs).
// `npm run dev` opens http://localhost:5173/world/
export default defineConfig({
  base: "/world/",
  plugins: [react()],
  server: { open: "/world/", port: 5173 },
});
