import type { AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from "axios";


interface Artista {
  _id: Id;
  nome: string;
  imagem: string;
}
type Id = string;

interface Album {
  _id: Id;
  artistas: Id[];
  nome: string;
  capa: string;
  disco: string;
  genero: string;
  preco: number;
  musicas: {
    nome: string;
    artistas: Id[];
  }[];
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
  artistas: string[];
  genero: string;
}
interface Musica {
  nome: string;
  artistas?: string[];
}

interface User {
  email: string;
  tipo: "padrao" | "admin";
  senha: string;
  albuns: Id[];
}
