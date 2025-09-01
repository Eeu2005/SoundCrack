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
import {z} from "zod";
import { downloadImage } from "./downloadImage.js";
import { createReadStream } from "fs";
import mongoose from "mongoose";
import { unlink } from "fs/promises";
const DEFAULT_USER = { email: "user@email.com", senha: "123456", nome: "user" };
const [album] = _;
const [artista] = album.artista;
let idArtista: string;
let artistaImage:string
let cookie: { [key: string]: string };
const conn =  await mongoose.connect(env.CONN_STR,{dbName:"soundcrack_db_test_artista"})
t.before(async () => {
   [artistaImage] = await Promise.all([
   downloadImage(artista.imagem)
  ])
  await modelUsers.deleteMany();
  await modelArtista.deleteMany();
  emptyDir(join(import.meta.dirname, "..", "public"), ".gitkeep");
  await modelUsers.insertOne({
    email: DEFAULT_USER.email,
    senha: hashSync(DEFAULT_USER.senha, env.SALT),
    nome: DEFAULT_USER.nome,
  });
  const res = await app.inject({
    method: "post",
    path: "/login",
    body: DEFAULT_USER,
  });
  t.equal(res.statusCode, 201);
  t.equal(res.body, "Logado");
  cookie = { [res.cookies[0].name]: res.cookies[0].value };
});


t.test("Devera recusar pois não e uma imagem", async () => {
  const formData = new FormData();
  const buffer =  createReadStream("./app.ts");
  formData.append("imagem", buffer);
  formData.append("nome", artista.nome);

  const res = await app.inject({
    path: "/artistas",
    method: "POST",
    body: formData,
    headers: formData.getHeaders(),
    cookies: cookie,
  });
  t.equal(res.statusCode, 400);
  t.match(res.json(), {
    "statusCode": Number,
    "error": String,
    "message": String,
  });
});
t.test("Devera cadastrar um artista", async () => {
  const formData = new FormData();
  const stream =  createReadStream(artistaImage)
  formData.append("imagem",stream)
      formData.append("nome",artista.nome)
       const response =await app.inject({
        method:'POST',
        path:"/artistas",
        body:formData,
        headers:formData.getHeaders(),
        cookies:cookie
       })
      t.equal(response.statusCode,201)
      t.match(response.json(),{
        nome:String,
        imagem:String,
        _id:String,
      })
      idArtista=response.json()._id
});
t.test("devera todos os artistas ", async () => {
  const res = await app.inject({
    method: "GET",
    path: "/artistas",
    //  body: DEFAULT_USER,
  });
  const artistasSchema = z.array(z.object({
    _id: z.string(),
    nome: z.string(),
    imagem: z.string(),
    __v: z.number(),
  }));
  const artistas = artistasSchema.parse(res.json());
  t.ok(artistas, "Artistas fetched");
});

t.test("devera o artistas cadastrado", async (t) => {
  const res = await app.inject({
    method: "GET",
    path: "/artistas/"+idArtista,
    //  body: DEFAULT_USER,
  });
  const artistasSchema = z.object({
    _id: z.string(),
    nome: z.string(),
    imagem: z.string(),
    __v: z.number(),
    albuns:z.array(z.unknown())
  });
  t.equal(res.statusCode,200)
   const {success:artistas,error} = artistasSchema.safeParse(res.json());
   t.ok(artistas, "Artistas fetched");
   t.notOk(error, "Sem erros")
 } );
 t.test("procurar artista que não existe", async (t) => {
  const res = await app.inject({ 
    method: "GET",
    path: "/artistas/64b7f8f4f4d3c2b1a1a1a1a1",
  })
  t.equal(res.statusCode,404)
  t.equal(res.json().message,"Artista não encontrado")
})
t.test("procura artista pelo nome", async (t) => {
const res =await app.inject({
  method:"GET",
  path:`/artistas/search/${artista.nome.slice(0,3)}`,
})
t.equal(res.statusCode,200)
t.matchOnlyStrict(res.json()[0],
  {
    _id:String,
    nome:artista.nome,
    imagem:String,
  })
})
t.teardown(()=>{
  modelUsers.deleteMany()
  app.betterClose(conn)
  unlink(artistaImage)
})