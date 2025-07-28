import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  getAlbum,
  getOneAlbum,
  getRandonAlbum,
  putMusic,
  setAlbum,
  getGeneros,
  getAlbumAdmin,
  atualizarSituacao,
  getOneAlbumAdmin,
} from "../controllers/albuns.controller.ts";
import { z } from "zod";
import type { AlbumPopulado, FileProps } from "../types.js";
import { EmailNovoAlbum } from "../helpers/emails.ts";

export const RouteAlbuns: FastifyPluginAsyncZod = async (fastify) => {
  fastify.setErrorHandler((err, request, reply) => {
    reply.status(400).send(err);
  });

  fastify.get("/albuns", async (request, reply) => {
    if(request.session.user !== undefined &&  request.session.user.tipo === "admin"){
    const albuns =await getAlbumAdmin()
    return albuns;
    }
    const albuns = await getAlbum();
    albuns.forEach(
      (album) =>
        (album.capa = request.protocol + "://" + request.host + album.capa)
    );
    return albuns;
  });

  fastify.get(
    "/albuns/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      let  album:AlbumPopulado

      if(request.session.user !== undefined &&  request.session.user.tipo === "admin"){
      album = await getOneAlbumAdmin(id);
      }else{
        album = await getOneAlbum(id);
      }
      // album.capa = request.protocol + "://" + request.host + album.capa;
      return album
    }
  );
  fastify.get("/albuns/rand",async (request,reply)=>{
    const album = await getRandonAlbum()
    return album
  })

  fastify.post(
    "/albuns",
    {
      schema: {
        body: z.object({
          nome: z.string(),
          genero: z.string(),
          preco: z.coerce.number(),
          artistas: z.string().or(z.string().array()),
          capa: z.custom<Buffer>(),
          disco: z.custom<Buffer>(),
        }),
      },
    },
    async (request, reply) => {
      if(request.session.user === undefined){
        return reply.status(401).send("Você precisa estar logado para fazer isso")
      }
      const { artistas, nome, capa, disco, genero,preco } = request.body;
      const {id:publicante} = request.session.user
      console.log(publicante)
      const files: FileProps[] = [
        { fieldname: "capa", buffer: capa },
        { fieldname: "disco", buffer: disco },
      ];
     const album = await setAlbum({ artistas, nome, genero, preco,publicante }, files)
      EmailNovoAlbum(album,request.session.user)
    return reply.status(201).send(album._id);
    }
  );
  fastify.post(
    "/albuns/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z
          .object({
            nome: z.string(),
            artistas: z.string().array().optional(),
          })
          .array(),
      },
    },
    async (request, reply) => {
      const { params, body } = request;
      const {id:idUser} = request.session.user
      if (!idUser) {
        return reply
          .status(401)
          .send("Você precisa estar logado para fazer isso");
      }
      await putMusic(body, params.id, idUser);
      reply.status(201).send();
    }
  );

  fastify.get("/generos", async (request, reply) => getGeneros())

  fastify.put(
    "/albuns/:id",
    {
      schema:{
        params:z.object({
          id:z.string()
        }),
        body:z.object({
          status:z.boolean()
        })
      }
    },async (request,reply)=>{
      if ( request.session.user === undefined || request.session.user.tipo !== "admin") {
       return  reply.status(401).send("Acesso negado");
      }
      const {id} = request.params
      const {status}= request.body
      await atualizarSituacao(id,status)
    return  reply.status(200).send("Situação atualizada")
    }
  )
};
