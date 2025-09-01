import { t } from "tap";
process.env.EM_TESTE = "true";
import app from "../app.js";
import { modelUsers } from "../src/models/users.model.js";
import { modelArtista } from "../src/models/artista.model.js";
import { join } from "path";
import FormData from "form-data";
import _ from "../seed/seedAlbuns.json" with { type: "json" };
import { hashSync } from "bcrypt";
import { env } from "../env.js";
import { emptyDir } from "../src/helpers/emptyDir.js";
import { downloadImage } from "./downloadImage.js";
import { createReadStream, promises } from "fs";
import { modelAlbum } from "../src/models/albun.model.js";
import type { Artista } from "../src/types.js";
import mongoose from "mongoose";

const DEFAULT_USER = { email: "user@email.com", senha: "123456", nome: "user" };
const ADMIN_USER = { email: "admin@email.com", senha: "123456", nome: "admin" };
const [album] = _;
const [artista] = album.artista;
let idAlbum:string
let ArtistaDoc:Artista;
let artistaImage:string,capaImage:string,discoImage:string;
const conn = await mongoose.connect(env.CONN_STR,{dbName:"soundcrack_db_test_album"})
let cookiePadrao  :{ [key: string]: string };
let cookieAdmin  :{ [key: string]: string };
t.before(async () => {
	[artistaImage,capaImage,discoImage] = await Promise.all([
		downloadImage(artista.imagem),
    downloadImage(album.imagem),
    downloadImage(album.disco),
	]);
	await modelUsers.deleteMany();
	await modelArtista.deleteMany();
  await modelAlbum.deleteMany()
	emptyDir(join(import.meta.dirname, "..", "public"), ".gitkeep");
	await modelUsers.insertOne({
		email: DEFAULT_USER.email,
		senha: hashSync(DEFAULT_USER.senha, env.SALT),
		nome: DEFAULT_USER.nome,
	});
  await modelUsers.insertOne({
		email: ADMIN_USER.email,
		senha: hashSync(ADMIN_USER.senha, env.SALT),
		nome: ADMIN_USER.nome,
    tipo:"admin"
	});
	// Cadastra o artista manualmente para uso nos testes
	const artistaDoc = await modelArtista.create({
		nome: artista.nome,
		imagem: artistaImage,
	});
  artistaDoc.save()
	ArtistaDoc = artistaDoc.toObject()
	// Faz login para obter o cookie
	const res = await app.inject({
		method: "post",
		path: "/login",
		body: DEFAULT_USER,
	});
	cookiePadrao = { [res.cookies[0].name]: res.cookies[0].value };
	const res2 = await app.inject({
		method: "post",
		path: "/login",
		body: ADMIN_USER,
	});
	cookieAdmin = { [res2.cookies[0].name]: res2.cookies[0].value };
});



t.test("Cadastrar um album",async(t)=>{
  const form = new FormData()
  form.append("nome",album.nome)
  form.append("genero",album.genero)
  form.append("artistas",ArtistaDoc._id.toString())
  form.append("preco",album.preco)
  form.append("capa",createReadStream(capaImage))
  form.append("disco",createReadStream(discoImage))
  const res = await app.inject({
    method:"POST",
    path:"/albuns",
    body:form,
    headers:form.getHeaders(),
    cookies:cookiePadrao
  })
  idAlbum = res.json()._id
t.equal(res.statusCode,201)

t.notMatch(res.json(),
  {"statusCode":Number,
  "code":String,"error":String,
  "message":String},
  "deve retornar o id do album")


})



t.test("Aprovando album sem musica ",async(t)=>{
  const res = await app.inject({
    method:"PUT",
    path:`/albuns/${idAlbum}`,
    cookies:cookieAdmin,
    body:{status:true}
  })
  t.equal(res.statusCode,400)
  t.equal(res.json().message,"Album sem musicas")
})  



t.test("cadastro musicas com id Errado",async t=>{
const musicas = album.musicas.map(e=>{
  if(typeof e === "string"){
    return {
      nome:e,
      artistas:[ArtistaDoc._id.toString()]
    }
  }
  return {
    nome:e.nome,
    artistas:[ArtistaDoc._id.toString()]
  }
})
musicas[0].artistas = ["64a4f0c2e6f2c2b1c8e4d123"]
const res = await app.inject({
  method:"POST",
  path:`/albuns/${idAlbum}`,
  body:musicas,
  cookies:cookiePadrao
})
t.equal(res.statusCode,400,"deve retornar 400")
t.equal(res.json().message,"Artista desconhecido 64a4f0c2e6f2c2b1c8e4d123")
t.end()
})

t.test("cadastro musicas",async t=>{
const musicas = album.musicas.map(e=>{
  if(typeof e === "string"){
    return {
      nome:e,
      artistas:[ArtistaDoc._id.toString()]
    }
  }
  return {
    nome:e.nome,
    artistas:[ArtistaDoc._id.toString()]
  }
})
const res = await app.inject({
  method:"POST",
  path:`/albuns/${idAlbum}`,
  body:musicas,
  cookies:cookiePadrao
})
t.equal(res.statusCode,201,"deve retornar 201")
t.equal(res.body,"")
t.end()
})
t.test("Devera falhar pois esta sem logar",async(t)=>{
  const form = new FormData()
  form.append("nome",album.nome)
  form.append("genero",album.genero)
  form.append("preco",album.preco)
  form.append("artistas",JSON.stringify([ArtistaDoc._id]))
  form.append("capa",createReadStream(capaImage))
  form.append("disco",createReadStream(discoImage))
  const res = await app.inject({
    method:"POST",
    path:"/albuns",
    body:form,
    headers:form.getHeaders(),
  })
t.equal(res.statusCode,401)
t.equal(res.body,"Você precisa estar logado para fazer isso","mensagem de erro ")
})
t.test("Aprovando album com usuario padrao ",async(t)=>{
  const res = await app.inject({
    method:"PUT",
    path:`/albuns/${idAlbum}`,
    cookies:cookiePadrao,
    body:{status:true}
  })
  t.equal(res.statusCode,401)
  t.equal(res.body,"Acesso negado")
})  

t.test("Pegando musica antes de ser aprovado",async(t)=>{
  const res = await app.inject({
    method:"GET",
    path:`/albuns/${idAlbum}`,
    cookies:cookiePadrao,
  })
  t.equal(res.statusCode,401)
  t.equal(res.json().message,"Album esta para em Análise")
})  
t.test("Pegando musica antes de ser aprovado mas sendo admin",async(t)=>{
  const res = await app.inject({
    method:"GET",
    path:`/albuns/${idAlbum}`,
    cookies:cookieAdmin,
  })
  t.equal(res.statusCode,200)
  t.match(res.json(),{
    _id:String,
    nome:String,
    genero:String,
    preco:Number,
    capa:String,
    disco:String,
    aprovado:Boolean,
    publicante:String,
    artistas:Array,
    musicas:Array,
    __v:Number
  })
})  
t.test("Aprovando um album",async(t)=>{
  const res = await app.inject({
    method:"PUT",
    path:`/albuns/${idAlbum}`,
    cookies:cookieAdmin,
    body:{status:true}
  })
  t.equal(res.statusCode,200)
  t.equal(res.json().message,"Situação atualizada")
  t.equal(res.json().status,true)
})

t.test("Pegando musica que esta aprovado",async(t)=>{
  const res = await app.inject({
    method:"GET",
    path:`/albuns/${idAlbum}`,
    cookies:cookiePadrao,
  })
  t.equal(res.statusCode,200)
  t.match(res.json(),{
    _id:String,
    nome:String,
    genero:String,
    preco:Number,
    capa:String,
    disco:String,
    aprovado:Boolean,
    publicante:String,
    artistas:Array,
    musicas:Array,
    __v:Number
  })
})  

t.test("Pegando musica Randomica",async(t)=>{
  const res = await app.inject({
    method:"GET",
    path:`/albuns/rand`,
    cookies:cookiePadrao,
  })
  t.equal(res.statusCode,200)
  t.match(res.json(),{
    _id:String,
    nome:String,
    genero:String,
    preco:Number,
    capa:String,
    disco:String,
    aprovado:Boolean,
    publicante:String,
    artistas:Array,
    musicas:Array,
    __v:Number
  })
})  

t.test("Pegando generos",async(t)=>{
  const res = await app.inject({
    method:"GET",
    path:`/generos`,
    cookies:cookiePadrao,
  })
  t.equal(res.statusCode,200)
  t.equal(res.json().length,1)
  t.equal(res.json()[0],album.genero)
})  

t.test("procurar Album que não existe", async (t) => {
  const res = await app.inject({ 
    method: "GET",
    path: "/albuns/64b7f8f4f4d3c2b1a1a1a1a1",
  })
  t.equal(res.statusCode,404)
  t.equal(res.json().message,"Album não encontrado")
})

t.test("procura album pelo nome", async (t) => {
const res =await app.inject({
  method:"GET",
  path:`/albuns/search/${album.nome.slice(0,3)}`,
})
t.matchOnlyStrict(res.json()[0],
  {
    _id:String,
    nome:album.nome,
    capa:String,
    artistas:Array
  })
})



t.teardown(()=>{
  modelUsers.deleteMany()
 Promise.all([ 
  promises.unlink(artistaImage),
  promises.unlink(capaImage),
  promises.unlink(discoImage)])
  app.betterClose(conn)
})
