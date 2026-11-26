// Datos de los álbumes de la sección de música.
/**
 * MUSIC / CURRENT ROTATION
 *
 * Covers are the official artwork served by Spotify (og:image of each album
 * page). Next.js optimizes and caches them through /_next/image, so the
 * WebGL carousel reads them from the same origin (no CORS issues).
 *
 * Links were checked against each album page on Spotify and Apple Music.
 * To change an album, edit only this file.
 */

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  /** Official artwork URL (square). */
  cover: string;
  spotify: string;
  appleMusic: string;
}

export const albums: Album[] = [
  {
    id: "sayonara",
    title: "SAYONARA",
    artist: "Álvaro Díaz",
    year: 2024,
    cover: "https://i.scdn.co/image/ab67616d0000b273af1e2e143561cf4df9941f5b",
    spotify: "https://open.spotify.com/album/7kfPf285KnlWUTbqaB1jnI",
    appleMusic: "https://music.apple.com/us/album/sayonara/1742298801",
  },
  {
    id: "todos-los-dias-todo-el-dia",
    title: "TODOS LOS DÍAS TODO EL DÍA",
    artist: "Latin Mafia",
    year: 2024,
    cover: "https://i.scdn.co/image/ab67616d0000b2735e92f2d649b34dbf56cf2264",
    spotify: "https://open.spotify.com/album/0DMDbZtZT028siJ0GEdLrQ",
    appleMusic: "https://music.apple.com/us/album/1774040006",
  },
  {
    id: "formula-vol-1",
    title: "Fórmula, Vol. 1",
    artist: "Romeo Santos",
    year: 2011,
    cover: "https://i.scdn.co/image/ab67616d0000e1a31d6d3d544ca5b46453fafbb6",
    spotify: "https://open.spotify.com/album/6a3RDPcFamZvFCi8VeXWkK",
    appleMusic: "https://music.apple.com/us/album/471342193",
  },
  {
  id: "formula-vol-2",
  title: "Fórmula, Vol. 2",
  artist: "Romeo Santos",
  year: 2014,
  cover: "https://i.scdn.co/image/ab67616d0000e1a3daf6b6b3f482dd7a24b3a6eb",
  spotify: "https://open.spotify.com/search/Romeo%20Santos%20Formula%20Vol%202",
  appleMusic: "https://music.apple.com/us/album/804225637",
  },
  {
    id: "cosa-nuestra",
    title: "Cosa Nuestra",
    artist: "Rauw Alejandro",
    year: 2024,
    cover: "https://i.scdn.co/image/ab67616d0000b273a6224f2f93c0ab4b2e01b44b",
    spotify: "https://open.spotify.com/album/0aX0UXrHG2ceYIxTQcqJdA",
    appleMusic: "https://music.apple.com/us/album/1775462846",
  },
  {
    id: "un-verano-sin-ti",
    title: "Un Verano Sin Ti",
    artist: "Bad Bunny",
    year: 2022,
    cover: "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72",
    spotify: "https://open.spotify.com/album/3RQQmkQEvNCY4prGKE6oc5",
    appleMusic: "https://music.apple.com/us/album/1622045624",
  },
  {
    id: "debi-tirar-mas-fotos",
    title: "DeBÍ TiRAR MáS FOToS",
    artist: "Bad Bunny",
    year: 2025,
    cover: "https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411",
    spotify: "https://open.spotify.com/album/5K79FLRUCSysQnVESLcTdb",
    appleMusic: "https://music.apple.com/us/album/1787022393",
  },
  {
    id: "yhlqmdlg",
    title: "YHLQMDLG",
    artist: "Bad Bunny",
    year: 2020,
    cover: "https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0",
    spotify: "https://open.spotify.com/album/5lJqux7orBlA1QzyiBGti1",
    appleMusic: "https://music.apple.com/us/album/1500776322",
  },
  {
    id: "the-last",
    title: "The Last",
    artist: "Aventura",
    year: 2009,
    cover: "https://i.scdn.co/image/ab67616d0000b273791d6daf3d05cde2a646c3cd",
    spotify: "https://open.spotify.com/album/57tmzh0hsnWU8znnvEWJbe",
    appleMusic: "https://music.apple.com/us/album/the-last/314891159",
  },
  {
    id: "gods-project",
    title: "God's Project",
    artist: "Aventura",
    year: 2005,
    cover: "https://i.scdn.co/image/ab67616d0000b2737d72c6a663f165c6c7d809c5",
    spotify: "https://open.spotify.com/album/7rLLeuXcwlB5JqmLGQFpiz",
    appleMusic: "https://music.apple.com/us/album/gods-project/160405546",
  },
  {
    id: "felicilandia",
    title: "Felicilandia",
    artist: "Álvaro Díaz",
    year: 2021,
    cover: "https://i.scdn.co/image/ab67616d0000b2734385062efd655ededc0d2caa",
    spotify: "https://open.spotify.com/album/7jg09IJJXi1eigVLZja2hN",
    appleMusic: "https://music.apple.com/us/album/felicilandia/1591325942",
  },
  {
    id: "vice-versa",
    title: "VICE VERSA",
    artist: "Rauw Alejandro",
    year: 2021,
    cover: "https://i.scdn.co/image/ab67616d0000b273f793c0c53727d8c5c950f809",
    spotify: "https://open.spotify.com/album/2Nt6MDJXfoxQ22tIQgWXIh",
    appleMusic: "https://music.apple.com/us/album/vice-versa/1596868386",
  },
];

/** Same-origin, optimized URL for a cover (lets WebGL read the pixels). */
export function coverSrc(url: string, width = 640) {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;
}
