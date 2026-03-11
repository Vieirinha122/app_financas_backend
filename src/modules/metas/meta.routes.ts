import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { criarMetaSchema, atualizarMetaSchema, atualizarStatusSchema } from "./meta.schema"
import {
    listarMetasController,
    getMetaController,
    criarMetaController,
    atualizarMetaController,
    atualizarStatusController,
    deletarMetaController,
} from "./meta.controller"
import { contribuicaoRoutes } from "./contribuicao/contribuicao.routes"

export async function metaRoutes(fastify: FastifyInstance) {
    const app  = fastify.withTypeProvider<ZodTypeProvider>()
    const auth = { preHandler: [app.authenticate] }

    app.get   ("/",           auth,                                                listarMetasController)
    app.get   ("/:id",        auth,                                                getMetaController)
    app.post  ("/",           { ...auth, schema: { body: criarMetaSchema      } }, criarMetaController)
    app.put   ("/:id",        { ...auth, schema: { body: atualizarMetaSchema  } }, atualizarMetaController)
    app.patch ("/:id/status", { ...auth, schema: { body: atualizarStatusSchema} }, atualizarStatusController)
    app.delete("/:id",        auth,                                                deletarMetaController)

    // sub-módulo de contribuições: /metas/:id/contribuicoes
    app.register(contribuicaoRoutes, { prefix: "/:id/contribuicoes" })
}