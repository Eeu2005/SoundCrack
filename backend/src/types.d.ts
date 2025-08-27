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
    artistas:Id[]
  }[],
  publicante:User
}
interface AlbumPopulado extends Album {
  artistas: Artista[];
  musicas: {
    nome: string;
    artistas: Artista[];
  }[];
}
export interface FileProps {
  fieldname: string;
  buffer: Buffer;
}
interface PropsAlbum {
  nome: string;
  preco:number
  artistas: string[] ;
  genero: string;
  publicante:string
}
interface Musica{
    nome:string,
    artistas?:string[]
  }

  interface User extends Document {
  _id: Id;
    email: string;
    nome:string
    tipo: "padrao" | "admin";
    senha: string;
    albuns:Id[]
  }
declare module "fastify" {
  interface FastifyInstance{
     betterClose(con:Mongoose):void
  }
  interface Session {
    user:User 
  }
}
declare  global{
 interface ImportMeta {
   dirname: string;
   filename: string;
   main: boolean;
   resolve: () => boolean;
   url: string;
 }
}
