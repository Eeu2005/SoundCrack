import { Consts } from "@/env.ts";
import { type UseBaseQueryOptions } from "@tanstack/react-query";
const transformUrl = (album: searchArtista) => {
  return (album.imagem = `${Consts.VITE_BASE_URL}${album.imagem}`);
};
export type searchArtista= {
    "_id": string,
    "nome": string,
    "imagem": string
  }
async function searchArtistas(nome:string) {
  const res =await fetch(`${Consts.VITE_BASE_URL}/artistas/search/${nome}`)
  const data = await res.json() as searchArtista[]
  data.forEach(transformUrl);
  return data
}
export const optsSeartchArt= function(nome:string):UseBaseQueryOptions<searchArtista[]>{
  return {
    queryKey: ["search", "artistas",nome],
    queryFn: ()=>searchArtistas(nome),
  };
}