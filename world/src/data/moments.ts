/**
 * CAPTURED MOMENTS — the camera on the desk.
 *
 * Put photos in world/public/moments (source folder; npm run world:build copies
 * them to the portfolio) and fill a slot:
 *   { src: "/world/moments/expo-tech-1.webp", caption: "…", kind: "photo" }
 * Slots with `src: null` show as empty frames ready for a real file.
 */

export interface Moment {
  id: string;
  src: string | null;
  caption: string;
  kind: "photo" | "capture";
}

export const moments: Moment[] = [
  { id: "expo-tech-1", src: "/world/moments/expo-tech-1.webp", caption: "Expo Tech", kind: "capture" },
  { id: "expo-tech-2", src: "/world/moments/expo-tech-2.webp", caption: "Expo Tech", kind: "photo" },
  { id: "expo-tech-3", src: "/world/moments/expo-tech-3.webp", caption: "Expo Tech", kind: "photo" },
  { id: "expo-logros-1", src: "/world/moments/expo-logros-1.webp", caption: "Expo de Logros", kind: "photo" },
  { id: "expo-logros-2", src: "/world/moments/expo-logros-2.webp", caption: "Expo de Logros", kind: "photo" },
  { id: "expo-logros-3", src: "/world/moments/expo-logros-3.webp", caption: "Expo de Logros", kind: "photo" },
  { id: "expo-logros-4", src: "/world/moments/expo-logros-4.webp", caption: "Expo de Logros", kind: "photo" },
];
