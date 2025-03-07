import { chip } from "./chip"
import type { Artista, res } from "./types"
import { axios } from "./utils/axios"
import { mountDatalist } from "./utils/mountDatalist"
import { mountSelect } from "./utils/mountSelect"
import { querySelector } from "./utils/querySelector"
const input = querySelector<HTMLInputElement>("#inputArtistas")
const campoArtistas = querySelector(".campoArtistas");
const selectGenero = querySelector<HTMLSelectElement>("#genero");

async function fetchGeneros(){
  const generos = (await axios.get<string[]>("/generos")).data
  return generos
}

async function  fetchArtistas(){
  const artistas = (await axios.get<Artista[]>("/artistas")).data
    return artistas
}
async function teste(){
  const artstas = await fetchArtistas()
  mountDatalist(artstas,input,"datalistArtistas") 
  const generos =await fetchGeneros()
  mountSelect(generos,selectGenero)

}
const btnMais = querySelector("#btnMais")
btnMais.addEventListener("click",()=>{
  const datalist = input.querySelector("datalist") !
  for (const data of datalist.options) {
    if(input.value.toLowerCase().match(data.value.toLowerCase())){
      if(!document.querySelector("span#q"+data.id)){
        chip(data.value,campoArtistas,data.id)     
      }
    input.value=""
    }
  }
})
interface props {
        code: string;
        error: string;
        message: string;
        statusCode: string;
      };
window.addEventListener("submit",async e=>{
  e.preventDefault()
  const  temp = querySelector<HTMLFormElement>("form");
   const form = new FormData(temp)
  const {status,data,} =  await axios.post<string|props>("/albuns",form)
  if(status === 201 || status===200){
    alert("Album cadastrado com sucesso")
    temp.reset()
  }else{
    console.log(data)
    alert(`erro ${data}`)
  }
})
window.onload=teste