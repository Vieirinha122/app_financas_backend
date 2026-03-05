import fastify, { FastifyInstance } from "fastify";
import { errorHandler } from "./plugins/error.handler";
import sensible from "@fastify/sensible";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import prismaPlugin from "./plugins/prisma";
import dotenv from "dotenv";
import usersRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import { FastifyRequest, FastifyReply } from "fastify";
import transacaoRoutes from "./modules/transacao/transacao.routes";

dotenv.config();

let app: FastifyInstance;

function buildApp(): FastifyInstance {
  if (app) return app; // reutiliza instância entre requests (warm start)

  app = fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(sensible);
  app.register(cors, { origin: "*" });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
  });

  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });

  app.register(prismaPlugin);
  app.register(errorHandler);

  app.get("/", async () => "Rodando");

  app.register(usersRoutes, { prefix: "/usuarios" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(transacaoRoutes, { prefix: "/transacoes" });

  return app;
}

export default async function handler(req: any, res: any) {
  const server = buildApp();
  await server.ready();
  server.server.emit("request", req, res);
}

if (process.env.VERCEL !== "1") {
  buildApp().listen({ port: 3333, host: "0.0.0.0" }, () => {
    console.log("Rodando na porta 3333");
  });
}