import type { AlbumPopulado } from "./types";
import { axiosInstace } from "./utils/axios";
import { pegarCor } from "./utils/color-thief";
import { querySelector } from "./utils/querySelector";


async function showAlbuns(){
  let artista = querySelector<HTMLDivElement>("#artistas");
  let album = querySelector<HTMLDivElement>("#album");
  let capaAlbum = querySelector<HTMLImageElement>("#capaAlbum");
  let capaDistorcida =  querySelector<HTMLImageElement>("#capaDistorcida");
 
  const albumSortido:AlbumPopulado =(await axiosInstace.get("/albuns/rand")).data
     artista.innerText = `De: ${[albumSortido.artistas.map(ar=>ar.nome)].join(" - ")}`;
     album.innerText = `${albumSortido.nome}`;
     capaAlbum.src = import.meta.env.VITE_URLBACKEND+albumSortido.capa;
     capaAlbum.alt = `capa album ${albumSortido.nome}`;
     capaDistorcida.src =  import.meta.env.VITE_URLBACKEND  + albumSortido.capa;
     pegarCor(capaAlbum,document.body)
}
window.onload=showAlbuns