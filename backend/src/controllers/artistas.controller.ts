import { modelArtista } from "../models/artista.model.js";
import type { Artista, Id, User } from "../types.js";
import { fazerArquivo } from "../helpers/fazerArquivo.js";
import { modelAlbum } from "../models/albun.model.js";
import { ErrorStatus } from "../helpers/Error.js";

export async function getArtistas(): Promise<Artista[]> {
  return await modelArtista.find();
}

export async function searchArtist(name: string) {
  const regex = new RegExp(`^${name}`);
  const artista = await modelArtista.find({ nome: regex }).select("nome imagem");
  return artista;
}
export async function getOneArtista(id: string): Promise<Artista> {
  let artista = await modelArtista.findById(id);
  if (!artista) {
    throw new ErrorStatus("Artista não encontrado",404);
  }
  const albuns = await modelAlbum.find({ artistas: id})
  .select("nome capa artistas");
  let albumArtistas = Object.assign(artista.toObject(), { albuns });
  return albumArtistas;
}
export async function setArtista(
  nome: string,
  arquivo: { fieldname: string; buffer: Buffer }
) {
  const caminho = await fazerArquivo(arquivo.buffer, arquivo.fieldname);
  const artista =new  modelArtista({ imagem: caminho, nome });
  artista.save();
  return artista.toObject();
}
