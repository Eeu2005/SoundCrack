import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { env } from "./env.js";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import mongoose, { connect } from "mongoose";
import fastifyMultipart from "@fastify/multipart";
import { RouteArtistas } from "./src/routes/artistas.route.js"
import { RouteAlbuns } from "./src/routes/albuns.route.js";
import fastifyStatic from "@fastify/static";
import { UsersRoute } from "./src/routes/users.route.js";
import fastifyCors from "@fastify/cors";
import { ErrorStatus } from "./src/helpers/Error.js";


const app = fastify().withTypeProvider<ZodTypeProvider>()
app.register(fastifyStatic, {
  root: [import.meta.dirname + "/public/", import.meta.dirname + "/dist/"],
  prefix: "/public",
});
app.register(fastifyCookie,{  
});
app.register(fastifySession, {
 cookie:{
  secure:false
 },
  secret: "SoundcrackSoundcrackSoundcrackSoundcrackSoundcrack",
  
});
app.register(fastifyCors, {
  credentials: true,
  origin: "http://localhost:3000",
});
app.register(fastifyMultipart,{
  attachFieldsToBody:"keyValues",
  async onFile(part) {
      if(!part.mimetype.startsWith("image"))
          throw new ErrorStatus(`${part?.mimetype ?? "tipo de arquivo"} não suportado o tipo deve ser image`,400)
    await this.formData()
  },
})
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(RouteArtistas)
app.register(RouteAlbuns)
app.register(UsersRoute)
app.post("/ping",async e=>{
  console.log(`url:${e.url}\nmethod:${e.method}\n`)
  console.log("body")
  console.log(e.body)
  return "Pingado"
})
if(import.meta.main){

try {
  const connection = await connect(env.CONN_STR, {
    dbName: "soundcrack_db",
  });
  console.log("Connected to database:", connection.connection.name);
} catch (error) {
  console.error("Database connection error:", error);
  process.exit(1);
}

try{
app.listen({
  port: env.PORT,
}).then(()=>{
  console.log(`ligado no http://localhost:${env.PORT}`)
});
}catch(e){
app.log.error(e)
}
}
app.decorate("betterClose")
app.betterClose = (conn:typeof mongoose)=>{
  conn.connection.close().then(()=>{
    console.log("conexão fechada com o banco")
    app.close().then(()=>{
      console.log("servidor fechado")
    })
  })
}
export default app