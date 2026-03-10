import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { atualizarPerfilSchema, atualizarSenhaSchema } from "./profile.schema"
import { getPerfilController, atualizarPerfilController, atualizarSenhaController } from "./profile.controller"

export async function profileRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const auth = { preHandler: [app.authenticate] }

  app.get("/", auth, getPerfilController)

  app.put("/", { ...auth, schema: { body: atualizarPerfilSchema } }, atualizarPerfilController)

  app.put("/senha", { ...auth, schema: { body: atualizarSenhaSchema } }, atualizarSenhaController)
}