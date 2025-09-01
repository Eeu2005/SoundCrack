
import { hashSync } from "bcrypt"
import { env } from "./env.js"
import { downloadImage } from "./seed/downloadImage.js"
import albuns from "./seed/seedAlbuns.json" with {type:"json"}
import userSeed from "./seed/userSeed.json" with {type:"json"}
import { modelAlbum } from "./src/models/albun.model.js"
import { modelArtista } from "./src/models/artista.model.js"
import { modelUsers } from "./src/models/users.model.js"
import type { PropsAlbum } from "./src/types.js"
import {connect}from"mongoose"

const conn = await connect(env.CONN_STR,{dbName:"soundcrack_db"})
type artistasType= typeof albuns[number]["artista"]
type musicasType = typeof albuns[number]["musicas"]
type artistasFormatType = {nome:string,id:string}
type musicaType = {nome:string,artistas:string[]}

async function setArtistas(artistas:artistasType):Promise<artistasFormatType[]>{
  const ids:{nome:string,id:string}[] = []
  for(const artista of artistas){
    console.log("inserindo artista "+artista.nome)
    const path =  await downloadImage(artista.imagem)
    const artistaSave = new modelArtista({
      nome:artista.nome,
      imagem:path
    })
    const salvo = await artistaSave.save()
    ids.push({
      nome:salvo.nome,
      id:salvo.id.toString()
    })
  }

  return ids
}
async function musicasFormat(musicas:musicasType,artistasIds:artistasFormatType[]):Promise<musicaType[]>{
  const musicasFormatadas:musicaType[] = []
  for(const musica of musicas){
    if(typeof musica=="string"){
      musicasFormatadas.push({nome:musica,artistas:artistasIds.map(a=>a.id)})
      continue
    }
    const artistasAchados = []
    for(const artista of musica.artistas){
      if(typeof artista=="string") {
        const encontrado = artistasIds.find(a=>a.nome==artista)
        console.log(encontrado)
        if(encontrado){
          artistasAchados.push(encontrado.id)
          continue
        }else{
          throw new Error("Artista não encontrado para a musica "+musica.nome)
        }
      }
      const  newArtistas =  new modelArtista({
        nome:artista.nome,
        imagem:await downloadImage(artista.imagem)
      })
      const salvo = await newArtistas.save()
      artistasAchados.push(salvo.id.toString())
    }
    musicasFormatadas.push({nome:musica.nome,artistas:artistasAchados})
  }
  return musicasFormatadas
}
const user = new modelUsers(userSeed)
for(const album of albuns){
  console.log("começando album:"+album.nome)
  let AlbumSave:PropsAlbum&{capa:string,disco:string,aprovado:boolean,musicas:musicaType[]}  ={
    nome:album.nome,
    artistas:[],
    capa:"",
    disco:"",
    preco:0,
    musicas:[],
    genero:album.genero,
    aprovado:true,
    publicante:user.id
  }
  const [imagem,disco] = await Promise.all([
    downloadImage(album.imagem),
    downloadImage(album.disco)
  ])
  const artistasIds = await setArtistas(album.artista)
  const musicas = await musicasFormat(album.musicas,artistasIds)
  AlbumSave.musicas = musicas
  AlbumSave.capa=imagem
  AlbumSave.disco=disco
  AlbumSave.artistas=artistasIds.map(a=>a.id)
  AlbumSave.preco=Number((Math.random()*10).toFixed(2))
  await new  modelAlbum({
    senha:hashSync(user.senha,env.SALT),
    ...AlbumSave
  }).save()
}

conn.connection.close()