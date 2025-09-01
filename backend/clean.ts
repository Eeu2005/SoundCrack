import {connect}from"mongoose"
import { env } from "./env.js"
import { modelAlbum } from "./src/models/albun.model.js"
import { modelArtista } from "./src/models/artista.model.js"
import { modelUsers } from "./src/models/users.model.js"
import { emptyDir } from "./src/helpers/emptyDir.js"
import  path from "path"



const conn = await connect(env.CONN_STR,{dbName:"soundcrack_db"})
Promise.all([modelAlbum.deleteMany(),
modelArtista.deleteMany(),
modelUsers.deleteMany(),
]).then(()=>console.log("Banco limpo"))
.catch(e=>console.log(e))
.finally(()=>conn.connection.close())
emptyDir(path.join(import.meta.dirname, "public"),".gitkeep").then(()=>console.log("Pasta Public limpa"))