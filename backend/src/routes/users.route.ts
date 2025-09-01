import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  cadastroUsuario,
  loginUsuario,
} from "../controllers/users.controller.js";
import { EmailOla } from "../helpers/emails.js";

export const UsersRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/cadastro",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          nome: z.string(),
          senha: z
            .string()
            .min(5, "A senha deve conter pelo menos 5 caracteres"),
        }),
      },
    },
    async (request, reply) => {
      const { email, senha, nome } = request.body;
      const user = await cadastroUsuario({ email, senha, nome });

      request.session.user = user;
      EmailOla(user);
      return reply.status(201).send("usuario criado");
    }
  );
  fastify.post(
    "/login",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          senha: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, senha } = request.body;
      const user = await loginUsuario(email, senha);
      request.session.user = user;
      return reply.status(201).send("Logado")
    }
  );

  fastify.get("/login", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).send("não logado");
    }
    const {user} = req.session
    const resUser={id:user._id,nome:user.nome,email:user.email,tipo:user.tipo}
    return res.send(resUser);
  });
};
