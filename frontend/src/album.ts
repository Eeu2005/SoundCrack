import type { AlbumPopulado } from "./types";
import { axios } from "./utils/axios";
import { pegarCor } from "./utils/color-thief";
import { querySelector } from "./utils/querySelector";

async function handleRequest(){
    const param = new URL(window.location.href).searchParams.get("q");
    if (!param) {
      location.href = "/pages/loja.html";
      return null
    }
    try{
  const tmp = await axios.get<AlbumPopulado>(`albuns/${param}`)
  return tmp.data
    }catch(e:any){
        if(e.response){
          console.log(e.response)
          sessionStorage.setItem("mensagen",JSON.stringify({
            type:"erro",
            mensagen:JSON.stringify(e.response.data)
          }))
        }else{
          sessionStorage.setItem(
            "mensagen",
            JSON.stringify({
              type: "erro",
              mensagen: "Erro interno"
            })
          );
        }
        location.href="/pages/loja.html"
    }
}
async function mountData() {
  console.log(axios.defaults)
  const data = await handleRequest()
  const capa = querySelector<HTMLImageElement>("#capa")
  capa.src=  `${axios.defaults.baseURL}${data!.capa}`
  pegarCor(capa,querySelector("body"))
  const table = querySelector<HTMLTableElement>("tbody")
 for(const musica of data!.musicas){
   const tr = document.createElement("tr");
   tr.innerHTML = `
  <th scope="col">${musica.nome}</th>
<td>${musica.artistas.map((e) => e.nome).join(" ▪ ")}</td>`;
table.appendChild(tr)
 }
}
 window.onload = mountData;