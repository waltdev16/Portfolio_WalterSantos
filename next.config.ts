// Configuración de Next.js: imágenes remotas, Walter's World en /world,
// cabeceras de seguridad y Tailwind con Turbopack.

import type { NextConfig } from "next";

// 01. Cabeceras de seguridad para todas las rutas.
// - SAMEORIGIN: el propio sitio puede incrustar /hydra; otros sitios no pueden incrustar el portafolio.
// - La cámara solo se delega a las demos de GitHub Pages (SortlyScan la usa para clasificar residuos).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: 'camera=(self "https://waltdev16.github.io"), microphone=(), geolocation=(), payment=(), usb=()',
  },
];

// 02. Configuración
const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    // portadas oficiales de los álbumes de la sección Music
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co", pathname: "/image/**" }],
  },
  partialPrefetching: true,
  // Walter's World: app Vite independiente, compilada en public/world
  async rewrites() {
    return [{ source: "/world", destination: "/world/index.html" }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
