import { colorExtract } from "@/integrations/colorExtractor.ts";
import type { AlbumRes, AlbumType } from "@/types.js";
import { queryOptions } from "@tanstack/react-query";
import { Consts } from "@/env";
const transformUrl= (album:AlbumRes)=>{
  return album.capa=`${Consts.VITE_BASE_URL}${album.capa}`
}
async function GetAlbuns(): Promise<AlbumType[]> {
  const res = await fetch(`${Consts.VITE_BASE_URL}/albuns`);
  const data = await res.json() as AlbumRes[];
  data.forEach(transformUrl)
  console.log(data);
  let a = await Promise.all(
    data.map(async (e) => {
      const hex = await colorExtract(e.capa);
      return { corAlbum: hex, ...e };
    })
  );
  return a;
}

export async function getAlbum(id: string): Promise<AlbumType> {
  const res = await fetch(`${Consts.VITE_BASE_URL}/albuns/${id}`, {
  
  });
  const data = await res.json() as AlbumRes;
  transformUrl(data)
  console.log(data)
  const color = await colorExtract(data.capa);
  const reponse = { corAlbum: color, ...data };
  return reponse;
}

export const optsGetAlbums = queryOptions({
  queryKey: ["albuns"],
  queryFn: GetAlbuns,
});

