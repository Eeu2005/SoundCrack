import type { AlbumPopulado } from "./types";
import { axios } from "./utils/axios";
import { pegarCor } from "./utils/color-thief";
import { querySelector } from "./utils/querySelector";
async function fetchAlbuns (){
  const albuns = (await axios.get<AlbumPopulado[]>("/albuns")).data
  return albuns
}

async function  criarAlbuns () {
  const albuns= await fetchAlbuns()
  const main =querySelector<HTMLDivElement>("main")
 
  for(const album of albuns){
    const div = document.createElement("div")
    div.classList.add("album")
    div.innerHTML = `
    <img src="${album.capa}" alt="${album.nome}">
<h1>${album.nome}</h1>
<h2>Artistas:${album.artistas.map(e=>e.nome).join("-")}</h2>
<p>Preço: R$${album.preco}</p>
<a href=./albuns/index.html?q=${album._id} class="buttom">Saiba Mais</a>
    `;
     pegarCor(div.querySelector("img"),div)
    main.appendChild(div)
  }
}
window.onload = criarAlbuns