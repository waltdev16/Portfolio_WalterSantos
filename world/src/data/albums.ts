/**
 * Music corner: the records on Walter's shelf.
 * Links were checked on Spotify and Apple Music. Nothing plays automatically:
 * visitors open the album on the service they prefer.
 * Edit this file to change the collection.
 */

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  /** Official square artwork (Spotify CDN). */
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
    id: "saturno",
    title: "SATURNO",
    artist: "Rauw Alejandro",
    year: 2022,
    cover: "https://i.scdn.co/image/ab67616d0000b273ee607f4ec65e7c54610be8b1",
    spotify: "https://open.spotify.com/album/5AcRssiG0Zqu3lqYW7hMoM",
    appleMusic: "https://music.apple.com/us/album/1665293359",
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
    id: "nadie-sabe",
    title: "nadie sabe lo que va a pasar mañana",
    artist: "Bad Bunny",
    year: 2023,
    cover: "https://i.scdn.co/image/ab67616d0000b2732ea1f035463d11e1fc3b193d",
    spotify: "https://open.spotify.com/album/4FftCsAcXXD1nFO9RFUNFO",
    appleMusic: "https://music.apple.com/us/album/1710982865",
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
