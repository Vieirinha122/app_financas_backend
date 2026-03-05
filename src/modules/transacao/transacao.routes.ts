import {FastifyInstance} from "fastify";
import { criarTransacaoController, getAllTransacoesController, getTransacaoController, atualizarTransacaoController, deletarTransacaoController } from "./transacao.controller";
import { criarTransacaoSchema, atualizarTransacaoSchema, listagemTransacaoSchema, idParamsSchema } from "./transacao.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function transacaoRoutes(fastify: FastifyInstance) {

    const app = fastify.withTypeProvider<ZodTypeProvider>();

    app.post("/", {preHandler: [fastify.authenticate], schema: {body: criarTransacaoSchema}}, criarTransacaoController);
    app.get("/", {preHandler: [fastify.authenticate], schema: {querystring: listagemTransacaoSchema}}, getAllTransacoesController);
    app.get("/:id", {preHandler: [fastify.authenticate], schema: {params: idParamsSchema}}, getTransacaoController);
    app.put("/:id", {preHandler: [fastify.authenticate], schema: {params: idParamsSchema, body: atualizarTransacaoSchema}}, atualizarTransacaoController);
    app.delete("/:id", {preHandler: [fastify.authenticate], schema: {params: idParamsSchema}}, deletarTransacaoController);
}