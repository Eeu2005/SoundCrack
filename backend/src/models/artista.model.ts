import mongoose from "mongoose";
import type { Artista } from "../types.d.ts";
export const SchemaArtistas = new mongoose.Schema({
  nome: {
    required: true,
    type: String,
  },
    imagem: {
    required: true,
    type: String,
  },
  aprovado:{
    required:true,
    type:Boolean,
    default:false
  }
});
export const modelArtista =  mongoose.model<Artista>("Artistas",SchemaArtistas)