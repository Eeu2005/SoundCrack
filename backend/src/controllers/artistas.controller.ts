import { modelArtista } from "../models/artista.model.ts";
import type { Artista, Id, User } from "../types.js";
import { fazerArquivo } from "../helpers/fazerArquivo.ts";
import { modelAlbum } from "../models/albun.model.ts";

export async function getArtistas():Promise<Artista[]>{
  return await modelArtista.find()
}

export async function searchArtist(name:string){
  const regex = new RegExp(`^${name}`)
  console.log(regex)
  const artista = await modelArtista.find({nome:regex}).select("nome")
  return artista
}
export async function getOneArtista(id:string):Promise<Artista>{
  let artista =  await modelArtista.findById(id)
    if(!artista){
      throw new Error("Artista não encontrdo");
    } 
    const albuns =await  modelAlbum.find({artistas:artista._id})
    let albumAritstas = Object.assign(artista.toObject(),{albuns}) 
    console.log(albuns)
    return albumAritstas;
}
export  function setArtista(nome:string,arquivo:{fieldname:string,buffer:Buffer}) {
    const caminho = fazerArquivo(arquivo.buffer,arquivo.fieldname)
    return new modelArtista({imagem:caminho,nome}).save()
}