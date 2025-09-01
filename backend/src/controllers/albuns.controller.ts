import { modelAlbum } from "../models/albun.model.js";
import type {
  AlbumPopulado,
  FileProps,
  Musica,
  PropsAlbum,
  User,
} from "../types.js";
import { modelArtista } from "../models/artista.model.js";
import { fazerArquivo } from "../helpers/fazerArquivo.js";
import { isValidObjectId, Types } from "mongoose";
import { modelUsers } from "../models/users.model.js";
import { emailStatusAlbum, } from "../helpers/emails.js";
import { ErrorStatus } from "../helpers/Error.js";

type pagination = {
  page: number;
  per_page: number;
};
const padrao: pagination = {
  page: 1,
  per_page: 10,
};

export async function getAlbumAdmin({ page, per_page }: pagination = padrao) {
  const album = await modelAlbum
    .find<AlbumPopulado>({})
    .skip(per_page * page)
    .limit(page);
  return album;
}
export async function getOneAlbumAdmin(id: string): Promise<AlbumPopulado> {
  const album = await modelAlbum
    .findById<AlbumPopulado>(id)
    .populate("musicas.artistas");
  if (!album) throw new ErrorStatus("Album não encontrado",404);
  return album;
}
export async function getAlbum({
  page,
  per_page,
}: pagination = padrao): Promise<AlbumPopulado[]> {
  const album = await modelAlbum
    .find<AlbumPopulado>({ aprovado: true })
    .limit(per_page)
    .skip(per_page * (page - 1));
  return album;
}
export async function getOneAlbum(id: string): Promise<AlbumPopulado> {
  const busca =  { _id: id};
  const album = await modelAlbum
    .findOne<AlbumPopulado>(busca)
    .populate("musicas.artistas");
  if (!album ) throw new ErrorStatus("Album não encontrado",404);
  if (!album.aprovado) throw new ErrorStatus("Album esta para em Análise",401);
  return album;
}

export async function searchAlbum(name: string) {
  const regex = new RegExp(`^${name}`);
  const artista = await modelAlbum.find({ nome: regex , aprovado:true }).select("nome capa artistas");
  return artista;
}

export async function getRandonAlbum(): Promise<AlbumPopulado> {
  const album = await modelAlbum.aggregate<AlbumPopulado>([
    {
      $lookup: {
        from: "artistas",
        as: "artistas",
        foreignField: "_id",
        localField: "artistas",
      },
    },
    { $sample: { size: 1 } },
  ]);

  return album[0];
}

export async function setAlbum(album: PropsAlbum, files: FileProps[]) {
  if (!(await modelUsers.exists({ _id: album.publicante }))) {
    throw new Error("usuario não encontrado");
  }
    for (const e of album.artistas) {
      if (!Types.ObjectId.isValid(e)) {
        throw new Error("codigo invalido");
      }
      if (!(await modelArtista.exists({ _id: e }))) {
        throw new Error("não existe artista com esse id:" + e);
      }
    }
    
  const [capaCaminho,discoCaminho]= await Promise.all([
    fazerArquivo(files[0].buffer, files[0].fieldname),
    fazerArquivo(files[1].buffer, files[1].fieldname)])
  return await new modelAlbum({
    preco: album.preco,
    nome: album.nome,
    artistas: album.artistas,
    genero: album.genero,
    capa: capaCaminho,
    disco: discoCaminho,
    publicante: album.publicante,
  }).save();
}

export async function putMusic(musicas: Musica[], id: string, userId: string) {
  if(!isValidObjectId(id)|| !isValidObjectId(userId)) throw new ErrorStatus("id invalido",400)
  const album = await modelAlbum.findOne({ _id: id, publicante: userId });
  if (!album) {
    throw new Error("Album não encontrado");
  }
  album.depopulate("artistas");
  for (const musica of musicas) {

    if (!musica.artistas) {
      musica.artistas = album.artistas;
      continue;
    }
    for (const artista of musica.artistas) {
      if (! await modelArtista.exists({ _id: artista }))
        throw new ErrorStatus("Artista desconhecido " + artista,400);
    }
  }
  await album.updateOne({
    $set: {
      musicas,
    },
  });
}
export async function getGeneros() {
  const generos = await modelAlbum.distinct("genero");
  return generos;
}
export async function atualizarSituacao(id: string, status: boolean) {
  const album = await modelAlbum.findById(id).populate("publicante");
  
  if (!album) {
    throw new Error("Album não encontrado");
  }
  if (album.musicas.length === 0) {
    throw new ErrorStatus("Album sem musicas",400);
  }
  album.aprovado= status
  await album.save()
  emailStatusAlbum(album, album.publicante);
  return album.aprovado;
}
