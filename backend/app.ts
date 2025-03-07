import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { env } from "./env.ts";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { connect } from "mongoose";
import fastifyMultipart from "@fastify/multipart";
import { RouteArtistas } from "./src/routes/artistas.route.ts"
import { RouteAlbuns } from "./src/routes/albuns.route.ts";
import fastifyStatic from "@fastify/static";
import { UsersRoute } from "./src/routes/users.route.ts";
import fastifyCors from "@fastify/cors";


connect(env.CONN_STR,{
  dbName:"soundcrack_db",
})
  .then((e) => console.log("con", e.connection.name))
  .catch((e) => {console.error(e);
  process.exit(0)});

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyStatic,{
  root:import.meta.dirname+"/public/",
  prefix:"/public",
  
})
app.register(fastifyCookie,{  
});
app.register(fastifySession, {
 cookie:{
  secure:false
 },
  secret: "SoundcrackSoundcrackSoundcrackSoundcrackSoundcrack",
  
});
app.register(fastifyCors,{
  origin:"*"
})
app.register(fastifyMultipart,{
  attachFieldsToBody:"keyValues",
  async onFile(part) {
      if(!part.mimetype.startsWith("image")){
        throw new Error(`${part.fieldname} deve ser uma imagem`)
      }
    await this.formData()
  },
})
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(RouteArtistas)
app.register(RouteAlbuns)
app.register(UsersRoute)

try{
app.listen({
  port: env.PORT,
}).then(()=>{
  console.log("ligado no http://localhost:1600")
});
}catch(e){
app.log.error(e)
process.exit(1)
}