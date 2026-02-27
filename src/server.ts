import fastify from "fastify";
import { errorHandler } from "./plugins/error.handler";
import sensible from "@fastify/sensible";
import {serializerCompiler, validatorCompiler} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import prismaPlugin from "./plugins/prisma";
import dotenv from "dotenv";
import usersRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import { FastifyRequest, FastifyReply } from "fastify";

dotenv.config();

const app = fastify();

// Validação com zod com nova lib
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(sensible);

app.register(cors, {
  origin: "*",
});

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

app.get("/", async (request, reply) => {
  return "Rodando";
});

app.register(usersRoutes, { prefix: "/usuarios" });
app.register(authRoutes, { prefix: "/auth" });

app.listen({ port: 3333 }, () => {
  console.log("Rodando");
});