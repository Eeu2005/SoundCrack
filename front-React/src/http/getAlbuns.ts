import { colorExtract } from "@/integrations/colorExtractor.ts";
import type { AlbumRes, AlbumType } from "@/types.js";
import { queryOptions } from "@tanstack/react-query";
import { Consts } from "@/env";

async function GetAlbuns(): Promise<AlbumType[]> {
  const res = await fetch(`${Consts.BASE_URL}/albuns`);
  const data = (await res.json()) as AlbumRes[];
  let a = Promise.all(
    data.map(async (e) => {
      const hex = await colorExtract(e.capa);
      return { corAlbum: hex, ...e };
    })
  );
  return a;
}

export async function getAlbum(id: string): Promise<AlbumType> {
  const res = await fetch(`${Consts.BASE_URL}/albuns/${id}`, {
    credentials: "omit",
  });
  const data = (await res.json()) as AlbumRes;
  const color = await colorExtract(data.capa);
  const reponse = { corAlbum: color, ...data };
  return reponse;
}

export const optsGetAlbums = queryOptions({
  queryKey: ["albuns"],
  queryFn: GetAlbuns,
});
