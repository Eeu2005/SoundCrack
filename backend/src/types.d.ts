import type { Document, Mongoose, ObjectId } from "mongoose"

interface Artista  {
  _id: Id;
  nome: string;
  imagem: string;
}
type Id = string;

interface Album{
  _id:Id,
  artistas:Id[],
  preco:number
  nome:string,
  capa:string,
  disco:string,
  genero:string,
  aprovado:boolean,
  musicas:{
    nome:string,
    artistsas:Id[]
  }[]
}
interface AlbumPopulado extends Album {
  artistas: Artista[];
  musicas: {
    nome: string;
    artistsas: Artista[];
  }[];
}
export interface FileProps {
  fieldname: string;
  buffer: Buffer;
}
interface PropsAlbum {
  nome: string;
  preco:number
  artistas: string[] | string;
  novoArtistas: string[] | string | undefined;
  genero: string;
}
interface Musica{
    nome:string,
    artistas?:string[]
  }

  interface User extends Document {
  _id: Id;
    email: string;
    tipo: "padrao" | "admin";
    senha: string;
    albuns:Id[]
  }
declare module "fastify" {
  interface Session {
    user:User 
  }
}