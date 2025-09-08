export interface AlbumType extends AlbumRes {
  corAlbum: string;
}
export interface AlbumRes {
  _id: string;
  artistas: { nome: string; imagem: string }[];
  preco: number;
  nome: string;
  capa: string;
  disco: string;
  genero: string;
  aprovado: boolean;
  musicas: {
    nome: string;
    artistas: { nome: string; imagem: string }[];
  }[];
}

interface User{
  username:string,
  email:string
}

declare global {
  namespace React {
    interface CSSProperties {
      "--corAlbum"?: string;
    }
  }
}