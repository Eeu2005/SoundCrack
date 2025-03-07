import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  getArtistas,
  getOneArtista,
  setArtista,
} from "../controllers/artistas.controller.ts";
import { z } from "zod";
export const RouteArtistas: FastifyPluginAsyncZod = async (fastify) => {


  fastify.get("/artistas",async (request,reply) => {
    const artistas = await getArtistas()
    if(artistas.length<=0){
    return reply.status(204).send() ;
    }
     return reply.status(200).send(artistas);
  });

  fastify.get(
    "/artistas/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    (request, reply) => {
      const { id } = request.params;
      return getOneArtista(id);
    }
  );

  fastify.post(
    "/artistas",
    {
      schema: {
        body: z.object({
          imagem: z.custom<Buffer>(),
          nome: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const {imagem,nome} =request.body
      console.log(nome)
      return await setArtista(nome,{fieldname:"imagem",buffer:imagem});
    }
  );
};

