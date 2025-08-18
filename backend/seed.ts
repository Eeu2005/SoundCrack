import { connect } from "mongoose";
import albuns from "./seed/seedAlbuns.json" with {type:"json"};
import user from "./seed/userSeed.json" with {type:"json"};
import { modelArtista } from "./src/models/artista.model.js";
import { get } from "https";
import { createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { modelAlbum } from "./src/models/albun.model.js";
import { env } from "./env.js"
import { modelUsers } from "./src/models/users.model.js";
import { hashSync} from "bcrypt"
const con =await connect(env.CONN_STR, {
  dbName: "soundcrack_db",
});
console.log("conectado"+ con.connection.name)
const fetchImage =(imagem:string,caminho:string)=>{
  const write=  createWriteStream(".".concat(caminho));
  get(imagem,(res)=>{
      res.on("readable",()=>{
        res.read()
      })
      res.on("data",(chunk)=>{
        write.write(chunk)
      })
      
        
     res.on("error",(err)=>{
     return err
     })
     res.on("close",()=>{
     
     })
     
  })

  
}







rmSync("./public/",{force:true,recursive:true,})
mkdirSync("./public")
writeFileSync("./public/.gitkeep","",)

await Promise.all([modelAlbum.deleteMany().exec(),modelArtista.deleteMany().exec(),modelUsers.deleteMany().exec()])

for (const album of albuns){
  console.log("começando albun"+album.nome)
  const artistas =  await Promise.all(album.artista.map(async ar=>{
  let caminho = "/public/" + Date.now().toString() + ar.nome[3]+"artista.jpeg";
   fetchImage(ar.imagem,caminho)
  console.log("criando Artista:"+ar.nome,caminho)
  return new modelArtista({nome:ar.nome,imagem:caminho}).save()
}))
  const caminhoCapa = "/public/" + Date.now().toString() + "capa.jpeg";
  const caminhoDisco = "/public/" + Date.now().toString() + "disco.jpeg";
  fetchImage(album.imagem,caminhoCapa)
  fetchImage(album.disco,caminhoDisco)
  const musicas = await Promise.all(album.musicas.map(async mus=>{
    console.log(mus)
    if(typeof mus === "string"){
      return {
        nome:mus,
        artistas:artistas.map(e=>e._id)
      }
    }
    const artistasFetured = await Promise.all(
      mus.artistas
        .filter((e) => typeof e === "object")
        .map((ar) => {
          // ts-ignore
          if(!ar?.imagem) return
          let caminho = "/public/" + Date.now().toString() + "artista.jpeg";
          fetchImage(ar.imagem,caminho);
          
          console.log("criando Artista:" + ar.nome);
          return new modelArtista({
            nome: ar.nome,
            imagem: caminho,
            aprovado:true
           }).save();
        })
    );
    artistasFetured.push(...artistas)
  return {
    nome: mus.nome,
    artistas: artistasFetured
      .filter((a) => typeof a !== "undefined")
      .map((e) => e._id),
  };    
  }))
   new  modelAlbum({
  artistas:artistas.map(e=>e._id),
  nome:album.nome,
  genero:album.genero,
  disco:caminhoDisco,
  capa:caminhoCapa,
  musicas:musicas,
  preco:album.preco,
  aprovado:true
}).save().then((e)=>{
  console.log("album criado " +e.nome )
})
}
/*--- criando usuario administrador */

modelUsers.insertOne({
  email:user.email,
  nome:user.nome,
  senha:hashSync(user.senha,env.SALT),
  tipo:user.tipo
}).then((e)=>{
console.log("usuario administrador criado")
console.log(user);
con.connection.close()
})


