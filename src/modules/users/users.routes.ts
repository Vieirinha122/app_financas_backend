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

  app.post("/",{schema: {body: createUserSchema,},}, createUserController);

  app.get("/", getAllUsersController);

  app.get("/:id",{schema: {params: idParamsSchema,},}, getUserController);

  app.put("/:id",{schema: {params: idParamsSchema,body: updateUserSchema,},}, updateUserController);

  app.delete("/:id",{schema: {params: idParamsSchema,},}, deleteUserController);

}