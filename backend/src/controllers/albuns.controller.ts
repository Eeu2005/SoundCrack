import { modelAlbum } from "../models/albun.model.ts";
import type { AlbumPopulado, FileProps, Musica, PropsAlbum } from "../types.js";
import { modelArtista } from "../models/artista.model.ts";
import { fazerArquivo } from "../helpers/fazerArquivo.ts";
import { Types } from "mongoose";
import { setArtista } from "./artistas.controller.ts";

export async function getAlbumAdmin() {
  const album = await modelAlbum.find<AlbumPopulado>();
  return album;
}
export async function getOneAlbumAdmin(id: string): Promise<AlbumPopulado> {
  const album = await modelAlbum
    .findById<AlbumPopulado>(id)
    .populate("musicas.artistas");
  if (!album) throw new Error("Album não encontrado");
  return album;
}
export async function getAlbum() :Promise<AlbumPopulado[]> {
  const album = await modelAlbum.find<AlbumPopulado>({aprovado:true});
  return album;
}
export async function getOneAlbum(id: string): Promise<AlbumPopulado> {
  const album = await modelAlbum
    .findOne<AlbumPopulado>({_id:id,aprovado:true})
    .populate("musicas.artistas");
  if (!album) throw new Error("Album não encontrado");
  return album;
}

export async function getRandonAlbum():Promise<AlbumPopulado>{
  const album = await modelAlbum.aggregate<AlbumPopulado>([
    {$lookup:{from:"artistas",as:"artistas",foreignField:"_id",localField:"artistas"}},
    { $sample: { size: 1 } },
  ]);
  if(!album){
    console.log(album)
    return getRandonAlbum()
  }
  return album[0]
}


export async function setAlbum(album: PropsAlbum, files:FileProps[]) {
// console.log(album)
  if(Array.isArray(album.artistas)){
     for (const e of album.artistas) {
       if (!Types.ObjectId.isValid(e)) {
         throw new Error("codigo invalido");
       }
       if (!(await modelArtista.exists({ _id: e }))) {
         throw new Error("não existe artista com esse id:" + e);
       }
     }
 }else{
    if (!Types.ObjectId.isValid(album.artistas)) {
      throw new Error("codigo invalido");
    }
    if (!(await modelArtista.exists({ _id: album.artistas }))) {
      throw new Error("não existe artista com esse id:" + album.artistas);
    }
    album.artistas = [album.artistas]
 }
  if(album.novoArtistas){
   // console.log(album);
    if(Array.isArray(album.novoArtistas)){
      for (const e of album.novoArtistas) {
        if ((await modelArtista.exists({ nome: e }))) {
          throw new Error("Artista já existe:" + e);
        }else{
          const artista = await  setArtista(e,files[0])
          console.log(artista)  
          album.artistas.push(artista._id)
        }
      }
    }else{
      if ((await modelArtista.exists({ nome: album.novoArtistas }))) {
        throw new Error("Artista já existe:" + album.novoArtistas);
      }else{
        const artista = await  setArtista(album.novoArtistas,files[0])
        album.artistas.push(artista.toObject()._id)
      }
    }
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
    disco:discoCaminho
  }).save()
}

export async function putMusic(musicas:Musica[],id:string){
  const album = await modelAlbum.findById(id)
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
export async function  atualizarSituacao(id:string){
  const album = await modelAlbum.findById(id)
  if(!album){
    throw new Error("Album não encontrado")
  }
  if(album.musicas.length === 0){
    throw new Error("Album sem musicas")
  }
  await album.updateOne({$set:{aprovado:!album.aprovado}})
  return album.aprovado
}
