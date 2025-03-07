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
import {pushAlbum} from "../controllers/users.controller.ts";
import { z } from "zod";
import type { AlbumPopulado, FileProps } from "../types.js";

export const RouteAlbuns: FastifyPluginAsyncZod = async (fastify) => {
  fastify.setErrorHandler((err, request, reply) => {
    reply.status(400).send(err);
  });

  fastify.get("/albuns", async (request, reply) => {
    if(request.session.user !== undefined &&  request.session.user.tipo === "admin"){
    const albuns =await getAlbumAdmin()
    albuns.forEach(album=>album.capa = request.protocol+"://"+request.host +album.capa)
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
      album.capa = request.protocol + "://" + request.host + album.capa;
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
          novoArtistas: z.string().array().optional().or(z.string().optional()),
          capa: z.custom<Buffer>(),
          disco: z.custom<Buffer>(),
        }),
      },
    },
    async (request, reply) => {
      if(request.session.user === undefined){
        return reply.status(401).send("Você precisa estar logado para fazer isso")
      }
      const { artistas,novoArtistas, nome, capa, disco, genero,preco } = request.body;
      console.log(preco)
      const files: FileProps[] = [
        { fieldname: "capa", buffer: capa },
        { fieldname: "disco", buffer: disco },
      ];
     const album = await setAlbum({ artistas, nome, genero, preco,novoArtistas }, files)
     console.log(album)
      await pushAlbum(request.session.user._id,album._id)
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
      await putMusic(body, params.id);
      reply.status(201).send();
    }
  );

  fastify.get("/generos", async (request, reply) => {
    const generos = await getGeneros()
    return generos
  })

  fastify.put(
    "/albuns/:id",
    {
      schema:{
        params:z.object({
          id:z.string()
        })
      }
    },async (request,reply)=>{
      if ( request.session.user === undefined || request.session.user.tipo !== "admin") {
       return  reply.status(401).send("Acesso negado");
      }
      const {id} = request.params
      await atualizarSituacao(id)
      reply.status(200).send("Situação atualizada")
    }
  )
};
