import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { criarContribuicaoSchema } from "./contribuicao.schema"
import {
    listarContribuicoesController,
    criarContribuicaoController,
    deletarContribuicaoController,
} from "./contribuicao.controller"

export async function contribuicaoRoutes(fastify: FastifyInstance) {
    const app  = fastify.withTypeProvider<ZodTypeProvider>()
    const auth = { preHandler: [app.authenticate] }

    // GET  /metas/:id/contribuicoes
    app.get("/", auth, listarContribuicoesController)

    // POST /metas/:id/contribuicoes
    app.post("/", { ...auth, schema: { body: criarContribuicaoSchema } }, criarContribuicaoController)

    // DELETE /metas/:id/contribuicoes/:cid
    app.delete("/:cid", { ...auth, schema: { body: undefined } }, deletarContribuicaoController)
}