import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  getArtistas,
  getOneArtista,
  searchArtist,
  setArtista,
} from "../controllers/artistas.controller.js";
import { z } from "zod";
export const RouteArtistas: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get("/artistas", async (request, reply) => {
    const artistas = await getArtistas();
    return reply.status(200).send(artistas);
  });
  fastify.get(
    "/artistas/search/:nome",
    {
      schema: {
        params: z.object({
          nome: z.string(),
        }),
      },
    },
    (req, res) => {
      const { nome } = req.params;
      return searchArtist(nome);
    }
  );
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
      if (request.session.user === undefined) {
        return reply
          .status(401)
          .send("Você precisa estar logado para fazer isso");
      }
      const { imagem, nome } = request.body;
       reply.status(201)
        return setArtista(nome, { fieldname: "imagem", buffer: imagem });
    }
  );
};
