import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createUserController,
  getAllUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
} from "./users.controller";

import {
  createUserSchema,
  idParamsSchema,
  updateUserSchema,
} from "./users.schema";

export default async function userRoutes(fastify: FastifyInstance) {

  // usando a lib do fastify + zod para validar os dados
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post("/",{schema: {body: createUserSchema,}, preHandler: [app.authenticate] ,}, createUserController);

  app.get("/", { preHandler: [app.authenticate] ,}, getAllUsersController);

  app.get("/:id",{schema: {params: idParamsSchema,} , preHandler: [app.authenticate] ,}, getUserController);

  app.put("/:id",{schema: {params: idParamsSchema,body: updateUserSchema,} , preHandler: [app.authenticate] ,}, updateUserController);

  app.delete("/:id",{schema: {params: idParamsSchema,} , preHandler: [app.authenticate] ,}, deleteUserController);

}