import mongoose from "mongoose";
import type { Album } from "../types.d.ts";


const schemaMusica = new mongoose.Schema({
  nome: String,
  artistas: 
    {
      type: new mongoose.Types.Array(mongoose.Types.ObjectId),
      ref:"Artistas"
    },
  
},{_id:false});
export const AlbumSchema = new mongoose.Schema({
  nome: {
    required: true,
    type: String,
  },
  artistas: {
    required: true,
    type: new mongoose.Types.Array(mongoose.Types.ObjectId),
    ref: "Artistas",
  },
  capa: {
    required: true,
    type: String,
  },
  disco: {
    required: true,
    type: String,
  },
  preco: {
    type: Number,
    required: true,
  },
  musicas: {
    type: [schemaMusica],
  },
  genero: {
    required: true,
    type: String,
  },
  aprovado: {
    required: true,
    type: Boolean,
    default: false,
  },
  publicante: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
});
AlbumSchema.pre("find",function(){
this.populate("artistas",["nome","imagem"])
})
AlbumSchema.pre("findOne", function () {
  this.populate("artistas", "nome");
});
export const modelAlbum = mongoose.model<Album>("albuns", AlbumSchema);
