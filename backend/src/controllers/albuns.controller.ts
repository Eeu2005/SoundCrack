import { modelAlbum } from "../models/albun.model.ts";
import type { AlbumPopulado, FileProps, Musica, PropsAlbum, User } from "../types.js";
import { modelArtista } from "../models/artista.model.ts";
import { fazerArquivo } from "../helpers/fazerArquivo.ts";
import { isValidObjectId, Mongoose, Types } from "mongoose";
import { modelUsers } from "../models/users.model.ts";
import { StatusAlbum } from "../helpers/emails.ts";

type pagination={
  page:number,
  per_page:number
}
const padrao:pagination={
  page:1,
  per_page:10,
}

export async function getAlbumAdmin({page,per_page}:pagination=padrao) {
  const album = await modelAlbum.find<AlbumPopulado>({

  }).skip(per_page*page).limit(page);
  return album;
}
export async function getOneAlbumAdmin(id: string): Promise<AlbumPopulado> {

  const album = await modelAlbum
    .findById<AlbumPopulado>(id)
    .populate("musicas.artistas");
  if (!album) throw new Error("Album não encontrado");
  return album;
}
export async function getAlbum({ page, per_page }: pagination = padrao): Promise<
  AlbumPopulado[]
> {
  const album = await modelAlbum
    .find<AlbumPopulado>({ aprovado: true })
    .limit(per_page)
    .skip(per_page * (page-1))
  return album;
}
export async function getOneAlbum(id: string): Promise<AlbumPopulado> {
  const busca = !isValidObjectId(id) ? {nome:id,aprovado:true}:{_id:id,aprovado:true}
  const album = await modelAlbum
    .findOne<AlbumPopulado>(busca)
    .populate("musicas.artistas");
  if (!album) throw new Error("Album não encontrado");
  return album;
}

export async function getRandonAlbum():Promise<AlbumPopulado>{
  const album = await modelAlbum.aggregate<AlbumPopulado>([
    {$lookup:{from:"artistas",as:"artistas",foreignField:"_id",localField:"artistas"}},
    { $sample: { size: 1 } },
  ]);
  
  return album[0]
}


export async function setAlbum(album: PropsAlbum, files:FileProps[]) {
// console.log(album)
if (!(await modelUsers.exists({ _id: album.publicante }))) {
  throw new Error("usuario não encontrado")
}
  if (Array.isArray(album.artistas)) {
    for (const e of album.artistas) {
      if (!Types.ObjectId.isValid(e)) {
        throw new Error("codigo invalido");
      }
      if (!(await modelArtista.exists({ _id: e }))) {
        throw new Error("não existe artista com esse id:" + e);
      }
    }
  } else {
    if (!Types.ObjectId.isValid(album.artistas)) {
      throw new Error("codigo invalido");
    }
    if (!(await modelArtista.exists({ _id: album.artistas }))) {
      throw new Error("não existe artista com esse id:" + album.artistas);
    }
    album.artistas = [album.artistas];
  }
console.log(album);
  const capaCaminho = fazerArquivo(files[0].buffer,files[0].fieldname);
  const discoCaminho = fazerArquivo(files[1].buffer, files[1].fieldname);
 return  await new modelAlbum({
    preco:album.preco,
    nome: album.nome,
    artistas: album.artistas,
    genero:album.genero,
    capa:capaCaminho,
    disco:discoCaminho,
    publicante:album.publicante
  }).save()
}

export async function putMusic(musicas:Musica[],id:string,userId:string){
  const album = await modelAlbum.findOne({_id:id,publicante:userId})
  console.log(album)
  if(!album){
    throw new Error("Album não encontrado")
  } 
  album.depopulate("artistas")

  for(const musica of musicas){
    if (!musica.artistas) {
      musica.artistas =album.artistas 
      continue
    }
    for(const artista of musica.artistas){
      if(!modelArtista.exists({_id:artista}))
        throw new Error("Artista desconhecido" +artista)
    }
  }
  await album.updateOne({$set:{
    musicas
  }})
}
export async function getGeneros(){
  const generos = await modelAlbum.distinct("genero")
  return generos
}
export async function  atualizarSituacao(id:string,status:boolean){
  const album = await modelAlbum.findById(id).populate("publicante");
  if(!album){
    throw new Error("Album não encontrado")
  }
  if(album.musicas.length === 0){
    throw new Error("Album sem musicas")
  }
  await album.updateOne({$set:{aprovado:status}})
  StatusAlbum(album,album.publicante)
  console.log(album)
  return album.aprovado
}
